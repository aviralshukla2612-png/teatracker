import React, { useState, useEffect } from 'react';
import userService from '../services/userService';
import './UserManagement.css';

export default function UserManagement({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newSubAdmin, setNewSubAdmin] = useState({ name: '', email: '', password: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showPassAdd, setShowPassAdd] = useState(false);
  const [showPassEdit, setShowPassEdit] = useState(false);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await userService.getAll();
      if (res.success) {
        setUsers(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load sub admins');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser === 'Super Admin') {
      fetchUsers();
    }
  }, [currentUser]);

  const handleToggleStatus = async (id) => {
    try {
      await userService.toggleStatus(id);
      fetchUsers(); // Refresh the list
    } catch (err) {
      alert(err.response?.data?.message || 'Error toggling status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this sub admin?')) return;
    try {
      await userService.delete(id);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting user');
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await userService.create(newSubAdmin.name, newSubAdmin.email, newSubAdmin.password);
      setNewSubAdmin({ name: '', email: '', password: '' });
      setIsAdding(false);
      setShowPassAdd(false);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create sub admin');
    }
  };

  const handleEditClick = (user) => {
    setEditingUser({ id: user.id, name: user.name, email: user.email, password: '' });
    setShowPassEdit(false);
    setIsEditing(true);
  };

  const handleViewClick = (user) => {
    setEditingUser({ id: user.id, name: user.name, email: user.email, password: '' });
    setIsViewing(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await userService.update(editingUser.id, editingUser.name, editingUser.email, editingUser.password);
      setIsEditing(false);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user');
    }
  };

  if (currentUser !== 'Super Admin') {
    return <div className="um-container"><h2>Unauthorized. Super Admin only.</h2></div>;
  }

  return (
    <div className="um-container">
      <div className="um-header-bar">
        <h2 className="um-title">Sub Admins</h2>
        <button className="btn btn-primary" onClick={() => setIsAdding(true)}>+ Add Sub Admin</button>
      </div>

      {error && <div className="um-alert um-alert-danger">{error}</div>}

      <div className="um-card">
        {isLoading ? (
          <div className="um-loading">Loading users...</div>
        ) : (
          <div className="um-table-wrapper">
            <table className="um-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td><strong>{user.name}</strong></td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`um-role-badge um-role-${user.role}`}>
                        {user.role === 'super_admin' ? 'Super Admin' : 'Sub Admin'}
                      </span>
                    </td>
                    <td>
                      <span className={`um-status-badge um-status-${user.is_active ? 'active' : 'inactive'}`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="text-right um-actions">
                      {user.role === 'sub_admin' && (
                        <>
                          <button 
                            className="btn btn-sm btn-outline" 
                            onClick={() => handleViewClick(user)}
                            title="View"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                          </button>
                          <button 
                            className="btn btn-sm btn-outline" 
                            onClick={() => handleEditClick(user)}
                            title="Edit"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          </button>
                          <button 
                            className="btn btn-sm btn-outline" 
                            onClick={() => handleToggleStatus(user.id)}
                            title={user.is_active ? 'Deactivate' : 'Activate'}
                          >
                            {user.is_active ? '🚫' : '✅'}
                          </button>
                          <button 
                            className="btn btn-sm um-btn-delete" 
                            onClick={() => handleDelete(user.id)}
                            title="Delete"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="5" className="um-empty">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Sub Admin Modal */}
      {isAdding && (
        <div className="um-modal-overlay" onClick={() => setIsAdding(false)}>
          <div className="um-modal" onClick={e => e.stopPropagation()}>
            <h3 className="um-modal-title">Create Sub Admin</h3>
            <form onSubmit={handleAddSubmit}>
              <div className="um-form-group">
                <label>Name</label>
                <input 
                  type="text" 
                  required 
                  className="form-input"
                  value={newSubAdmin.name}
                  onChange={e => setNewSubAdmin({ ...newSubAdmin, name: e.target.value })}
                  placeholder="e.g. John Doe"
                />
              </div>
              <div className="um-form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  required 
                  className="form-input"
                  value={newSubAdmin.email}
                  onChange={e => setNewSubAdmin({ ...newSubAdmin, email: e.target.value })}
                  placeholder="john@teatrack.com"
                />
              </div>
              <div className="um-form-group">
                <label>Password</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassAdd ? 'text' : 'password'}
                    required 
                    className="form-input"
                    value={newSubAdmin.password}
                    onChange={e => setNewSubAdmin({ ...newSubAdmin, password: e.target.value })}
                    placeholder="min. 6 characters"
                    minLength={6}
                    style={{ paddingRight: '40px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassAdd(!showPassAdd)}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', opacity: 0.6 }}
                  >
                    {showPassAdd ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              <div className="um-modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setIsAdding(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create User</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Sub Admin Modal */}
      {isEditing && (
        <div className="um-modal-overlay" onClick={() => setIsEditing(false)}>
          <div className="um-modal" onClick={e => e.stopPropagation()}>
            <h3 className="um-modal-title">Edit Sub Admin</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="um-form-group">
                <label>Name</label>
                <input 
                  type="text" 
                  required 
                  className="form-input"
                  value={editingUser.name}
                  onChange={e => setEditingUser({ ...editingUser, name: e.target.value })}
                />
              </div>
              <div className="um-form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  required 
                  className="form-input"
                  value={editingUser.email}
                  onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                />
              </div>
              <div className="um-form-group">
                <label>Password (Optional)</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassEdit ? 'text' : 'password'}
                    className="form-input"
                    value={editingUser.password}
                    onChange={e => setEditingUser({ ...editingUser, password: e.target.value })}
                    placeholder="Leave blank to keep current"
                    minLength={6}
                    style={{ paddingRight: '40px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassEdit(!showPassEdit)}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', opacity: 0.6 }}
                  >
                    {showPassEdit ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              <div className="um-modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setIsEditing(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Sub Admin Modal */}
      {isViewing && (
        <div className="um-modal-overlay" onClick={() => setIsViewing(false)}>
          <div className="um-modal" onClick={e => e.stopPropagation()}>
            <h3 className="um-modal-title">View Sub Admin</h3>
            <form>
              <div className="um-form-group">
                <label>Name</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={editingUser.name}
                  readOnly
                  style={{ backgroundColor: '#f1f5f9', color: '#64748b' }}
                />
              </div>
              <div className="um-form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  className="form-input"
                  value={editingUser.email}
                  readOnly
                  style={{ backgroundColor: '#f1f5f9', color: '#64748b' }}
                />
              </div>
              <div className="um-modal-actions">
                <button type="button" className="btn btn-primary" onClick={() => setIsViewing(false)}>Close</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

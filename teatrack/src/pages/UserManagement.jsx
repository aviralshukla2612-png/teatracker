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
                            onClick={() => handleEditClick(user)}
                            title="Edit"
                          >
                            ✏️
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
                            🗑️
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
    </div>
  );
}

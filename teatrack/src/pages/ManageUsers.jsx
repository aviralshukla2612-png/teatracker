import React, { useState } from 'react';
import './ManageUsers.css';
import './Page.css';

const DEFAULT_AVATAR_COLORS = [
  '#4F46E5', '#0891B2', '#059669', '#D97706', '#DC2626',
  '#7C3AED', '#DB2777', '#2563EB', '#16A34A', '#CA8A04'
];

function getInitials(name) {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return DEFAULT_AVATAR_COLORS[Math.abs(hash) % DEFAULT_AVATAR_COLORS.length];
}

function UserModal({ user, onSave, onClose }) {
  const isEdit = !!user;
  const [form, setForm] = useState(
    user
      ? { name: user.name, email: user.email, password: user.password, status: user.status }
      : { name: '', email: '', password: '', status: 'Active' }
  );
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password.trim()) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Min 6 characters';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSave({ ...form });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEdit ? 'Edit Sub Admin' : 'Create New Sub Admin'}</h3>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              className={`form-input ${errors.name ? 'input-error' : ''}`}
              placeholder="e.g. Priya Sharma"
              value={form.name}
              onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(er => ({ ...er, name: '' })); }}
            />
            {errors.name && <span className="error-msg">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              className={`form-input ${errors.email ? 'input-error' : ''}`}
              type="email"
              placeholder="e.g. priya@company.com"
              value={form.email}
              onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: '' })); }}
            />
            {errors.email && <span className="error-msg">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <div className="pass-input-wrap">
              <input
                className={`form-input ${errors.password ? 'input-error' : ''}`}
                type={showPass ? 'text' : 'password'}
                placeholder="Min 6 characters"
                value={form.password}
                onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setErrors(er => ({ ...er, password: '' })); }}
              />
              <button type="button" className="pass-toggle" onClick={() => setShowPass(s => !s)}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && <span className="error-msg">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">{isEdit ? '💾 Save Changes' : '➕ Create Admin'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ConfirmModal({ user, onConfirm, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card confirm-modal" onClick={e => e.stopPropagation()}>
        <div className="confirm-icon">🗑️</div>
        <h3>Delete Sub Admin?</h3>
        <p className="text-muted">
          Are you sure you want to remove <strong>{user.name}</strong>? This action cannot be undone.
        </p>
        <div className="modal-actions" style={{ justifyContent: 'center' }}>
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-danger-solid" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default function ManageUsers({ subAdmins, setSubAdmins, currentUser }) {
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreate = (form) => {
    const newAdmin = {
      id: Date.now().toString(),
      name: form.name,
      email: form.email,
      password: form.password,
      status: form.status,
      createdAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    setSubAdmins(prev => [...prev, newAdmin]);
    setShowModal(false);
    showToast(`✅ ${form.name} created successfully!`);
  };

  const handleEdit = (form) => {
    setSubAdmins(prev => prev.map(u => u.id === editUser.id ? { ...u, ...form } : u));
    setEditUser(null);
    showToast(`✅ ${form.name} updated successfully!`);
  };

  const handleDelete = () => {
    setSubAdmins(prev => prev.filter(u => u.id !== deleteUser.id));
    showToast(`🗑️ ${deleteUser.name} removed.`, 'info');
    setDeleteUser(null);
  };

  const toggleStatus = (id) => {
    setSubAdmins(prev => prev.map(u =>
      u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u
    ));
  };

  const filtered = subAdmins.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = subAdmins.filter(u => u.status === 'Active').length;

  if (currentUser !== 'Super Admin') {
    return (
      <div className="page-container">
        <div className="card empty-state">
          <div className="empty-icon">🔒</div>
          <h3>Access Denied</h3>
          <p className="text-muted">Only Super Admin can manage users.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-users-page">
      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type}`}>{toast.msg}</div>
      )}

      <div className="page-header">
        <div>
          <h2>👥 Manage Sub Admins</h2>
          <p className="text-muted">Create and manage sub admin accounts</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + New Sub Admin
        </button>
      </div>

      {/* Stats Row */}
      <div className="users-stats-row">
        <div className="user-stat-card">
          <span className="user-stat-icon">👥</span>
          <div>
            <p className="user-stat-label">Total Sub Admins</p>
            <p className="user-stat-value">{subAdmins.length}</p>
          </div>
        </div>
        <div className="user-stat-card">
          <span className="user-stat-icon" style={{ background: '#DCFCE7' }}>✅</span>
          <div>
            <p className="user-stat-label">Active</p>
            <p className="user-stat-value" style={{ color: '#16A34A' }}>{activeCount}</p>
          </div>
        </div>
        <div className="user-stat-card">
          <span className="user-stat-icon" style={{ background: '#FEE2E2' }}>⛔</span>
          <div>
            <p className="user-stat-label">Inactive</p>
            <p className="user-stat-value" style={{ color: '#DC2626' }}>{subAdmins.length - activeCount}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="users-search-row">
        <input
          className="form-input search-input"
          placeholder="🔍  Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* User Cards Grid */}
      {filtered.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-icon">👤</div>
          <h3>No Sub Admins Found</h3>
          <p className="text-muted">Click "New Sub Admin" to create one.</p>
        </div>
      ) : (
        <div className="users-grid">
          {filtered.map(user => (
            <div key={user.id} className={`user-card ${user.status === 'Inactive' ? 'inactive-card' : ''}`}>
              <div className="user-card-top">
                <div className="user-avatar" style={{ background: getAvatarColor(user.name) }}>
                  {getInitials(user.name)}
                </div>
                <span className={`status-badge ${user.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                  {user.status}
                </span>
              </div>

              <div className="user-card-body">
                <h4 className="user-name">{user.name}</h4>
                <p className="user-email">📧 {user.email}</p>
                <p className="user-pass">🔑 {'•'.repeat(user.password.length)}</p>
                <p className="user-date">📅 Created: {user.createdAt}</p>
              </div>

              <div className="user-card-actions">
                <button
                  className={`btn-action toggle-btn ${user.status === 'Active' ? 'deactivate' : 'activate'}`}
                  onClick={() => toggleStatus(user.id)}
                  title={user.status === 'Active' ? 'Deactivate' : 'Activate'}
                >
                  {user.status === 'Active' ? '⛔ Deactivate' : '✅ Activate'}
                </button>
                <button className="btn-action edit-btn" onClick={() => setEditUser(user)} title="Edit">
                  ✏️ Edit
                </button>
                <button className="btn-action delete-btn" onClick={() => setDeleteUser(user)} title="Delete">
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showModal && (
        <UserModal
          user={null}
          onSave={handleCreate}
          onClose={() => setShowModal(false)}
        />
      )}
      {editUser && (
        <UserModal
          user={editUser}
          onSave={handleEdit}
          onClose={() => setEditUser(null)}
        />
      )}
      {deleteUser && (
        <ConfirmModal
          user={deleteUser}
          onConfirm={handleDelete}
          onClose={() => setDeleteUser(null)}
        />
      )}
    </div>
  );
}

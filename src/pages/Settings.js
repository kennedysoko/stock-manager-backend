import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';

const Settings = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', username: '', role: 'Admin', status: 'Active', email: '', phone: '', password: '', confirmPassword: '' });

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({});

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await api.get('/settings/users');
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const submitEdit = async () => {
    if (!editForm.name.trim() || !editForm.username?.trim()) {
      alert('Full Name and Username are required.');
      return;
    }
    
    try {
      const updatedUser = await api.put(`/settings/users/${editForm.id}`, editForm);
      setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
      setSelectedUser(updatedUser);
      setEditModalOpen(false);
    } catch (error) {
      alert('Update failed: ' + error.message);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setShowModal(false);
    setForm({ name: '', username: '', role: 'Admin', status: 'Active', email: '', phone: '', password: '', confirmPassword: '' });
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.username.trim() || !form.password) {
      alert('Please fill out all required fields.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    try {
      const newUser = await api.post('/settings/users', {
        name: form.name.trim(),
        username: form.username.trim(),
        email: form.email,
        phone: form.phone,
        role: form.role,
        password: form.password,
        status: form.status
      });
      
      setUsers([...users, newUser]);
      handleClose();
    } catch (error) {
      alert('Failed to create user: ' + error.message);
    }
  };

  if (loading) return <section className="page active"><div className="loader">Loading users...</div></section>;

  if (selectedUser) {
    return (
      <section className="page active" id="page-settings">
        <div className="page-header">
          <h1>User Profile</h1>
          <p>Manage details and access for {selectedUser.name}</p>
        </div>
        
        <div className="card" style={{ maxWidth: '600px' }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="card-title">User Details</div>
            <button className="btn btn-outline btn-sm" onClick={() => setSelectedUser(null)}>Back to Settings</button>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div className="user-avatar" style={{width:'64px', height:'64px', fontSize:'1.5rem', background: selectedUser.bg || '#3B7DD8'}}>{selectedUser.initials}</div>
              <div>
                <h2 style={{ margin: 0 }}>{selectedUser.name}</h2>
                <div style={{ color: 'var(--text-muted)' }}>@{selectedUser.username}</div>
                <span className={`badge badge-${selectedUser.status === 'Active' ? 'green' : 'red'}`} style={{ marginTop: '8px', display: 'inline-block' }}>{selectedUser.status || 'Active'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Role</div>
                <div style={{ fontWeight: 500 }}>{selectedUser.role}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Phone</div>
                <div style={{ fontWeight: 500 }}>{selectedUser.phone || 'Not provided'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Email</div>
                <div style={{ fontWeight: 500 }}>{selectedUser.email || 'Not provided'}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-primary" onClick={() => {
                setEditForm({ ...selectedUser });
                setEditModalOpen(true);
              }}>Edit Details</button>
              <button className="btn btn-outline" onClick={() => alert('Change Password coming soon')}>Change Password</button>
            </div>
          </div>
        </div>

        {/* Edit User Modal */}
        <div className={`modal-overlay${isEditModalOpen ? ' open' : ''}`} onClick={e => e.target === e.currentTarget && setEditModalOpen(false)}>
          <div className="modal" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h2>Edit User</h2>
              <button className="modal-close" onClick={() => setEditModalOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input name="name" value={editForm.name || ''} onChange={handleEditChange} />
                </div>
                <div className="form-group">
                  <label>Username *</label>
                  <input name="username" value={editForm.username || ''} onChange={handleEditChange} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Role *</label>
                  <select name="role" value={editForm.role || ''} onChange={handleEditChange}>
                    <option>Admin</option>
                    <option>Manager</option>
                    <option>Cashier</option>
                    <option>Stock Clerk</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select name="status" value={editForm.status || ''} onChange={handleEditChange}>
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" value={editForm.email || ''} onChange={handleEditChange} />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input name="phone" value={editForm.phone || ''} onChange={handleEditChange} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setEditModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={submitEdit}>Update User</button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page active" id="page-settings">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage your real-time system configuration</p>
      </div>
      <div className="grid-2">
        <div className="card">
          <div className="card-header"><div className="card-title">Business Profile</div></div>
          <div className="card-body">
            <div className="form-group"><label>Business Name</label><input type="text" defaultValue="Kayola General Store" /></div>
            <div className="form-group"><label>Location</label><input type="text" defaultValue="Lilongwe, Malawi" /></div>
            <button className="btn btn-primary" onClick={() => alert('Profile saved locally!')}>Save Changes</button>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">User Management</div></div>
          <div className="card-body">
            {users.map(user => (
              <div className="alert-item" key={user.id} onClick={() => setSelectedUser(user)} style={{ cursor: 'pointer' }}>
                <div className="user-avatar" style={{ width: '32px', height: '32px', fontSize: '.75rem', background: user.bg || '#3B7DD8' }}>{user.initials}</div>
                <div className="alert-info"><div className="alert-name">{user.name}</div><div className="alert-sub">{user.role}</div></div>
                <span className={`badge badge-${user.status === 'Active' ? 'green' : 'red'}`}>{user.status}</span>
              </div>
            ))}
            <div style={{ marginTop: '12px' }}><button className="btn btn-outline" onClick={() => setShowModal(true)}>+ Add User</button></div>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      <div className={`modal-overlay${showModal ? ' open' : ''}`} onClick={e => e.target === e.currentTarget && handleClose()}>
        <div className="modal" style={{ maxWidth: '600px' }}>
          <div className="modal-header">
            <h2>Add New User</h2>
            <button className="modal-close" onClick={handleClose}>✕</button>
          </div>
          <div className="modal-body">
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input name="name" value={form.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Username *</label>
                <input name="username" value={form.username} onChange={handleChange} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Role *</label>
                <select name="role" value={form.role} onChange={handleChange}>
                  <option>Admin</option>
                  <option>Manager</option>
                  <option>Cashier</option>
                  <option>Stock Clerk</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={form.status} onChange={handleChange}>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Initial Password *</label>
                <input type="password" name="password" value={form.password} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Confirm Password *</label>
                <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline" onClick={handleClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>Add User</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Settings;

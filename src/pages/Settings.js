import React from 'react';

const Settings = () => {
  return (
    <section className="page active" id="page-settings">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Configure your inventory system</p>
      </div>
      <div className="grid-2">
        <div className="card">
          <div className="card-header"><div className="card-title">Business Profile</div></div>
          <div className="card-body">
            <div className="form-group"><label>Business Name</label><input type="text" defaultValue="Kayola General Store" /></div>
            <div className="form-group"><label>Location</label><input type="text" defaultValue="Lilongwe, Malawi" /></div>
            <div className="form-group"><label>Currency</label><select defaultValue="MK — Malawian Kwacha"><option>MK — Malawian Kwacha</option><option>USD — US Dollar</option></select></div>
            <button className="btn btn-primary" onClick={() => alert('Profile saved!')}>Save Changes</button>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">User Management</div></div>
          <div className="card-body">
            <div className="alert-item">
              <div className="user-avatar" style={{width:'32px', height:'32px', fontSize:'.75rem'}}>AK</div>
              <div className="alert-info"><div className="alert-name">Admin Kayola</div><div className="alert-sub">Administrator</div></div>
              <span className="badge badge-green">Active</span>
            </div>
            <div className="alert-item">
              <div className="user-avatar" style={{width:'32px', height:'32px', fontSize:'.75rem', background:'#3B7DD8'}}>MC</div>
              <div className="alert-info"><div className="alert-name">Mary Cashier</div><div className="alert-sub">Cashier</div></div>
              <span className="badge badge-green">Active</span>
            </div>
            <div style={{marginTop:'12px'}}><button className="btn btn-outline" onClick={() => alert('Add User modal logic...')}>+ Add User</button></div>
          </div>
        </div>
      </div>
      <div className="card" style={{marginTop:'16px'}}>
        <div className="card-header"><div className="card-title">Alert Thresholds</div></div>
        <div className="card-body">
          <p style={{fontSize:'.85rem', color:'var(--text-muted)', marginBottom:'14px'}}>Set default minimum stock levels for alert generation.</p>
          <div className="form-row">
            <div className="form-group"><label>Critical Alert (units)</label><input type="number" defaultValue="5" /></div>
            <div className="form-group"><label>Low Stock Warning (units)</label><input type="number" defaultValue="15" /></div>
          </div>
          <button className="btn btn-primary" onClick={() => alert('Alert settings saved!')}>Save Thresholds</button>
        </div>
      </div>
    </section>
  );
};

export default Settings;

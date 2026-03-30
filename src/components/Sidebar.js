import React from 'react';

const Sidebar = ({ activePage, setActivePage, isSidebarOpen, setSidebarOpen }) => {
  const navItems = [
    { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
    { id: 'products', icon: '📦', label: 'Products' },
    { id: 'inventory', icon: '🗂️', label: 'Inventory' },
    { type: 'label', label: 'Operations' },
    { id: 'checkout', icon: '🧾', label: 'Checkout / POS' },
    { id: 'orders', icon: '🛒', label: 'Orders', badge: 3 },
    { id: 'deliveries', icon: '🚚', label: 'Deliveries' },
    { id: 'alerts', icon: '🔔', label: 'Alerts', badge: 5 },
    { type: 'label', label: 'Insights' },
    { id: 'forecasting', icon: '📈', label: 'Forecasting' },
    { id: 'reports', icon: '📊', label: 'Reports' },
    { id: 'settings', icon: '⚙️', label: 'Settings' }
  ];

  return (
    <>
      <div className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)}></div>
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`} id="sidebar">
        <div className="sidebar-logo">
          <div className="logo-name">Stock<span>Smart</span></div>
          <div className="logo-tag">Inventory System</div>
        </div>
        <nav className="nav-group">
          {navItems.map((item, idx) => {
            if (item.type === 'label') {
              return <div key={idx} className="nav-label">{item.label}</div>;
            }
            return (
              <button
                key={item.id}
                className={`nav-item ${activePage === item.id ? 'active' : ''}`}
                onClick={() => { setActivePage(item.id); setSidebarOpen(false); }}
              >
                <span className="nav-icon">{item.icon}</span> {item.label}
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </button>
            );
          })}
        </nav>
        <div className="sidebar-user">
          <div className="user-avatar">AK</div>
          <div className="user-info">
            <div className="user-name">Admin Kayola</div>
            <div className="user-role">Administrator</div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

import React from 'react';
import { Home, Package, Folder, Receipt, ShoppingCart, Truck, Bell, TrendingUp, BarChart2, Settings } from 'lucide-react';

const Sidebar = ({ activePage, setActivePage, isSidebarOpen, setSidebarOpen }) => {
  const navItems = [
    { id: 'dashboard', icon: <Home size={18} />, label: 'Dashboard' },
    { id: 'products', icon: <Package size={18} />, label: 'Products' },
    { id: 'inventory', icon: <Folder size={18} />, label: 'Inventory Tracking' },
    { type: 'label', label: 'Operations' },
    { id: 'checkout', icon: <Receipt size={18} />, label: 'Checkout / POS' },
    { id: 'orders', icon: <ShoppingCart size={18} />, label: 'Orders', badge: 3 },
    { id: 'deliveries', icon: <Truck size={18} />, label: 'Deliveries' },
    { id: 'alerts', icon: <Bell size={18} />, label: 'Alerts', badge: 5 },
    { type: 'label', label: 'Insights' },
    { id: 'forecasting', icon: <TrendingUp size={18} />, label: 'Forecasting' },
    { id: 'reports', icon: <BarChart2 size={18} />, label: 'Reports' },
    { id: 'settings', icon: <Settings size={18} />, label: 'Settings' }
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

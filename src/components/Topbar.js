import React from 'react';

const Topbar = ({ toggleSidebar, activePageTitle, setActivePage }) => {
  return (
    <header className="topbar">
      <button className="hamburger" onClick={toggleSidebar}>☰</button>
      <div className="topbar-title" id="topbarTitle">{activePageTitle}</div>
      <div className="search-wrap">
        <span className="search-icon">🔍</span>
        <input type="text" placeholder="Search products, orders…" />
      </div>
      <div className="topbar-actions">
        <div className="icon-btn" onClick={() => setActivePage('alerts')}>
          🔔<span className="notif-dot"></span>
        </div>
        <div className="icon-btn">👤</div>
      </div>
    </header>
  );
};

export default Topbar;

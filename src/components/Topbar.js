import React, { useState } from 'react';
import { Bell, Search } from 'lucide-react';

const Topbar = ({ toggleSidebar, activePageTitle, setActivePage }) => {
  const [readOnly, setReadOnly] = useState(true);

  return (
    <header className="topbar">
      <button className="hamburger" onClick={toggleSidebar}>☰</button>
      <div className="topbar-title" id="topbarTitle">{activePageTitle}</div>
      <div className="search-wrap">
        <span className="search-icon"><Search size={16} /></span>
        <input
          type="text"
          placeholder="Search products, orders…"
          autoComplete="new-password"
          readOnly={readOnly}
          onFocus={() => setReadOnly(false)}
          onBlur={() => setReadOnly(true)}
        />
      </div>
      <div className="topbar-actions">
        <div className="icon-btn" onClick={() => setActivePage('alerts')}>
          <Bell size={18} />
          <span className="notif-dot"></span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;

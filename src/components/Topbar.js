import React, { useState, useEffect } from 'react';
import { Bell, Calendar, Clock, Settings, HelpCircle, Search } from 'lucide-react';

const Topbar = ({ toggleSidebar, activePageTitle, activePage, setActivePage }) => {
  const [time, setTime] = useState(new Date());
  const [readOnly, setReadOnly] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="topbar">
      <button className="hamburger" onClick={toggleSidebar}>☰</button>
      <div className="topbar-title" id="topbarTitle">{activePageTitle}</div>
      
      {activePage === 'checkout' ? (
        <div className="topbar-right">
          {/* Date & Time Widget */}
          <div className="topbar-clock">
            <div className="time-group">
              <Calendar size={14} />
              <span>{time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            </div>
            <div className="time-group time-bold">
              <Clock size={14} />
              <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="topbar-actions">
            <button className="icon-btn" title="Help">
              <HelpCircle size={17} />
            </button>
            <button className="icon-btn" title="Notifications">
              <Bell size={17} />
              <span className="notif-dot"></span>
            </button>
          </div>
        </div>
      ) : (
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
      )}
    </header>
  );
};

export default Topbar;

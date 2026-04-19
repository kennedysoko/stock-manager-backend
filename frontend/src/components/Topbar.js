import React, { useState, useEffect } from 'react';
import { Bell, Calendar, Clock, HelpCircle } from 'lucide-react';

const Topbar = ({ toggleSidebar, activePageTitle, activePage, setActivePage }) => {
  const [time, setTime] = useState(new Date());

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
        <div className="topbar-actions">
          <div className="icon-btn" onClick={() => setActivePage('alerts')}>
            <Bell size={18} />
            <span className="notif-dot"></span>
          </div>
        </div>
      )}
    </header>
  );
};

export default Topbar;

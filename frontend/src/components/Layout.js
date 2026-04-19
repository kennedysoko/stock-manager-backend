import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const pageTitles = {
  dashboard: 'Dashboard', products: 'Products', inventory: 'Inventory Tracking',
  checkout: 'Checkout / POS', orders: 'Purchase Orders', 
  deliveries: 'Deliveries', alerts: 'Alerts',
  forecasting: 'Demand Forecasting', reports: 'Reports', settings: 'Settings'
};

const Layout = ({ children, activePage, setActivePage }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <>
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        isSidebarOpen={isSidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />
      <div className="main">
        <Topbar 
          toggleSidebar={toggleSidebar} 
          activePageTitle={pageTitles[activePage] || activePage} 
          activePage={activePage}
          setActivePage={setActivePage}
        />
        <main className="content">
          {children}
        </main>
      </div>
    </>
  );
};

export default Layout;

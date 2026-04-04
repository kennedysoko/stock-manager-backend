import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { InventoryProvider } from './context/InventoryContext';
import { PosProvider } from './context/PosContext';
import Layout from './components/Layout';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Inventory from './pages/Inventory';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Deliveries from './pages/Deliveries';
import Alerts from './pages/Alerts';
import Forecasting from './pages/Forecasting';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import StockValue from './pages/StockValue';

const MainApp = () => {
  const { user } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');

  if (!user) {
    return <Login />;
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard setActivePage={setActivePage} />;
      case 'products': return <Products />;
      case 'inventory': return <Inventory />;
      case 'checkout': return <Checkout />;
      case 'orders': return <Orders />;
      case 'deliveries': return <Deliveries />;
      case 'alerts': return <Alerts />;
      case 'forecasting': return <Forecasting />;
      case 'reports': return <Reports />;
      case 'settings': return <Settings />;
      case 'stock-value': return <StockValue />;
      default: return null;
    }
  };

  return (
    <Layout activePage={activePage} setActivePage={setActivePage}>
      {renderPage()}
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <InventoryProvider>
        <PosProvider>
          <MainApp />
        </PosProvider>
      </InventoryProvider>
    </AuthProvider>
  );
}

export default App;

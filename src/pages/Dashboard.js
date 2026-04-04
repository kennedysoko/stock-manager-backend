import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useInventory } from '../context/InventoryContext';
import { Package, AlertTriangle, ShoppingCart, DollarSign, Bell } from 'lucide-react';

const Dashboard = ({ setActivePage }) => {
  const { user } = useAuth();
  const { products, transactions, getLowStockProducts } = useInventory();

  const lowStockProducts = getLowStockProducts();
  const totalValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);

  return (
    <section className="page active" id="page-dashboard">
      <div className="page-header">
        <h1>Welcome back, {user?.name.split(' ')[0] || 'Admin'}</h1>
        <p>Here's your inventory overview for today</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card" onClick={() => setActivePage('products')} style={{ cursor: 'pointer' }} title="Click to view products">
          <div className="stat-label">Total Products</div>
          <div className="stat-val">{products.length}</div>
          <div className="stat-change up">↑ Active tracking</div>
          <div className="stat-icon green">
            <Package size={20} />
          </div>
        </div>
        <div className="stat-card" onClick={() => setActivePage('alerts')} style={{ cursor: 'pointer' }} title="Click to view alerts">
          <div className="stat-label">Low Stock Items</div>
          <div className="stat-val">{lowStockProducts.length}</div>
          <div className="stat-change down">↓ Needs attention</div>
          <div className="stat-icon red">
            <AlertTriangle size={20} />
          </div>
        </div>
        <div className="stat-card" onClick={() => setActivePage('orders')} style={{ cursor: 'pointer' }} title="Click to view orders">
          <div className="stat-label">Orders Pending</div>
          <div className="stat-val">3</div>
          <div className="stat-change up">↑ 1 new today</div>
          <div className="stat-icon amber">
            <ShoppingCart size={20} />
          </div>
        </div>
        <div className="stat-card" onClick={() => setActivePage('stock-value')} style={{ cursor: 'pointer' }} title="Click to view stock value breakdown">
          <div className="stat-label">Total Stock Value</div>
          <div className="stat-val">MK{(totalValue / 1000000).toFixed(1)}M</div>
          <div className="stat-change up">↑ Live metrics</div>
          <div className="stat-icon blue">
            <DollarSign size={20} />
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Stock Movements — This Week</div>
            <span className="card-action">View details →</span>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="text-muted" style={{ fontSize: '.78rem', color: 'var(--text-muted)' }}>Units moved</span>
              <span style={{ fontSize: '.78rem', fontWeight: 700 }}>Mon – Sun</span>
            </div>
            <div className="bar-chart">
              <div className="bar-group"><div className="bar-wrap"><div className="bar" style={{height:'55%'}}></div></div><div className="bar-label">Mon</div></div>
              <div className="bar-group"><div className="bar-wrap"><div className="bar" style={{height:'72%'}}></div></div><div className="bar-label">Tue</div></div>
              <div className="bar-group"><div className="bar-wrap"><div className="bar" style={{height:'48%'}}></div></div><div className="bar-label">Wed</div></div>
              <div className="bar-group"><div className="bar-wrap"><div className="bar" style={{height:'88%'}}></div></div><div className="bar-label">Thu</div></div>
              <div className="bar-group"><div className="bar-wrap"><div className="bar" style={{height:'65%',background:'var(--accent)'}}></div></div><div className="bar-label">Fri</div></div>
              <div className="bar-group"><div className="bar-wrap"><div className="bar" style={{height:'92%'}}></div></div><div className="bar-label">Sat</div></div>
              <div className="bar-group"><div className="bar-wrap"><div className="bar" style={{height:'38%',opacity:.5}}></div></div><div className="bar-label">Sun</div></div>
            </div>
            <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
              <div style={{ fontSize: '.78rem' }}>
                <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '2px', background: 'var(--primary)', marginRight: '5px' }}></span>
                Stock In: 342 units
              </div>
              <div style={{ fontSize: '.78rem' }}>
                <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '2px', background: 'var(--accent)', marginRight: '5px' }}></span>
                Stock Out: 289 units
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={18} />
              Low Stock Alerts
            </div>
            <span className="card-action" onClick={() => setActivePage('alerts')} style={{ cursor: 'pointer' }}>View all →</span>
          </div>
          <div className="card-body" style={{ padding: '12px 16px', maxHeight: '250px', overflowY: 'auto' }}>
            {lowStockProducts.length === 0 ? (
              <p style={{ fontSize: '.85rem', color: 'var(--text-muted)' }}>All stocks are looking good!</p>
            ) : (
              lowStockProducts.map(p => (
                <div className="alert-item" key={p.id}>
                  <div className="alert-dot" style={{ background: p.stock === 0 ? 'var(--danger)' : 'var(--warning)' }}></div>
                  <div className="alert-info">
                    <div className="alert-name">{p.name}</div>
                    <div className="alert-sub">{p.cat} · Min: {p.min} units</div>
                  </div>
                  <div className="alert-qty" style={{ color: p.stock === 0 ? 'var(--danger)' : 'var(--warning)' }}>
                    {p.stock} left
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Recent Transactions</div>
          <span className="card-action">See all →</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Type</th>
                <th>Qty</th>
                <th>Date/Time</th>
                <th>User</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 5).map(txn => (
                <tr key={txn.id}>
                  <td><strong>{txn.productName}</strong></td>
                  <td>{txn.type === 'IN' ? <span className="badge badge-green">Stock In</span> : <span className="badge badge-red">Stock Out</span>}</td>
                  <td className="stock-num">{txn.type === 'IN' ? `+${txn.qty}` : `-${txn.qty}`}</td>
                  <td>{new Date(txn.date).toLocaleDateString()} {new Date(txn.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  <td>{txn.user}</td>
                  <td><span className="badge badge-green">Completed</span></td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>No recent transactions. Go to Checkout / POS to start selling!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;

import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { Bell } from 'lucide-react';

const Alerts = () => {
  const { getLowStockProducts } = useInventory();
  const lowStock = getLowStockProducts();

  return (
    <section className="page active" id="page-alerts">
      <div className="page-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Bell size={28} /> Stock Alerts</h1>
        <p>Products that require immediate restocking</p>
      </div>
      <div className="alerts-list">
        {lowStock.length === 0 ? (
          <div style={{padding:'40px', textAlign:'center', color:'var(--text-muted)'}}>
            All stocks are healthy! No alerts.
          </div>
        ) : (
          lowStock.map(p => (
            <div className="alert-row" key={p.id}>
              <div className="severity" style={{background: p.stock === 0 ? 'var(--danger)' : 'var(--warning)'}}></div>
              <div>
                <div className="alert-product">{p.name}</div>
                <div className="alert-detail">{p.cat} · Min Level: {p.min}</div>
              </div>
              <div style={{flex:1}}></div>
              <div className="alert-stock-info">
                <div className="current" style={{color: p.stock === 0 ? 'var(--danger)' : 'var(--warning)'}}>{p.stock}</div>
                <div className="threshold">Min: {p.min}</div>
              </div>
              <button 
                className={`btn btn-sm ${p.stock === 0 ? 'btn-primary' : 'btn-outline'}`} 
                onClick={() => alert(`Creating PO for ${p.name}`)}
              >
                Order Now
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default Alerts;

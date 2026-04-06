import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { PackageSearch, AlertCircle, FileDigit, Download, Printer } from 'lucide-react';

const InventoryReport = () => {
  const { products, transactions } = useInventory();

  // Aggregate transaction velocity
  const velocity = transactions.reduce((acc, txn) => {
    if (!acc[txn.productId]) acc[txn.productId] = { IN: 0, OUT: 0 };
    acc[txn.productId][txn.type] += txn.qty;
    return acc;
  }, {});

  // Generate enriched product rows
  const reportData = products.map(p => {
    const v = velocity[p.id] || { IN: 0, OUT: 0 };
    const stockValue = p.stock * p.price;
    const isLow = p.stock <= p.min;
    return { ...p, stockValue, inQty: v.IN, outQty: v.OUT, isLow };
  });

  // Calculate High-Level Stats
  const totalCatalog = products.length;
  const criticalItems = reportData.filter(d => d.isLow).length;
  const grossCapital = reportData.reduce((acc, d) => acc + d.stockValue, 0);

  return (
    <section className="page active" id="page-inventory-report">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Inventory Snapshot Report</h1>
          <p>Comprehensive breakdown of current stock levels, financial assets, and movement velocity.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-outline" onClick={() => alert('📥 Exporting to CSV...')}>
            <Download size={16} /> Export CSV
          </button>
          <button className="btn btn-primary" onClick={() => window.print()}>
            <Printer size={16} /> Print Report
          </button>
        </div>
      </div>

      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-label">Registered Catalog</div>
          <div className="stat-val">{totalCatalog}</div>
          <div className="stat-change" style={{ color: 'var(--text-muted)' }}>Unique item tracking</div>
          <div className="stat-icon blue">
            <PackageSearch size={20} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Critical / Low Stock</div>
          <div className="stat-val" style={{ color: criticalItems > 0 ? 'var(--danger)' : 'var(--text)' }}>
            {criticalItems}
          </div>
          <div className="stat-change" style={{ color: criticalItems > 0 ? 'var(--danger)' : 'var(--success)' }}>
            {criticalItems > 0 ? 'Immediate action required' : 'All stock is healthy'}
          </div>
          <div className="stat-icon red">
            <AlertCircle size={20} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Gross Capital Value</div>
          <div className="stat-val">MK {(grossCapital / 1000000).toFixed(2)}M</div>
          <div className="stat-change" style={{ color: 'var(--text-muted)' }}>Total portfolio equity</div>
          <div className="stat-icon green">
            <FileDigit size={20} />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Live Inventory Ledger</div>
        </div>
        <div style={{ overflowX: 'auto', maxHeight: '500px' }}>
          <table className="data-table">
            <thead style={{ position: 'sticky', top: 0, background: 'var(--surface)', zIndex: 1, boxShadow: '0 1px 0 var(--border)' }}>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th style={{ textAlign: 'right' }}>Current Stock</th>
                <th style={{ textAlign: 'center' }}>Status</th>
                <th style={{ textAlign: 'right' }}>Total Asset Value (MK)</th>
                <th style={{ textAlign: 'right' }}>All-Time Stock In</th>
                <th style={{ textAlign: 'right' }}>All-Time Stock Out</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map(d => (
                <tr key={d.id}>
                  <td><strong>{d.name}</strong><br /><span style={{ fontSize: '.7rem', color: 'var(--text-muted)' }}>{d.id}</span></td>
                  <td>{d.cat}</td>
                  <td className="stock-num" style={{ textAlign: 'right', color: d.isLow ? 'var(--danger)' : 'inherit' }}>
                    {d.stock} <span style={{ fontSize: '.7rem', color: 'var(--text-light)', fontWeight: 400 }}>/ {d.min} min</span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {d.stock === 0 ? <span className="badge badge-red">Critical</span> : 
                     d.isLow ? <span className="badge badge-amber">Low</span> : 
                     <span className="badge badge-green">Healthy</span>}
                  </td>
                  <td className="stock-num" style={{ textAlign: 'right', fontWeight: 700, color: 'var(--primary)' }}>
                    {d.stockValue.toLocaleString()}
                  </td>
                  <td className="stock-num" style={{ textAlign: 'right', color: 'var(--success)' }}>+{d.inQty}</td>
                  <td className="stock-num" style={{ textAlign: 'right', color: 'var(--danger)' }}>-{d.outQty}</td>
                </tr>
              ))}
              {reportData.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    No products found in the catalog.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default InventoryReport;

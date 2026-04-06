import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { DollarSign, PieChart, TrendingUp, Package } from 'lucide-react';

const StockValue = () => {
  const { products } = useInventory();

  // Calculate overall and category totals
  const totalValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);
  
  const categoryTotals = products.reduce((acc, p) => {
    const value = p.price * p.stock;
    if (!acc[p.cat]) acc[p.cat] = 0;
    acc[p.cat] += value;
    return acc;
  }, {});

  const categoryBreakdown = Object.entries(categoryTotals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Top valued products
  const topAssets = [...products]
    .map(p => ({ ...p, totalValue: p.price * p.stock }))
    .sort((a, b) => b.totalValue - a.totalValue)
    .slice(0, 5);

  return (
    <section className="page active" id="page-stock-value">
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <DollarSign size={28} /> Total Stock Value Breakdown
        </h1>
        <p>A detailed view of the capital tied up in your current inventory.</p>
      </div>

      <div className="stats-grid" style={{ marginBottom: '30px' }}>
        <div className="stat-card" style={{ background: 'var(--primary)', color: '#fff', borderColor: 'var(--primary)' }}>
          <div className="stat-label" style={{ color: 'rgba(255,255,255,0.7)' }}>Total Portfolio Value</div>
          <div className="stat-val" style={{ color: '#fff' }}>MK {totalValue.toLocaleString()}</div>
          <div className="stat-change" style={{ color: 'rgba(255,255,255,0.7)' }}>Across {products.length} products</div>
          <div className="stat-icon" style={{ background: 'rgba(255,255,255,0.15)' }}>
            <TrendingUp size={20} />
          </div>
        </div>

        {categoryBreakdown.map((cat, idx) => {
          // Provide distinct colors for the top few categories
          const colors = ['blue', 'green', 'amber', 'red'];
          const color = colors[idx % colors.length];
          const percentage = totalValue > 0 ? ((cat.value / totalValue) * 100).toFixed(1) : 0;

          return (
            <div className="stat-card" key={cat.name}>
              <div className="stat-label">{cat.name} Portfolio</div>
              <div className="stat-val">MK {cat.value.toLocaleString()}</div>
              <div className="stat-change up" style={{ color: 'var(--text-muted)' }}>{percentage}% of total value</div>
              <div className={`stat-icon ${color}`}>
                <PieChart size={20} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Package size={18} /> Highest Value Assets
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Unit Price (MK)</th>
                <th>Stock Qty</th>
                <th style={{ textAlign: 'right' }}>Total Asset Value (MK)</th>
              </tr>
            </thead>
            <tbody>
              {topAssets.map(p => (
                <tr key={p.id}>
                  <td><strong>{p.name}</strong></td>
                  <td>{p.cat}</td>
                  <td>{p.price.toLocaleString()}</td>
                  <td className="stock-num">{p.stock}</td>
                  <td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--primary)', fontFamily: "'DM Mono', monospace" }}>
                    {p.totalValue.toLocaleString()}
                  </td>
                </tr>
              ))}
              {topAssets.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                    No products available.
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

export default StockValue;

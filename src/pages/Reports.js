import React from 'react';

const Reports = () => {
  return (
    <section className="page active" id="page-reports">
      <div className="page-header">
        <h1>Reports & Analytics</h1>
        <p>Generate business insights and export data</p>
      </div>
      <div className="report-grid">
        <div className="report-card" onClick={() => alert('📊 Generating Inventory Report…')}>
          <div className="report-icon">📦</div>
          <div className="report-name">Inventory Report</div>
          <div className="report-desc">Full snapshot of current stock levels, values, and movements</div>
        </div>
        <div className="report-card" onClick={() => alert('📊 Generating Sales Report…')}>
          <div className="report-icon">💰</div>
          <div className="report-name">Sales Report</div>
          <div className="report-desc">Revenue, units sold, and top-selling products by period</div>
        </div>
        <div className="report-card" onClick={() => alert('📊 Generating Stock History…')}>
          <div className="report-icon">📋</div>
          <div className="report-name">Stock History</div>
          <div className="report-desc">All stock-in and stock-out transactions with audit trail</div>
        </div>
        <div className="report-card" onClick={() => alert('📊 Generating Fast/Slow Movers Report…')}>
          <div className="report-icon">🚀</div>
          <div className="report-name">Product Performance</div>
          <div className="report-desc">Identify fast-moving and slow-moving products</div>
        </div>
        <div className="report-card" onClick={() => alert('📊 Generating Low Stock Report…')}>
          <div className="report-icon">⚠️</div>
          <div className="report-name">Low Stock Report</div>
          <div className="report-desc">All products below minimum threshold with reorder suggestions</div>
        </div>
        <div className="report-card" onClick={() => alert('📊 Generating Supplier Report…')}>
          <div className="report-icon">🚚</div>
          <div className="report-name">Supplier Report</div>
          <div className="report-desc">Order history, delivery performance by supplier</div>
        </div>
      </div>
    </section>
  );
};

export default Reports;

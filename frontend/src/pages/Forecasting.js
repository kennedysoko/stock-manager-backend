import React from 'react';

const Forecasting = () => {
  return (
    <section className="page active" id="page-forecasting">
      <div className="page-header">
        <h1>📈 Demand Forecasting</h1>
        <p>Predictive analytics based on your sales history</p>
      </div>
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-label">Fast-Moving Items</div><div className="stat-val">12</div><div className="stat-change up">↑ High velocity</div><div className="stat-icon green">🚀</div></div>
        <div className="stat-card"><div className="stat-label">Slow-Moving Items</div><div className="stat-val">8</div><div className="stat-change down">↓ Low demand</div><div className="stat-icon amber">🐢</div></div>
        <div className="stat-card"><div className="stat-label">Suggested Reorder</div><div className="stat-val">5</div><div className="stat-change">Based on forecasts</div><div className="stat-icon blue">📦</div></div>
        <div className="stat-card"><div className="stat-label">Forecast Accuracy</div><div className="stat-val">87%</div><div className="stat-change up">↑ Good</div><div className="stat-icon green">🎯</div></div>
      </div>
      <div className="card" style={{marginBottom:'16px'}}>
        <div className="card-header"><div className="card-title">Monthly Sales Trend — Top Products</div></div>
        <div className="card-body">
          <div className="bar-chart" style={{height:'160px'}}>
            <div className="bar-group"><div className="bar-wrap" style={{height:'140px'}}><div className="bar" style={{height:'65%'}}></div></div><div className="bar-label">Sep</div></div>
            <div className="bar-group"><div className="bar-wrap" style={{height:'140px'}}><div className="bar" style={{height:'70%'}}></div></div><div className="bar-label">Oct</div></div>
            <div className="bar-group"><div className="bar-wrap" style={{height:'140px'}}><div className="bar" style={{height:'60%'}}></div></div><div className="bar-label">Nov</div></div>
            <div className="bar-group"><div className="bar-wrap" style={{height:'140px'}}><div className="bar" style={{height:'80%'}}></div></div><div className="bar-label">Dec</div></div>
            <div className="bar-group"><div className="bar-wrap" style={{height:'140px'}}><div className="bar" style={{height:'55%'}}></div></div><div className="bar-label">Jan</div></div>
            <div className="bar-group"><div className="bar-wrap" style={{height:'140px'}}><div className="bar" style={{height:'75%'}}></div></div><div className="bar-label">Feb</div></div>
            <div className="bar-group"><div className="bar-wrap" style={{height:'140px'}}><div className="bar" style={{height:'88%',background:'var(--accent)'}}></div></div><div className="bar-label">Mar</div></div>
            <div className="bar-group"><div className="bar-wrap" style={{height:'140px'}}><div className="bar" style={{height:'90%',background:'rgba(26,60,52,.3)',border:'2px dashed var(--primary)'}}></div></div><div className="bar-label">Apr*</div></div>
            <div className="bar-group"><div className="bar-wrap" style={{height:'140px'}}><div className="bar" style={{height:'85%',background:'rgba(26,60,52,.2)',border:'2px dashed var(--primary)'}}></div></div><div className="bar-label">May*</div></div>
          </div>
          <div style={{fontSize:'.75rem', color:'var(--text-muted)', marginTop:'6px'}}>* Forecast period</div>
        </div>
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">Restock Recommendations</div></div>
        <div style={{overflowX:'auto'}}>
          <table className="data-table">
            <thead><tr><th>Product</th><th>Avg Monthly Sales</th><th>Current Stock</th><th>Predicted Demand</th><th>Suggested Order</th></tr></thead>
            <tbody>
              <tr><td><strong>Coca-Cola 500ml</strong></td><td>180 units</td><td className="stock-num" style={{color:'var(--danger)'}}>3</td><td>195 units</td><td className="stock-num" style={{color:'var(--primary)'}}><strong>200 units</strong></td></tr>
              <tr><td><strong>Maize Flour 2kg</strong></td><td>95 units</td><td className="stock-num" style={{color:'var(--warning)'}}>8</td><td>110 units</td><td className="stock-num" style={{color:'var(--primary)'}}><strong>120 units</strong></td></tr>
              <tr><td><strong>Cooking Oil 2L</strong></td><td>60 units</td><td className="stock-num" style={{color:'var(--danger)'}}>4</td><td>68 units</td><td className="stock-num" style={{color:'var(--primary)'}}><strong>72 units</strong></td></tr>
              <tr><td><strong>Sugar 2kg</strong></td><td>75 units</td><td className="stock-num" style={{color:'var(--warning)'}}>14</td><td>82 units</td><td className="stock-num" style={{color:'var(--primary)'}}><strong>80 units</strong></td></tr>
              <tr><td><strong>Fanta Orange 500ml</strong></td><td>120 units</td><td className="stock-num">62</td><td>140 units</td><td className="stock-num">80 units</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Forecasting;

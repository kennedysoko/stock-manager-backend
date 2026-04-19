import React from 'react';

const Deliveries = () => {
  return (
    <section className="page active" id="page-deliveries">
      <div className="page-header">
        <h1>Deliveries</h1>
        <p>Track incoming stock from suppliers (Live data coming soon)</p>
      </div>
      <div className="card">
        <div style={{padding:'40px', textAlign:'center', color:'var(--text-muted)'}}>
          <div style={{fontSize:'3rem', marginBottom:'16px'}}>🚚</div>
          <h3>No active deliveries</h3>
          <p>This module will integrate with the Purchase Orders system once implemented in the backend.</p>
        </div>
      </div>
    </section>
  );
};

export default Deliveries;

import React from 'react';

const Orders = () => {
  return (
    <section className="page active" id="page-orders">
      <div className="page-header">
        <h1>Purchase Orders</h1>
        <p>Manage inventory procurement (Live data coming soon)</p>
      </div>
      <div className="card">
        <div style={{padding:'40px', textAlign:'center', color:'var(--text-muted)'}}>
          <div style={{fontSize:'3rem', marginBottom:'16px'}}>📝</div>
          <h3>No purchase orders</h3>
          <p>You haven't created any purchase orders yet. This feature will rely on the backend procurement module.</p>
        </div>
      </div>
    </section>
  );
};

export default Orders;

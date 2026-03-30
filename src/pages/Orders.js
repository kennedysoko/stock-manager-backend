import React, { useState } from 'react';

const Orders = () => {
  const [orders] = useState([
    { id: 'PO-2025-041', supplier: 'Peoples Trading Co.', status: 'Pending', total: 'MK 48,600', date: 'Created 12 Mar', items: [{name: 'Coca-Cola 500ml × 50 crates', price: 'MK 32,500'}, {name: 'Fanta Orange × 24 crates', price: 'MK 14,400'}, {name: 'Sprite 500ml × 6 crates', price: 'MK 1,700'}] },
    { id: 'PO-2025-040', supplier: 'Chitawira Supplies Ltd.', status: 'Pending', total: 'MK 22,400', date: 'Created 11 Mar', items: [{name: 'Maize Flour 2kg × 30 bags', price: 'MK 9,000'}, {name: 'Sugar 2kg × 24 bags', price: 'MK 8,400'}, {name: 'Cooking Oil 2L × 12 bottles', price: 'MK 5,000'}] },
    { id: 'PO-2025-039', supplier: 'Bakers Pride Ltd.', status: 'Delivered', total: 'MK 11,250', date: 'Created 10 Mar', items: [{name: 'Bread 400g × 15 trays', price: 'MK 11,250'}] }
  ]);
  const [openOrder, setOpenOrder] = useState(null);

  const toggleOrder = (id) => {
    setOpenOrder(openOrder === id ? null : id);
  };

  return (
    <section className="page active" id="page-orders">
      <div className="page-header">
        <h1>Purchase Orders</h1>
        <p>Track and manage supplier orders</p>
      </div>
      <div className="toolbar">
        <div className="toolbar-left">
          <select className="filter-select">
            <option>All Orders</option>
            <option>Pending</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>
        </div>
        <button className="btn btn-primary" onClick={() => alert('New Order Modal mock')}>+ New Order</button>
      </div>

      {orders.map(order => (
        <div className="order-card" key={order.id}>
          <div className="order-header" onClick={() => toggleOrder(order.id)}>
            <div className="order-id">{order.id}</div>
            <div className="order-supplier">{order.supplier}</div>
            <span className={`badge ${order.status === 'Pending' ? 'badge-amber' : 'badge-green'}`}>{order.status}</span>
            <div style={{fontSize:'.82rem', color:'var(--text-muted)'}}>{order.total}</div>
            <div style={{fontSize:'.78rem', color:'var(--text-muted)'}}>{order.date}</div>
            <span style={{fontSize:'.8rem', color:'var(--text-muted)'}}>{openOrder === order.id ? '▲' : '▼'}</span>
          </div>
          <div className="order-body" style={{ display: openOrder === order.id ? 'block' : 'none' }}>
            <div className="order-items-list">
              {order.items.map((it, idx) => (
                <div className="item-row" key={idx}><span>{it.name}</span><span className="stock-num">{it.price}</span></div>
              ))}
            </div>
            <div style={{marginTop:'12px', display:'flex', gap:'10px'}}>
              {order.status === 'Pending' ? (
                <>
                  <button className="btn btn-primary btn-sm" onClick={() => alert('Marking as Received...')}>Mark Received</button>
                  <button className="btn btn-outline btn-sm">Cancel Order</button>
                </>
              ) : (
                <div style={{marginTop:'8px', fontSize:'.8rem', color:'var(--success)'}}>✓ Delivered · Stock updated automatically</div>
              )}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default Orders;

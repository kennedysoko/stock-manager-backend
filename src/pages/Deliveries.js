import React from 'react';

const Deliveries = () => {
  return (
    <section className="page active" id="page-deliveries">
      <div className="page-header">
        <h1>Deliveries</h1>
        <p>Track incoming stock from suppliers</p>
      </div>
      <div className="card">
        <div style={{overflowX:'auto'}}>
          <table className="data-table">
            <thead>
              <tr><th>Delivery ID</th><th>Supplier</th><th>Order Ref</th><th>Expected Date</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              <tr><td className="stock-num">#DEL-088</td><td><strong>Peoples Trading Co.</strong></td><td>#PO-2025-041</td><td>15 Mar 2025</td><td><span className="badge badge-blue">In Transit</span></td><td><button className="btn btn-outline btn-sm" onClick={() => alert('Confirmed')}>Confirm</button></td></tr>
              <tr><td className="stock-num">#DEL-087</td><td><strong>Chitawira Supplies</strong></td><td>#PO-2025-040</td><td>14 Mar 2025</td><td><span className="badge badge-amber">Pending</span></td><td><button className="btn btn-outline btn-sm" onClick={() => alert('Confirmed')}>Confirm</button></td></tr>
              <tr><td className="stock-num">#DEL-086</td><td><strong>Bakers Pride Ltd.</strong></td><td>#PO-2025-039</td><td>11 Mar 2025</td><td><span className="badge badge-green">Delivered</span></td><td><button className="btn btn-outline btn-sm" disabled style={{opacity:'.4'}}>Done</button></td></tr>
              <tr><td className="stock-num">#DEL-085</td><td><strong>Peoples Trading Co.</strong></td><td>#PO-2025-036</td><td>8 Mar 2025</td><td><span className="badge badge-green">Delivered</span></td><td><button className="btn btn-outline btn-sm" disabled style={{opacity:'.4'}}>Done</button></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Deliveries;

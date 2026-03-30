import React from 'react';
import { useInventory } from '../context/InventoryContext';

const Inventory = () => {
  const { transactions } = useInventory();
  
  return (
    <section className="page active" id="page-inventory">
      <div className="page-header">
        <h1>Inventory Tracking</h1>
        <p>Record and review all stock movements</p>
      </div>
      <div className="toolbar">
        <div className="toolbar-left">
          <select className="filter-select"><option>All Transactions</option><option>Stock In</option><option>Stock Out</option></select>
        </div>
        <button className="btn btn-primary" onClick={() => alert('Add Transaction feature mock')}>+ Record Transaction</button>
      </div>
      <div className="card">
        <div style={{overflowX:'auto'}}>
          <table className="data-table">
            <thead>
              <tr><th>Ref #</th><th>Product</th><th>Type</th><th>Quantity</th><th>Before</th><th>After</th><th>Date</th><th>By</th></tr>
            </thead>
            <tbody>
              {transactions.map(txn => (
                <tr key={txn.id}>
                  <td className="stock-num">{txn.id}</td>
                  <td><strong>{txn.productName}</strong></td>
                  <td>{txn.type === 'IN' ? <span className="badge badge-green">Stock In</span> : <span className="badge badge-red">Stock Out</span>}</td>
                  <td className="stock-num">{txn.type === 'IN' ? `+${txn.qty}` : `-${txn.qty}`}</td>
                  <td>{txn.before}</td>
                  <td>{txn.after}</td>
                  <td>{new Date(txn.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</td>
                  <td>{txn.user}</td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr><td colSpan="8" style={{textAlign:'center', padding:'24px', color:'var(--text-muted)'}}>No transactions found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Inventory;

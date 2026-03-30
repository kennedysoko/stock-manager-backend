import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';

const Products = () => {
  const { products } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <section className="page active" id="page-products">
      <div className="page-header">
        <h1>Products</h1>
        <p>Manage all your product catalogue</p>
      </div>
      <div className="toolbar">
        <div className="toolbar-left">
          <div className="search-field">
            <span>🔍</span>
            <input type="text" placeholder="Search by name…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => alert('Add Product feature mock')}>+ Add Product</button>
      </div>
      <div className="card">
        <div className="products-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th></th>
                <th>Product</th>
                <th>Category</th>
                <th>Price (MK)</th>
                <th>In Stock</th>
                <th>Min Level</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                let statusBadge;
                if (p.stock === 0) statusBadge = <span className="badge badge-red">Critical</span>;
                else if (p.stock <= p.min) statusBadge = <span className="badge badge-amber">Low</span>;
                else statusBadge = <span className="badge badge-green">In Stock</span>;

                return (
                  <tr key={p.id}>
                    <td><div className="product-img">{p.emoji}</div></td>
                    <td>
                      <div className="product-name">{p.name}</div>
                      <div className="product-id">#{p.id}</div>
                    </td>
                    <td>{p.cat}</td>
                    <td className="stock-num">{p.price.toLocaleString()}</td>
                    <td className="stock-num" style={{ color: p.stock <= p.min ? 'var(--danger)' : '' }}>{p.stock}</td>
                    <td className="stock-num">{p.min}</td>
                    <td>{statusBadge}</td>
                    <td>
                      <div className="action-btns">
                        <button className="btn btn-outline btn-sm">+ Stock</button>
                        <button className="btn btn-outline btn-sm">Edit</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan="8" style={{textAlign:'center', padding:'24px', color:'var(--text-muted)'}}>No products found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Products;

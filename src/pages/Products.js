import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';

const CATEGORIES = ['Beverages', 'Staples', 'Cooking', 'Dairy', 'Bakery', 'Snacks', 'Other'];
const SUPPLIERS = ['Peoples Trading Co.', 'Metro Wholesale', 'City Distributors', 'Farm Fresh Ltd', 'Other'];

const EMOJI_MAP = {
  Beverages: '🥤', Staples: '🌽', Cooking: '🫙',
  Dairy: '🥛', Bakery: '🍞', Snacks: '🍪', Other: '📦',
};

const defaultForm = {
  name: '', cat: 'Beverages', price: '', stock: '', min: '', supplier: 'Peoples Trading Co.', notes: '', image: null,
};

const Products = () => {
  const { products, addProduct } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm(f => ({ ...f, image: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Product name is required';
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) e.price = 'Enter a valid price';
    if (form.stock === '' || isNaN(form.stock) || Number(form.stock) < 0) e.stock = 'Enter a valid quantity';
    if (form.min === '' || isNaN(form.min) || Number(form.min) < 0) e.min = 'Enter a valid min level';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    addProduct({
      name: form.name.trim(),
      cat: form.cat,
      price: Number(form.price),
      stock: Number(form.stock),
      min: Number(form.min),
      emoji: EMOJI_MAP[form.cat] || '📦',
      image: form.image || null,
    });
    setShowModal(false);
    setForm(defaultForm);
    setErrors({});
  };

  const handleClose = () => {
    setShowModal(false);
    setForm(defaultForm);
    setErrors({});
  };

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
            <input
              type="text"
              placeholder="Search by name or ID…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              autoComplete="new-password"
            />
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Product</button>
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
                    <td><div className="product-img">
                      {p.image
                        ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
                        : p.emoji}
                    </div></td>
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
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      <div className={`modal-overlay${showModal ? ' open' : ''}`} onClick={e => e.target === e.currentTarget && handleClose()}>
        <div className="modal">
          <div className="modal-header">
            <h2>Add New Product</h2>
            <button className="modal-close" onClick={handleClose}>✕</button>
          </div>
          <div className="modal-body">
            <div className="form-row">
              <div className="form-group">
                <label>Product Name</label>
                <input
                  name="name"
                  placeholder="e.g. Coca-Cola 500ml"
                  value={form.name}
                  onChange={handleChange}
                  style={errors.name ? { borderColor: 'var(--danger)' } : {}}
                />
                {errors.name && <span style={{ fontSize: '.75rem', color: 'var(--danger)' }}>{errors.name}</span>}
              </div>
              <div className="form-group">
                <label>Product ID</label>
                <input value="Auto-generated" disabled style={{ background: 'var(--surface2)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select name="cat" value={form.cat} onChange={handleChange}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Unit Price (MK)</label>
                <input
                  name="price"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={form.price}
                  onChange={handleChange}
                  style={errors.price ? { borderColor: 'var(--danger)' } : {}}
                />
                {errors.price && <span style={{ fontSize: '.75rem', color: 'var(--danger)' }}>{errors.price}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Initial Quantity</label>
                <input
                  name="stock"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={form.stock}
                  onChange={handleChange}
                  style={errors.stock ? { borderColor: 'var(--danger)' } : {}}
                />
                {errors.stock && <span style={{ fontSize: '.75rem', color: 'var(--danger)' }}>{errors.stock}</span>}
              </div>
              <div className="form-group">
                <label>Min Stock Level</label>
                <input
                  name="min"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={form.min}
                  onChange={handleChange}
                  style={errors.min ? { borderColor: 'var(--danger)' } : {}}
                />
                {errors.min && <span style={{ fontSize: '.75rem', color: 'var(--danger)' }}>{errors.min}</span>}
              </div>
            </div>

            <div className="form-group">
              <label>Supplier</label>
              <select name="supplier" value={form.supplier} onChange={handleChange}>
                {SUPPLIERS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Product Image (Optional)</label>
              <label style={{
                display: 'flex', alignItems: 'center', gap: 12,
                border: '1.5px dashed var(--border)', borderRadius: 'var(--radius-sm)',
                padding: '10px 14px', cursor: 'pointer', background: 'var(--bg)',
                transition: 'border-color .15s',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                {form.image
                  ? <img src={form.image} alt="preview" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                  : <span style={{ fontSize: '1.6rem' }}>🖼️</span>
                }
                <span style={{ fontSize: '.85rem', color: 'var(--text-muted)' }}>
                  {form.image ? 'Click to change image' : 'Click to upload image'}
                </span>
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
              </label>
              {form.image && (
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, image: null }))}
                  style={{ marginTop: 6, fontSize: '.75rem', color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  Remove image
                </button>
              )}
            </div>

            <div className="form-group">
              <label>Notes (Optional)</label>
              <textarea
                name="notes"
                placeholder="Any notes about this product…"
                value={form.notes}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline" onClick={handleClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>Add Product</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Products;

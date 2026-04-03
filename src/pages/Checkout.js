import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { usePos } from '../context/PosContext';

const Checkout = () => {
  const { products } = useInventory();
  const {
    cart, addToCart, changeQty, removeFromCart, clearCart,
    discount, setDiscount, customer, setCustomer,
    getTotals, processCheckout, currentRef,
  } = usePos();

  const [search, setSearch]         = useState('');
  const [activeCat, setActiveCat]   = useState('All');
  const [receiptData, setReceiptData] = useState(null);

  const categories = ['All', 'Beverages', 'Staples', 'Dairy', 'Cooking', 'Bakery', 'Snacks'];

  /* ── filtered product list ── */
  const filtered = products.filter(p =>
    (activeCat === 'All' || p.cat === activeCat) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const { subtotal, total, discount: validDiscount } = getTotals();
  const cartQty = cart.reduce((s, i) => s + i.qty, 0);

  /* ── complete sale ── */
  const handleCheckout = () => {
    const data = processCheckout();
    if (data) setReceiptData(data);
  };

  return (
    <>
      {/* ══════════════════════════════════════════
          CHECKOUT PAGE
      ══════════════════════════════════════════ */}
      <section className="page active" id="page-checkout">

        {/* Page header */}
        <div className="page-header" style={{ marginBottom: 14 }}>
          <h1>🧾 Checkout — Point of Sale</h1>
          <p>Add items to the cart and process customer sales</p>
        </div>

        {/* Two-column POS layout */}
        <div className="pos-layout">

          {/* ────────────────────────────────────
              LEFT — PRODUCT GRID
          ──────────────────────────────────── */}
          <div className="pos-products-panel">

            {/* Search bar */}
            <div className="pos-search-bar">
              <span style={{ color: 'var(--text-light)' }}>🔍</span>
              <input
                type="text"
                placeholder="Search product by name…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* Category pills */}
            <div className="pos-cats">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`cat-pill${activeCat === cat ? ' active' : ''}`}
                  onClick={() => setActiveCat(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Product grid */}
            <div className="pos-grid">
              {filtered.length === 0 ? (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>
                  No products found
                </div>
              ) : (
                filtered.map(p => (
                  <div
                    key={p.id}
                    className={`pos-product-card${p.stock === 0 ? ' out-of-stock' : ''}`}
                    onClick={() => addToCart(p.id)}
                  >
                    <div className="pos-emoji">{p.emoji}</div>
                    <div className="pos-pname">{p.name}</div>
                    <div className="pos-pprice">MK {p.price.toLocaleString()}</div>
                    <div className={`pos-pstock${p.stock <= p.min ? ' low' : ''}`}>
                      {p.stock === 0 ? 'Out of stock' : `${p.stock} in stock`}
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>{/* /pos-products-panel */}


          {/* ────────────────────────────────────
              RIGHT — CART PANEL
          ──────────────────────────────────── */}
          <div className="cart-panel">

            {/* Cart header */}
            <div className="cart-header">
              <h3>
                🛒 Cart&nbsp;
                <span className="cart-count">{cartQty}</span>
              </h3>
              <span style={{ fontSize: '.75rem', color: 'var(--text-muted)', fontFamily: "'DM Mono',monospace" }}>
                {currentRef}
              </span>
            </div>

            {/* Customer name */}
            <div className="cart-customer">
              <input
                type="text"
                placeholder="👤 Customer name (optional)"
                value={customer}
                onChange={e => setCustomer(e.target.value)}
              />
            </div>

            {/* Items list */}
            <div className="cart-items">
              {cart.length === 0 ? (
                <div className="cart-empty">
                  <div className="cart-empty-icon">🛒</div>
                  <p>No items yet.<br />Click a product to add it.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div className="cart-item" key={item.id}>
                    <span style={{ fontSize: '1.3rem' }}>{item.emoji}</span>
                    <div className="cart-item-info">
                      <div className="cart-item-name">{item.name}</div>
                      <div className="cart-item-price">
                        MK {item.price.toLocaleString()} &times; {item.qty}
                      </div>
                    </div>
                    <div className="qty-ctrl">
                      <button className="qty-btn" onClick={() => changeQty(item.id, -1)}>&#8722;</button>
                      <span className="qty-val">{item.qty}</span>
                      <button className="qty-btn" onClick={() => changeQty(item.id, 1)}>+</button>
                    </div>
                    <div className="cart-item-subtotal">
                      MK {(item.price * item.qty).toLocaleString()}
                    </div>
                    <button className="cart-remove" onClick={() => removeFromCart(item.id)}>&#x2715;</button>
                  </div>
                ))
              )}
            </div>

            {/* Summary — only visible when cart has items */}
            {cart.length > 0 && (
              <div className="cart-summary">
                <div className="discount-row">
                  <input
                    type="number"
                    placeholder="Discount (MK)"
                    min="0"
                    value={discount || ''}
                    onChange={e => setDiscount(e.target.value)}
                  />
                </div>
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>MK {subtotal.toLocaleString()}</span>
                </div>
                <div className="summary-row">
                  <span>Discount</span>
                  <span>MK {validDiscount.toLocaleString()}</span>
                </div>
                <div className="summary-row total">
                  <span>TOTAL</span>
                  <span>MK {total.toLocaleString()}</span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="cart-actions">
              <button
                className="btn btn-checkout"
                disabled={cart.length === 0}
                onClick={handleCheckout}
              >
                💳 Complete Sale
              </button>
              <button className="btn btn-outline btn-clear" onClick={clearCart}>
                🗑 Clear Cart
              </button>
            </div>

          </div>{/* /cart-panel */}

        </div>{/* /pos-layout */}
      </section>


      {/* ══════════════════════════════════════════
          RECEIPT MODAL
      ══════════════════════════════════════════ */}
      {receiptData && (
        <div className="modal-overlay open">
          <div className="receipt">

            {/* Header */}
            <div className="receipt-header">
              <div className="receipt-logo">Stock<span>Smart</span></div>
              <p>Kayola General Store · Lilongwe, Malawi</p>
            </div>

            {/* Body */}
            <div className="receipt-body">
              <div className="receipt-meta">
                <span>
                  {new Date(receiptData.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                </span>
                <span>{receiptData.ref}</span>
              </div>
              <div style={{ fontSize: '.82rem', marginBottom: 10 }}>
                Customer: <strong>{receiptData.customer}</strong>
              </div>

              {/* Items */}
              <div className="receipt-items">
                {receiptData.items.map((item, idx) => (
                  <React.Fragment key={idx}>
                    <div className="receipt-item">
                      <span>{item.name} &times; {item.qty}</span>
                      <span>MK {(item.price * item.qty).toLocaleString()}</span>
                    </div>
                    <div className="receipt-item">
                      <span style={{ fontSize: '.72rem', color: 'var(--text-muted)' }}>
                        @ MK {item.price.toLocaleString()} each
                      </span>
                    </div>
                  </React.Fragment>
                ))}
              </div>

              {/* Totals */}
              <div className="receipt-totals">
                <div className="r-row">
                  <span>Subtotal</span>
                  <span>MK {receiptData.subtotal.toLocaleString()}</span>
                </div>
                <div className="r-row">
                  <span>Discount</span>
                  <span>MK {receiptData.discount.toLocaleString()}</span>
                </div>
                <div className="r-row r-total">
                  <span>TOTAL PAID</span>
                  <span>MK {receiptData.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="receipt-footer">Thank you for shopping with us! 🙏</div>

            {/* Actions */}
            <div className="receipt-actions">
              <button
                className="btn btn-outline"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => setReceiptData(null)}
              >
                Close
              </button>
              <button
                className="btn btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => window.print()}
              >
                🖨 Print
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Checkout;

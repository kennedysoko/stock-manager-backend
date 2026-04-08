import React, { useState } from 'react';
import {
  Search, ShoppingCart, Minus, Plus, X,
  CreditCard, Trash2, Printer, Receipt, Tag, Smartphone, Banknote, MoreHorizontal,
} from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { usePos } from '../context/PosContext';

/* ── Payment methods available in Malawi ── */
const PAYMENT_METHODS = [
  { id: 'cash',        label: 'Cash',         icon: Banknote,     color: '#2D8A5E' },
  { id: 'airtel',     label: 'Airtel Money',  icon: Smartphone,   color: '#E05C3A' },
  { id: 'mpamba',     label: 'TNM Mpamba',    icon: Smartphone,   color: '#3B7DD8' },
  { id: 'other',      label: 'Other',         icon: MoreHorizontal, color: '#7A7269' },
];


const Checkout = () => {
  const { products } = useInventory();
  const {
    cart, addToCart, changeQty, removeFromCart, clearCart,
    discount, setDiscount, customer, setCustomer,
    getTotals, processCheckout, currentRef,
  } = usePos();

  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('All');
  const [receiptData, setReceiptData] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amountTendered, setAmountTendered] = useState('');

  const categories = ['All', 'Beverages', 'Staples', 'Dairy', 'Cooking', 'Bakery', 'Snacks'];

  /* ── filtered product list ── */
  const filtered = products.filter(p =>
    (activeCat === 'All' || p.cat === activeCat) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const { subtotal, total, discount: validDiscount } = getTotals();
  const cartQty = cart.reduce((s, i) => s + i.qty, 0);

  /* ── complete sale ── */
  const handleInitiateSideCheckout = () => {
    setIsConfirming(true);
  };

  const handleConfirmSale = () => {
    const selectedMethod = PAYMENT_METHODS.find(m => m.id === paymentMethod);
    const data = processCheckout({ paymentMethod: selectedMethod?.label || 'Cash' });
    if (data) {
      setReceiptData(data);
      setIsConfirming(false);
    }
  };

  const handleCancelSale = () => {
    setIsConfirming(false);
    setPaymentMethod('cash');
    setAmountTendered('');
  };

  const closeReceipt = () => {
    setReceiptData(null);
    setPaymentMethod('cash'); // Reset payment method for next sale
    setAmountTendered(''); // Reset amount tendered
  };

  return (
    <>
      {/* ══════════════════════════════════════════
          CHECKOUT PAGE
      ══════════════════════════════════════════ */}
      <section className="page active" id="page-checkout">

        {/* Page header */}
        <div className="page-header" style={{ marginBottom: 14 }}>
          <h1><Receipt size={22} style={{ marginRight: 8, verticalAlign: 'middle', color: 'var(--accent)' }} />Checkout — Point of Sale</h1>
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
              <Search size={18} style={{ color: 'var(--text-light)' }} />
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
                <ShoppingCart size={18} style={{ marginRight: 6 }} />
                Cart&nbsp;
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
                placeholder="Customer name (optional)"
                value={customer}
                onChange={e => setCustomer(e.target.value)}
              />
            </div>

            {/* Items list */}
            <div className="cart-items">
              {cart.length === 0 ? (
                <div className="cart-empty">
                  <div className="cart-empty-icon">
                    <ShoppingCart size={44} strokeWidth={1.2} style={{ opacity: .35 }} />
                  </div>
                  <p>No items yet.<br />Click a product to add it.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div className="cart-item" key={item.id}>
                    <div className="cart-item-info">
                      <div className="cart-item-name">{item.name}</div>
                      <div className="cart-item-price">
                        MK {item.price.toLocaleString()} &times; {item.qty}
                      </div>
                    </div>
                    <div className="qty-ctrl">
                      <button className="qty-btn" onClick={() => changeQty(item.id, -1)}>
                        <Minus size={12} />
                      </button>
                      <span className="qty-val">{item.qty}</span>
                      <button className="qty-btn" onClick={() => changeQty(item.id, 1)}>
                        <Plus size={12} />
                      </button>
                    </div>
                    <div className="cart-item-subtotal">
                      MK {(item.price * item.qty).toLocaleString()}
                    </div>
                    <button className="cart-remove" onClick={() => removeFromCart(item.id)}>
                      <X size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Summary — only visible when cart has items */}
            {cart.length > 0 && (
              <div className="cart-summary">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, fontSize: '.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  <Tag size={13} /> Discount
                </div>
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
                onClick={handleInitiateSideCheckout}
              >
                <CreditCard size={18} /> Complete Sale
              </button>
              <button className="btn btn-outline btn-clear" onClick={clearCart}>
                <Trash2 size={15} /> Clear Cart
              </button>
            </div>

          </div>{/* /cart-panel */}

        </div>{/* /pos-layout */}
      </section>


      {/* ══════════════════════════════════════════
          RECEIPT / CONFIRMATION MODAL
      ══════════════════════════════════════════ */}
      {(isConfirming || receiptData) && (() => {
        const isReceipt = !!receiptData;
        const modalData = isReceipt ? receiptData : {
          ref: currentRef,
          date: new Date().toISOString(),
          customer: customer.trim() || 'Walk-in Customer',
          paymentMethod: PAYMENT_METHODS.find(m => m.id === paymentMethod)?.label || 'Cash',
          items: cart,
          subtotal,
          discount: validDiscount,
          total
        };

        return (
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
                  {new Date(modalData.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                </span>
                <span>{modalData.ref}</span>
              </div>
              <div style={{ fontSize: '.82rem', marginBottom: 16 }}>
                Customer: <strong>{modalData.customer}</strong>
              </div>
              
              {/* ── Payment Method Selector in Modal ── */}
              {isReceipt ? (
                <div style={{ fontSize: '.82rem', marginBottom: 10 }}>
                  Payment: <strong>{modalData.paymentMethod}</strong>
                </div>
              ) : (
                <div className="payment-method-section receipt-payment" style={{ borderTop: 'none', marginTop: 0, paddingTop: 0, marginBottom: 20 }}>
                  <div className="payment-method-label" style={{ justifyContent: 'center' }}>
                    <CreditCard size={13} /> Select Payment Method
                  </div>
                  <div className="payment-method-grid">
                    {PAYMENT_METHODS.map(method => {
                      const Icon = method.icon;
                      const isActive = paymentMethod === method.id;
                      return (
                        <button
                          key={'modal-pay-' + method.id}
                          className={`pay-method-btn${isActive ? ' active' : ''}`}
                          style={isActive ? { '--pay-color': method.color } : {}}
                          onClick={() => setPaymentMethod(method.id)}
                          title={method.label}
                        >
                          <Icon size={15} />
                          <span>{method.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Items */}
              <div className="receipt-items">
                {modalData.items.map((item, idx) => (
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
                  <span>MK {modalData.subtotal.toLocaleString()}</span>
                </div>
                <div className="r-row">
                  <span>Discount</span>
                  <span>MK {modalData.discount.toLocaleString()}</span>
                </div>
                <div className="r-row r-total">
                  <span>TOTAL PAID</span>
                  <span>MK {modalData.total.toLocaleString()}</span>
                </div>
                
                {/* ── Cash Amount Tendered & Change ── */}
                {paymentMethod === 'cash' && (
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px dashed var(--border)' }}>
                    <div className="r-row" style={{ alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Amount Tendered</span>
                      <input 
                        type="number" 
                        min="0"
                        value={amountTendered}
                        onChange={(e) => setAmountTendered(e.target.value)}
                        placeholder="MK"
                        style={{
                          width: '110px',
                          textAlign: 'right',
                          padding: '6px 8px',
                          border: '1.5px solid var(--border)',
                          borderRadius: 'var(--radius-sm)',
                          fontFamily: "'DM Mono', monospace",
                          fontSize: '.85rem',
                          outline: 'none'
                        }}
                      />
                    </div>
                    {Number(amountTendered) > modalData.total && (
                      <div className="r-row" style={{ color: 'var(--success)', fontWeight: 800, fontSize: '.95rem' }}>
                        <span>Change Due</span>
                        <span>MK {(Number(amountTendered) - modalData.total).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            {isReceipt && <div className="receipt-footer">Thank you for shopping with us!</div>}

            {/* Actions */}
            <div className="receipt-actions">
              {isConfirming ? (
                <>
                  <button
                    className="btn btn-outline"
                    style={{ flex: 1, justifyContent: 'center' }}
                    onClick={handleCancelSale}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    style={{ flex: 1, justifyContent: 'center' }}
                    onClick={handleConfirmSale}
                  >
                    <CreditCard size={16} /> Confirm Sale
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn btn-outline"
                    style={{ flex: 1, justifyContent: 'center' }}
                    onClick={closeReceipt}
                  >
                    Close
                  </button>
                  <button
                    className="btn btn-primary"
                    style={{ flex: 1, justifyContent: 'center' }}
                    onClick={() => window.print()}
                  >
                    <Printer size={16} /> Print
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      );})() /* IIFE closure for conditional variables */}
    </>
  );
};

export default Checkout;

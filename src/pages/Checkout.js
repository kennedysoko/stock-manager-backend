import React, { useState } from 'react';
import {
  Search, ShoppingCart, Minus, Plus, X,
  CreditCard, Trash2, Printer, Receipt, Tag, Smartphone, Banknote, MoreHorizontal,
} from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { usePos } from '../context/PosContext';

/* ── Payment methods available in Malawi ── */
const PAYMENT_METHODS = [
  { id: 'cash', label: 'Cash', icon: Banknote, color: '#2D8A5E' },
  { id: 'airtel', label: 'Airtel Money', icon: Smartphone, color: '#E05C3A' },
  { id: 'mpamba', label: 'TNM Mpamba', icon: Smartphone, color: '#3B7DD8' },
  { id: 'other', label: 'Other', icon: MoreHorizontal, color: '#7A7269' },
];


const Checkout = () => {
  const { products } = useInventory();
  const {
    cart, addToCart, changeQty, removeFromCart, clearCart,
    discount, setDiscount, customer, setCustomer,
    getTotals, processCheckout, currentRef
  } = usePos();

  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('All');
  const [receiptData, setReceiptData] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [amountTendered, setAmountTendered] = useState('');

  const categories = ['All', 'Beverages', 'Staples', 'Dairy', 'Cooking', 'Bakery', 'Snacks'];

  const filteredProducts = products.filter(p =>
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
    setPaymentMethod(null);
    setAmountTendered('');
  };

  const closeReceipt = () => {
    setReceiptData(null);
    setPaymentMethod(null); // Reset payment method for next sale
    setAmountTendered(''); // Reset amount tendered
  };

  return (
    <>
      {/* ══════════════════════════════════════════
          CHECKOUT PAGE
      ══════════════════════════════════════════ */}
      <section className="page active" id="page-checkout">
        <div className="page-header" style={{ marginBottom: '14px' }}>
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
                  className={`cat-pill ${activeCat === cat ? 'active' : ''}`}
                  onClick={() => setActiveCat(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Product grid */}
            <div className="pos-grid">
              {filteredProducts.map(p => (
                <div
                  key={p.id}
                  className={`pos-product-card ${p.stock === 0 ? 'out-of-stock' : ''}`}
                  onClick={() => addToCart(p.id)}
                >
                  <div className="pos-emoji">{p.emoji}</div>
                  <div className="pos-pname">{p.name}</div>
                  <div className="pos-pprice">MK {p.price.toLocaleString()}</div>
                  <div className={`pos-pstock ${p.stock <= p.min ? 'low' : ''}`}>
                    {p.stock === 0 ? 'Out of stock' : `${p.stock} in stock`}
                  </div>
                </div>
              ))}
              {filteredProducts.length === 0 && (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
                  No products found
                </div>
              )}
            </div>

          </div>{/* /pos-products-panel */}


          {/* ────────────────────────────────────
              RIGHT — CART PANEL
          ──────────────────────────────────── */}
          <div className="cart-panel">

            {/* Cart header */}
            <div className="cart-header">
              <h3>🛒 Cart <span className="cart-count">{cart.reduce((s, i) => s + i.qty, 0)}</span></h3>
              <span style={{ fontSize: '.75rem', color: 'var(--text-muted)', fontFamily: "'DM Mono',monospace" }}>{currentRef}</span>
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

        const canConfirm = paymentMethod && (
          paymentMethod !== 'cash' ||
          (amountTendered !== '' && Number(amountTendered) >= modalData.total)
        );

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
                  <span>{new Date(receiptData.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                  <span>{receiptData.ref}</span>
                </div>
                <div style={{ fontSize: '.82rem', marginBottom: '10px' }}>Customer: <strong>{receiptData.customer}</strong></div>
                <div className="receipt-items">
                  {modalData.items.map((item, idx) => (
                    <React.Fragment key={idx}>
                      <div className="receipt-item">
                        <span>{item.name} &times; {item.qty}</span>
                        <span>MK {(item.price * item.qty).toLocaleString()}</span>
                      </div>
                      <div className="receipt-item">
                        <span style={{ fontSize: '.72rem', color: 'var(--text-muted)' }}>@ MK {item.price.toLocaleString()} each</span>
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
                </div>
              </div>

              {/* Footer */}
              {isReceipt && <div className="receipt-footer">Thank you for shopping with us!</div>}

              {/* Actions */}
              <div className="receipt-actions">
                <button className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setReceiptData(null)}>Close</button>
                <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => alert('Printing...')}>🖨 Print</button>
              </div>

            </div>
          </div>
        );
      })() /* IIFE closure for conditional variables */}
    </>
  );
};

export default Checkout;

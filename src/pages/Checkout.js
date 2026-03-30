import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { usePos } from '../context/PosContext';

const Checkout = () => {
  const { products } = useInventory();
  const { 
    cart, addToCart, changeQty, removeFromCart, clearCart,
    discount, setDiscount, customer, setCustomer,
    getTotals, processCheckout, currentRef 
  } = usePos();

  const [search, setSearch] = useState('');
  const [currentCat, setCurrentCat] = useState('All');
  const [receiptData, setReceiptData] = useState(null);

  const categories = ['All', 'Beverages', 'Staples', 'Dairy', 'Cooking', 'Bakery', 'Snacks'];

  const filteredProducts = products.filter(p => 
    (currentCat === 'All' || p.cat === currentCat) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const { subtotal, total, discount: validDiscount } = getTotals();

  const handleCheckout = () => {
    const rData = processCheckout();
    if (rData) setReceiptData(rData);
  };

  return (
    <>
      <section className="page active" id="page-checkout">
        <div className="page-header" style={{marginBottom: '14px'}}>
          <h1>🧾 Checkout — Point of Sale</h1>
          <p>Add items to the cart and process customer sales</p>
        </div>
        <div className="pos-layout">

          {/* LEFT: Product Grid */}
          <div className="pos-products-panel">
            <div className="pos-search-bar">
              <span>🔍</span>
              <input 
                type="text" 
                placeholder="Search products by name…" 
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="pos-cats">
              {categories.map(cat => (
                <button 
                  key={cat} 
                  className={`cat-pill ${currentCat === cat ? 'active' : ''}`}
                  onClick={() => setCurrentCat(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
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
                <div style={{gridColumn:'1/-1', textAlign:'center', color:'var(--text-muted)', padding:'40px'}}>
                  No products found
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Cart */}
          <div className="cart-panel">
            <div className="cart-header">
              <h3>🛒 Cart <span className="cart-count">{cart.reduce((s,i)=>s+i.qty,0)}</span></h3>
              <span style={{fontSize:'.75rem', color:'var(--text-muted)', fontFamily:"'DM Mono',monospace"}}>{currentRef}</span>
            </div>
            <div className="cart-customer">
              <input 
                type="text" 
                placeholder="👤 Customer name (optional)" 
                value={customer}
                onChange={e => setCustomer(e.target.value)}
              />
            </div>
            <div className="cart-items">
              {cart.length === 0 ? (
                <div className="cart-empty">
                  <div className="cart-empty-icon">🛒</div>
                  <p>No items yet.<br/>Click a product to add it.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div className="cart-item" key={item.id}>
                    <span style={{fontSize:'1.3rem'}}>{item.emoji}</span>
                    <div className="cart-item-info">
                      <div className="cart-item-name">{item.name}</div>
                      <div className="cart-item-price">MK {item.price.toLocaleString()} &times; {item.qty}</div>
                    </div>
                    <div className="qty-ctrl">
                      <button className="qty-btn" onClick={() => changeQty(item.id, -1)}>&#8722;</button>
                      <span className="qty-val">{item.qty}</span>
                      <button className="qty-btn" onClick={() => changeQty(item.id, 1)}>+</button>
                    </div>
                    <div className="cart-item-subtotal">MK {(item.price * item.qty).toLocaleString()}</div>
                    <button className="cart-remove" onClick={() => removeFromCart(item.id)}>&#x2715;</button>
                  </div>
                ))
              )}
            </div>
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
                <div className="summary-row"><span>Subtotal</span><span>MK {subtotal.toLocaleString()}</span></div>
                <div className="summary-row"><span>Discount</span><span>MK {validDiscount.toLocaleString()}</span></div>
                <div className="summary-row total"><span>TOTAL</span><span>MK {total.toLocaleString()}</span></div>
              </div>
            )}
            <div className="cart-actions">
              <button className="btn btn-checkout" disabled={cart.length === 0} onClick={handleCheckout}>
                <span>💳</span> Complete Sale
              </button>
              <button className="btn btn-outline btn-clear" onClick={clearCart}>
                🗑 Clear Cart
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* RECEIPT MODAL */}
      {receiptData && (
        <div className="modal-overlay open">
          <div className="receipt">
            <div className="receipt-header">
              <div className="receipt-logo">Stock<span>Smart</span></div>
              <p>Kayola General Store · Lilongwe, Malawi</p>
            </div>
            <div className="receipt-body">
              <div className="receipt-meta">
                <span>{new Date(receiptData.date).toLocaleString([], { dateStyle:'short', timeStyle:'short' })}</span>
                <span>{receiptData.ref}</span>
              </div>
              <div style={{fontSize:'.82rem', marginBottom:'10px'}}>Customer: <strong>{receiptData.customer}</strong></div>
              <div className="receipt-items">
                {receiptData.items.map((i, idx) => (
                  <React.Fragment key={idx}>
                    <div className="receipt-item">
                      <span>{i.name} &times; {i.qty}</span>
                      <span>MK {(i.price * i.qty).toLocaleString()}</span>
                    </div>
                    <div className="receipt-item">
                      <span style={{fontSize:'.72rem', color:'var(--text-muted)'}}>@ MK {i.price.toLocaleString()} each</span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
              <div className="receipt-totals">
                <div className="r-row"><span>Subtotal</span><span>MK {receiptData.subtotal.toLocaleString()}</span></div>
                <div className="r-row"><span>Discount</span><span>MK {receiptData.discount.toLocaleString()}</span></div>
                <div className="r-row r-total"><span>TOTAL PAID</span><span>MK {receiptData.total.toLocaleString()}</span></div>
              </div>
            </div>
            <div className="receipt-footer">Thank you for shopping with us! 🙏</div>
            <div className="receipt-actions">
              <button className="btn btn-outline" style={{flex:1, justifyContent:'center'}} onClick={() => setReceiptData(null)}>Close</button>
              <button className="btn btn-primary" style={{flex:1, justifyContent:'center'}} onClick={() => alert('Printing...')}>🖨 Print</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Checkout;

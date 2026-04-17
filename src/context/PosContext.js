import React, { createContext, useContext, useState } from 'react';
import { useInventory } from './InventoryContext';
import { useAuth } from './AuthContext';

const PosContext = createContext();

export const usePos = () => useContext(PosContext);

export const PosProvider = ({ children }) => {
  const { products, recordTransaction } = useInventory();
  const { user } = useAuth();
  
  const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [customer, setCustomer] = useState('');
  
  const [saleCounter, setSaleCounter] = useState(() => {
    return parseInt(localStorage.getItem('stocksmart_salecounter') || '100', 10);
  });
  
  const currentRef = `#SALE-${saleCounter + 1}`;

  const addToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product || product.stock <= 0) return { success: false, message: 'Out of stock' };
    
    const existing = cart.find(i => i.id === productId);
    if (existing) {
      if (existing.qty >= product.stock) return { success: false, message: `Only ${product.stock} available!` };
      setCart(cart.map(i => i.id === productId ? { ...i, qty: i.qty + 1 } : i));
    } else {
      setCart([...cart, { id: productId, name: product.name, price: product.price, qty: 1, emoji: product.emoji }]);
    }
    return { success: true, message: `+ ${product.name} added` };
  };

  const changeQty = (productId, delta) => {
    const item = cart.find(i => i.id === productId);
    const product = products.find(p => p.id === productId);
    if (!item || !product) return;
    
    const newQty = item.qty + delta;
    if (newQty <= 0) {
      setCart(cart.filter(i => i.id !== productId));
      return;
    }
    if (newQty > product.stock) return; // Prevent over-adding
    
    setCart(cart.map(i => i.id === productId ? { ...i, qty: newQty } : i));
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(i => i.id !== productId));
  };
  
  const clearCart = () => {
    setCart([]);
    setDiscount(0);
    setCustomer('');
  };

  const getTotals = () => {
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const validDiscount = Math.min(Number(discount) || 0, subtotal);
    return { subtotal, discount: validDiscount, total: subtotal - validDiscount };
  };

  const processCheckout = ({ paymentMethod = 'Cash' } = {}) => {
    if (cart.length === 0) return null;
    
    const totals = getTotals();
    const customerName = customer.trim() || 'Walk-in Customer';
    const userName = user?.name || 'Cashier';
    
    // Deduct stock and record transactions
    cart.forEach(item => {
      recordTransaction(item.id, 'OUT', item.qty, userName, `POS Sale ${currentRef}`);
    });
    
    const receiptData = {
      ref: currentRef,
      date: new Date().toISOString(),
      customer: customerName,
      paymentMethod,
      items: [...cart],
      ...totals
    };
    
    // Increment tracker
    const newCounter = saleCounter + 1;
    setSaleCounter(newCounter);
    localStorage.setItem('stocksmart_salecounter', String(newCounter));
    
    // Empty cart
    clearCart();
    
    return receiptData;
  };

  return (
    <PosContext.Provider value={{
      cart, addToCart, changeQty, removeFromCart, clearCart,
      discount, setDiscount, customer, setCustomer,
      getTotals, currentRef, processCheckout
    }}>
      {children}
    </PosContext.Provider>
  );
};

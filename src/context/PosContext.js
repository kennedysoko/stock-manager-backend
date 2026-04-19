import React, { createContext, useContext, useState } from 'react';
import { useInventory } from './InventoryContext';
import { useAuth } from './AuthContext';
import { api } from '../utils/api';

const PosContext = createContext();

export const usePos = () => useContext(PosContext);

export const PosProvider = ({ children }) => {
  const { products, refreshData } = useInventory();
  const { user } = useAuth();
  
  const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [customer, setCustomer] = useState('');
  
  const currentRef = "New Sale";

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
    if (newQty > product.stock) return;
    
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

  const processCheckout = async ({ paymentMethod = 'Cash' } = {}) => {
    if (cart.length === 0) return null;
    
    try {
      const checkoutData = {
        cart: cart.map(item => ({
          productId: item.id,
          qty: item.qty
        })),
        discount: parseFloat(discount) || 0,
        customer: customer.trim() || 'Walk-in Customer',
        user: user?.name || 'Cashier'
      };

      const result = await api.post('/checkout/process', checkoutData);
      
      // Inject payment method into result for receipt display
      const receipt = { ...result, paymentMethod };
      
      refreshData();
      clearCart();
      
      return receipt;
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Checkout failed: ' + error.message);
      return null;
    }
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

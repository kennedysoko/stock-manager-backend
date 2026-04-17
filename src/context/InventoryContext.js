import React, { createContext, useContext, useState, useEffect } from 'react';

const InventoryContext = createContext();

export const useInventory = () => useContext(InventoryContext);

const initialInventory = [];

export const InventoryProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('stocksmart_products');
    return saved ? JSON.parse(saved) : initialInventory;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('stocksmart_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('stocksmart_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('stocksmart_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addProduct = (product) => {
    const newProduct = { ...product, id: `PRD-${String(products.length + 1).padStart(3, '0')}` };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id, updates) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const recordTransaction = (productId, type, qty, user, note) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const qtyNum = parseInt(qty, 10);
    const before = product.stock;
    const after = type === 'IN' ? before + qtyNum : before - qtyNum;
    
    // Update product stock
    updateProduct(productId, { stock: Math.max(0, after) });
    
    // Record transaction
    const newTxn = {
      id: `TXN-${String(transactions.length + 1).padStart(4, '0')}`,
      productId,
      productName: product.name,
      type,
      qty: qtyNum,
      before,
      after: Math.max(0, after),
      date: new Date().toISOString(),
      user: user || 'System',
      note
    };
    setTransactions([newTxn, ...transactions]);
  };

  const getLowStockProducts = () => {
    return products.filter(p => p.stock <= p.min);
  };

  return (
    <InventoryContext.Provider value={{
      products, addProduct, updateProduct,
      transactions, recordTransaction,
      getLowStockProducts,
    }}>
      {children}
    </InventoryContext.Provider>
  );
};

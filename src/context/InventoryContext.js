import React, { createContext, useContext, useState, useEffect } from 'react';

const InventoryContext = createContext();

export const useInventory = () => useContext(InventoryContext);

const initialInventory = [
  { id: 'PRD-001', name: 'Coca-Cola 500ml', cat: 'Beverages', price: 650, stock: 3, min: 20, emoji: '🥤' },
  { id: 'PRD-002', name: 'Maize Flour 2kg', cat: 'Staples', price: 1800, stock: 8, min: 15, emoji: '🌽' },
  { id: 'PRD-003', name: 'Cooking Oil 2L', cat: 'Cooking', price: 3500, stock: 4, min: 12, emoji: '🫙' },
  { id: 'PRD-004', name: 'Blue Band 500g', cat: 'Dairy', price: 2200, stock: 12, min: 10, emoji: '🧈' },
  { id: 'PRD-005', name: 'Bread 400g', cat: 'Bakery', price: 750, stock: 45, min: 10, emoji: '🍞' },
  { id: 'PRD-006', name: 'Sugar 2kg', cat: 'Staples', price: 1400, stock: 14, min: 20, emoji: '🧂' },
  { id: 'PRD-007', name: 'Fanta Orange 500ml', cat: 'Beverages', price: 600, stock: 62, min: 20, emoji: '🥤' },
  { id: 'PRD-008', name: 'Sprite 500ml', cat: 'Beverages', price: 600, stock: 38, min: 20, emoji: '🥤' },
  { id: 'PRD-009', name: 'Rice 5kg', cat: 'Staples', price: 5500, stock: 22, min: 10, emoji: '🍚' },
  { id: 'PRD-010', name: 'Kapenta 200g', cat: 'Staples', price: 900, stock: 16, min: 8, emoji: '🐟' },
  { id: 'PRD-011', name: 'Milk 500ml', cat: 'Dairy', price: 1200, stock: 9, min: 10, emoji: '🥛' },
  { id: 'PRD-012', name: 'Biscuits 200g', cat: 'Snacks', price: 450, stock: 30, min: 15, emoji: '🍪' },
  { id: 'PRD-013', name: 'Tomato Sauce 500g', cat: 'Cooking', price: 1100, stock: 20, min: 8, emoji: '🍅' },
  { id: 'PRD-014', name: 'Chips 100g', cat: 'Snacks', price: 350, stock: 50, min: 20, emoji: '🥔' },
  { id: 'PRD-015', name: 'Eggs tray 30', cat: 'Dairy', price: 4500, stock: 7, min: 5, emoji: '🥚' }
];

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

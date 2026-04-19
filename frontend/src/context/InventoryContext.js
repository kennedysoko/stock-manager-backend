import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

const InventoryContext = createContext();

export const useInventory = () => useContext(InventoryContext);

export const InventoryProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from backend
  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsData, transactionsData] = await Promise.all([
        api.get('/products'),
        api.get('/inventory/transactions')
      ]);
      
      // Map backend fields to frontend fields
      const mappedProducts = productsData.map(p => ({
        ...p,
        cat: p.category,
        min: p.minStockLevel
      }));

      setProducts(mappedProducts);
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Failed to fetch inventory data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addProduct = async (product) => {
    try {
      const backendProduct = {
        name: product.name,
        cat: product.cat,
        price: product.price,
        stock: product.stock,
        min: product.min,
        emoji: product.emoji,
        image: product.image,
        supplier: product.supplier,
        notes: product.notes
      };

      await api.post('/products', backendProduct);
      
      // Refresh everything from backend to ensure we have the real IDs and transactions
      await fetchData();
      
      return { success: true };
    } catch (error) {
      console.error('Failed to add product:', error);
      return { success: false, message: error.message };
    }
  };

  const updateProduct = async (id, updates) => {
    try {
      const backendUpdates = { ...updates };
      const updatedProduct = await api.put(`/products/${id}`, backendUpdates);
      
      // Refresh from backend
      await fetchData();
      
      return { success: true };
    } catch (error) {
      console.error('Failed to update product:', error);
      return { success: false, message: error.message };
    }
  };

  const recordTransaction = async (productId, type, qty, user, note) => {
    try {
      const txnData = {
        productId,
        type,
        qty: parseInt(qty, 10),
        user: user || 'System',
        notes: note
      };

      await api.post('/inventory/transaction', txnData);
      
      // Refresh from backend
      await fetchData();
      
      return { success: true };
    } catch (error) {
      console.error('Failed to record transaction:', error);
      return { success: false, message: error.message };
    }
  };

  const getLowStockProducts = () => {
    return products.filter(p => p.stock <= p.min);
  };

  return (
    <InventoryContext.Provider value={{
      products, addProduct, updateProduct,
      transactions, recordTransaction,
      getLowStockProducts,
      loading,
      refreshData: fetchData
    }}>
      {children}
    </InventoryContext.Provider>
  );
};

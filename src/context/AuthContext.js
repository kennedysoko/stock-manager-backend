import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check local storage for existing session
  useEffect(() => {
    const saved = localStorage.getItem('stocksmart_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem('stocksmart_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      // Backend expects { username, password }
      const response = await api.post('/auth/login', { username, password });
      
      // Assume backend returns { user: { ... }, access_token: "..." }
      // Or just the user object for now since we're not using JWT in the frontend yet
      
      const userData = {
        email: response.email || username,
        name: response.name || response.username,
        role: response.role || 'Staff',
        initials: (response.name || response.username || 'U').substring(0, 2).toUpperCase()
      };

      setUser(userData);
      localStorage.setItem('stocksmart_user', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('stocksmart_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

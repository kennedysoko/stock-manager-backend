import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check local storage for existing session
  useEffect(() => {
    const saved = localStorage.getItem('stocksmart_user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const login = (email, password) => {
    // Mock login based on user request (demo login)
    if (email === 'admin@stocksmart.mw' && password === 'password123') {
      const userData = { email, name: 'Admin Kayola', role: 'Administrator', initials: 'AK' };
      setUser(userData);
      localStorage.setItem('stocksmart_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('stocksmart_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

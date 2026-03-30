import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@stocksmart.mw');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!login(email, password)) {
      setError('Invalid credentials');
    }
  };

  return (
    <div id="login-page">
      <div className="login-box">
        <div className="login-logo">Stock<span>Smart</span></div>
        <div className="login-sub">Small Business Inventory Management — Malawi</div>
        <h2>Sign in to your account</h2>
        
        {error && <div style={{color: 'var(--danger)', fontSize: '.85rem', marginBottom: '14px', fontWeight: 'bold'}}>{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email address</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              placeholder="you@business.mw" 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)} 
              placeholder="Enter password" 
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{width:'100%', justifyContent:'center', height:'44px', fontSize:'.95rem'}}>
            Sign In →
          </button>
        </form>
        
        <div className="login-hint">Demo: admin@stocksmart.mw / password123</div>
      </div>
    </div>
  );
};

export default Login;

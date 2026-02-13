import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // ✅ UPDATED: Register Function using Relative Path
  const register = async (formData) => {
    // Changed from http://localhost:5000/api/auth/register to relative path
    const res = await axios.post('/api/auth/register', formData);
    
    const { token, user: userData } = res.data;

    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    
    setUser(userData);
  };

  // ✅ UPDATED: Login Function using Relative Path
  const login = async (email, password) => {
    try {
      // Changed from http://localhost:5000/api/auth/login to relative path
      const res = await axios.post('/api/auth/login', { email, password });
      
      const { token, user: userData } = res.data;

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      
      setUser(userData);
      return res.data; 
    } catch (err) {
      throw err; 
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
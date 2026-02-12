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

  // ✅ ADDED: The Register Function
  const register = async (formData) => {
    // This sends name, email, password, phone, and address to your API
    const res = await axios.post('http://localhost:5000/api/auth/register', formData);
    
    // If successful, the backend sends back a token and user object
    const { token, user: userData } = res.data;

    // Save to LocalStorage so the user stays logged in on refresh
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    
    setUser(userData);
  };

 const login = async (email, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      
      const { token, user: userData } = res.data;

      // Save the fresh "Admin Badge" to storage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      
      setUser(userData);
      return res.data; // Return data so your Login.jsx can redirect
    } catch (err) {
      throw err; // Let the login page handle the error message
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
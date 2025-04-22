import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import { setAuthToken, removeAuthToken } from '../utils/authToken';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        setAuthToken(token);
        try {
          const res = await api.get('/auth/profile');
          setUser(res.data.user);
          setIsAuthenticated(true);
        } catch (error) {
          localStorage.removeItem('token');
          removeAuthToken();
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const authContextValue = {
    user,
    isAuthenticated,
    loading,
    error,
    login: async (username, password) => {
      try {
        setError(null);
        const res = await api.post('/auth/login', { username, password });
        localStorage.setItem('token', res.data.token);
        setAuthToken(res.data.token);
        setUser(res.data.user);
        setIsAuthenticated(true);
        return res.data;
      } catch (error) {
        setError(error.response?.data?.error || 'Login failed');
        throw error;
      }
    },
    register: async (userData) => {
      try {
        setError(null);
        const res = await api.post('/auth/register', userData);
        return res.data;
      } catch (error) {
        setError(error.response?.data?.error || 'Registration failed');
        throw error;
      }
    },
    logout: () => {
      localStorage.removeItem('token');
      removeAuthToken();
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
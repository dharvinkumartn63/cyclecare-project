import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('cc_token');
    const storedUser = localStorage.getItem('cc_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = useCallback((tokenVal, userData) => {
    localStorage.setItem('cc_token', tokenVal);
    localStorage.setItem('cc_user', JSON.stringify(userData));
    setToken(tokenVal);
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try { await authApi.logout(); } catch (_) {}
    localStorage.removeItem('cc_token');
    localStorage.removeItem('cc_user');
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('cc_user', JSON.stringify(updatedUser));
  }, []);

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;

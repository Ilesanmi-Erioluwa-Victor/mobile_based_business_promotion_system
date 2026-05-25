import { createContext, useMemo, useState } from 'react';
import api from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('bizpromo_token'));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('bizpromo_user');
    return stored ? JSON.parse(stored) : null;
  });

  const persist = (payload) => {
    localStorage.setItem('bizpromo_token', payload.token);
    localStorage.setItem('bizpromo_user', JSON.stringify(payload.user));
    setToken(payload.token);
    setUser(payload.user);
  };

  const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    persist(data.data);
    return data;
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    persist(data.data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('bizpromo_token');
    localStorage.removeItem('bizpromo_user');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({
    user,
    token,
    login,
    logout,
    register,
    isAuthenticated: Boolean(token)
  }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

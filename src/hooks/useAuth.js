import { useState } from 'react';
import { login } from '../api/absento';
import { decodeJWT } from '../utils/jwt';

export default function useAuth() {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const t = localStorage.getItem('token');
    if (!t) return null;
    const decoded = decodeJWT(t);
    return decoded ? { id: decoded.id, role: decoded.role } : null;
  });

  const loginUser = async (email, password) => {
    const res = await login(email, password);
    setToken(res.token);
    const decoded = decodeJWT(res.token);
    setUser(decoded ? { id: decoded.id, role: decoded.role } : null);
    localStorage.setItem('token', res.token);
    return decoded ? { id: decoded.id, role: decoded.role } : null;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return { user, token, loginUser, logout };
}

import { useState, useEffect } from 'react';
import { login } from '../api/absento';
import { decodeJWT } from '../utils/jwt';
import axios from 'axios';
import { API_URL } from '../api/config';

export default function useAuth() {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  // Fetch user info by id (from token)
  const fetchUserInfo = async (id, token) => {
    try {
      const { data } = await axios.get(`${API_URL}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(data);
    } catch (e) {
      setUser(null);
    }
  };

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }
    const decoded = decodeJWT(token);
    if (decoded && decoded.id) {
      fetchUserInfo(decoded.id, token);
    } else {
      setUser(null);
    }
  }, [token]);

  const loginUser = async (email, password) => {
    const res = await login(email, password);
    setToken(res.token);
    const decoded = decodeJWT(res.token);
    if (decoded && decoded.id) {
      await fetchUserInfo(decoded.id, res.token);
    }
    localStorage.setItem('token', res.token);
    return decoded;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return { user, token, loginUser, logout };
}

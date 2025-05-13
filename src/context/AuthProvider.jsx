import React, { createContext, useContext, useState, useEffect } from "react";
import { login, getUserProfile, logout as logoutApi } from "../api/absento";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        setAuthError(null);
   
        const profile = await getUserProfile();
        setUser(profile);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Erreur de récupération du profil:', err);
        setUser(null);
        setIsAuthenticated(false);
        setAuthError(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const loginUser = async (email, password) => {
    try {
      const response = await login(email, password);
      
      if (response && response.token) {
        localStorage.setItem('auth_token', response.token);
      }
      
      const profile = await getUserProfile();
      setUser(profile);
      setIsAuthenticated(true);
      setAuthError(null);
      return profile;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setAuthError(error.response?.data?.error || 'Erreur de connexion');
      throw error;
    }
  };

  const logout = async () => {
    await logoutApi();
    localStorage.removeItem('auth_token');
    setUser(null);
    setAuthError(null);
    setIsAuthenticated(false);
  };

  const refreshUser = async () => {
    const profile = await getUserProfile();
    setUser(profile);
    return profile;
  };



  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, loginUser, logout, authError, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

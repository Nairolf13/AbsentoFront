import React, { createContext, useContext, useState, useEffect } from "react";
import { login, getUserProfile, logout as logoutApi } from "../api/absento";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        setAuthError(null);
        const profile = await getUserProfile();
        setUser(profile);
      } catch (err) {
        // Si erreur 401 (non connecté), on ne bloque pas l'UI
        setUser(null);
        setAuthError(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const loginUser = async (email, password) => {
    await login(email, password);
    const profile = await getUserProfile();
    setUser(profile);
    setAuthError(null);
    return profile;
  };

  const logout = async () => {
    await logoutApi();
    setUser(null);
    setAuthError(null);
    setToken(null);
  };

  const refreshUser = async () => {
    const profile = await getUserProfile();
    setUser(profile);
    return profile;
  };

  // On n'affiche pas un écran de chargement bloquant sur les pages publiques
  // Si besoin, tu peux personnaliser ce comportement ici

  return (
    <AuthContext.Provider value={{ user, token, loading, loginUser, logout, authError, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

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
        setUser(null);
        setAuthError(null); 
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const loginUser = async (email, password) => {    await login(email, password); 
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

  return (
    <AuthContext.Provider value={{ user, token, loading, loginUser, logout, authError }}>
      {loading ? (
        <div className="w-full h-screen flex items-center justify-center text-lg text-primary">
          Chargement de l'authentification...
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

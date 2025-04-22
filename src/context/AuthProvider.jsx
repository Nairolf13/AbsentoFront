import React, { createContext, useContext, useState, useEffect } from "react";
import { login, getUserProfile } from "../api/absento";
import { decodeJWT } from "../utils/jwt";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const t = localStorage.getItem("token");
    if (!t) return null;
    const decoded = decodeJWT(t);
    return decoded ? { id: decoded.id, role: decoded.role } : null;
  });

  // Synchronise token/user avec localStorage à chaque changement
  useEffect(() => {
    // LOG: Affiche la valeur du token à chaque changement
    console.log('[AuthProvider] Token (localStorage):', localStorage.getItem('token'));
    console.log('[AuthProvider] Token (state):', token);
    if (token) {
      localStorage.setItem("token", token);
      const decoded = decodeJWT(token);
      if (decoded) {
        // Appelle l’API pour avoir le profil complet
        getUserProfile(decoded.id, token)
          .then(profile => setUser(profile))
          .catch(err => {
            console.error('Erreur lors du chargement du profil utilisateur:', err);
            setUser({ id: decoded.id, role: decoded.role }); // fallback minimal
          });
      } else {
        setUser(null);
      }
    } else {
      localStorage.removeItem("token");
      setUser(null);
    }
  }, [token]);

  const loginUser = async (email, password) => {
    const res = await login(email, password);
    setToken(res.token);
    // setUser sera appelé automatiquement par useEffect
    return decodeJWT(res.token);
  };

  const logout = () => {
    setToken(null);
    // setUser sera appelé automatiquement par useEffect
  };

  return (
    <AuthContext.Provider value={{ user, token, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

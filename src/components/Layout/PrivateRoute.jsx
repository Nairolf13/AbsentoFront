import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null; 
  if (!user) {
    console.warn('[PrivateRoute] Redirection vers /login car utilisateur non authentifié');
    return <Navigate to="/login" replace />;
  }
  return children;
}

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

export default function PrivateRoute({ children }) {
  const auth = useAuth();
  const { token } = auth;
  if (!token) {
    console.warn('[PrivateRoute] Redirection vers /login car token absent ou null');
    return <Navigate to="/login" replace />;
  }
  return children;
}

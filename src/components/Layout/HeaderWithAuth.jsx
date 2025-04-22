import React from "react";
import { useAuth } from "../../context/AuthProvider";
import Header from "./Header";

export default function HeaderWithAuth() {
  const auth = useAuth();
  const { token } = auth;
  if (!token) return null;
  return <Header />;
}

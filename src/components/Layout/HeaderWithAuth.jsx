import React from "react";
import useAuth from "../../hooks/useAuth";
import Header from "./Header";

export default function HeaderWithAuth() {
  const { token } = useAuth();
  if (!token) return null;
  return <Header />;
}

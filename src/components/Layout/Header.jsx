import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function Header() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white shadow flex items-center justify-between px-6 py-4 rounded-b-2xl mb-8">
      <Link to="/" className="text-xl font-bold text-primary">Absento</Link>
      <nav className="flex gap-4">
        <Link to="/dashboard" className="text-secondary hover:text-primary">Dashboard</Link>
        <Link to="/absence/request" className="text-secondary hover:text-primary">Absence</Link>
        <Link to="/absence/suggest" className="text-secondary hover:text-primary">Replacement</Link>
        <span className="text-secondary hover:text-primary cursor-pointer" onClick={handleLogout}>Logout</span>
      </nav>
    </header>
  );
}

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserNotifications } from "../../api/notifications";
import useAuth from "../../hooks/useAuth";
import Notifications from "../Dashboard/Notifications";

export default function Header() {
  const navigate = useNavigate();
  const { logout, user, token } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(0);

  // Charger le nombre de notifications non lues au montage
  useEffect(() => {
    if (user && token) {
      getUserNotifications(user.id, token).then(data => {
        const unread = data.filter(n => !n.lu).length;
        setNotifCount(unread);
      });
    }
  }, [user, token]);

  // Récupère le nombre de notifications depuis Notifications.jsx
  useEffect(() => {
    // Utilise un event personnalisé pour synchroniser le compteur
    const handleNotifCount = (e) => setNotifCount(e.detail);
    window.addEventListener("notifCount", handleNotifCount);
    return () => window.removeEventListener("notifCount", handleNotifCount);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white shadow flex items-center justify-between px-6 py-4 rounded-b-2xl mb-8 relative">
      <Link to="/" className="text-xl font-bold text-primary">Absento</Link>
      <nav className="flex gap-4 items-center">
        <button onClick={() => setNotifOpen(v => !v)} className="relative focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {notifCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 font-bold border border-white">
              {notifCount}
            </span>
          )}
        </button>
        <span className="text-secondary hover:text-primary transition font-semibold cursor-pointer" onClick={handleLogout}>Déconnexion</span>
      </nav>
      {/* Panneau notifications */}
      {notifOpen && (
        <div className="absolute right-0 top-full mt-2 z-50">
          <Notifications onCountChange={setNotifCount} />
        </div>
      )}
    </header>
  );
}

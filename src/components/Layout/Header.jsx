import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserNotifications } from "../../api/notifications";
import { useAuth } from "../../context/AuthProvider";
import Notifications from "../Dashboard/Notifications";
import Profile from "../Profile/Profile";

export default function Header() {
  const navigate = useNavigate();
  const auth = useAuth();
  const { logout, user } = auth;
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showAbsenceToast, setShowAbsenceToast] = useState(false);

  useEffect(() => {
    if (user) {
      getUserNotifications(user.id).then(data => {
        if (!Array.isArray(data)) {
          setNotifCount(0);
          return;
        }
        const unread = data.filter(n => !n.lu).length;
        setNotifCount(unread);
      });
    }
  }, [user]);

  useEffect(() => {
    const handleNotifCount = (e) => setNotifCount(e.detail);
    window.addEventListener("notifCount", handleNotifCount);
    return () => window.removeEventListener("notifCount", handleNotifCount);
  }, []);

  useEffect(() => {
    const handler = () => {
      setShowAbsenceToast(true);

      window.dispatchEvent(new CustomEvent("refreshNotifications"));
      
      // Masquer le toast après 3 secondes
      setTimeout(() => {
        setShowAbsenceToast(false);
      }, 3000);
    };
    window.addEventListener("absenceCreated", handler);
    return () => window.removeEventListener("absenceCreated", handler);
  }, []);

  useEffect(() => {
    const refresh = () => {
      if (user) {
        getUserNotifications(user.id).then(data => {
          if (!Array.isArray(data)) {
            setNotifCount(0);
            return;
          }
          const unread = data.filter(n => !n.lu).length;
          setNotifCount(unread);
        });
      }
    };
    window.addEventListener("refreshNotifications", refresh);
    return () => window.removeEventListener("refreshNotifications", refresh);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white shadow flex items-center justify-between px-6 py-4 rounded-b-2xl mb-8 relative">
      <Link to="/" className="text-xl font-bold text-primary">Absento</Link>
      <nav className="flex gap-4 items-center">
        <Link to="#" onClick={e => { e.preventDefault(); setProfileOpen(true); }} className="flex items-center px-1 py-1 rounded hover:bg-gray-100 transition">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </Link>
        <button onClick={() => setNotifOpen(v => !v)} className="relative focus:outline-none px-1 py-1 rounded hover:bg-gray-100 transition">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {notifCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 font-bold border border-white">
              {notifCount}
            </span>
          )}
        </button>
        <button
          onClick={handleLogout}
          title="Déconnexion"
          className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-50 transition text-secondary hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
          </svg>
          <span className="hidden sm:inline font-semibold">Déconnexion</span>
        </button>
      </nav>
      {showAbsenceToast && (
        <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg animate-fade-in">
          <span>Votre absence a bien été déclarée !</span>
        </div>
      )}
      {notifOpen && (
        <div className="absolute right-0 top-full mt-2 z-50">
          <Notifications onCountChange={setNotifCount} />
        </div>
      )}
      {profileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="relative bg-white rounded-xl shadow-xl p-6 max-w-lg w-full mx-2 animate-fade-in">
            <button onClick={() => setProfileOpen(false)} className="absolute top-2 right-2 p-1 rounded hover:bg-gray-200 transition" aria-label="Fermer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <Profile />
          </div>
        </div>
      )}
    </header>
  );
}

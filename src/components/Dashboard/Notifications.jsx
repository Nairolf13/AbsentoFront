import React, { useEffect, useState, useRef } from "react";
import useSocket from "../../hooks/useSocket";
import { useAuth } from "../../context/AuthProvider";
import { getUserNotifications, deleteNotification, markNotificationAsRead } from "../../api/notifications";

export default function Notifications({ onCountChange }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [show, setShow] = React.useState(true);
  const notifRef = React.useRef();

  useEffect(() => {
    if (user) {
      getUserNotifications(user.id).then(data => {
        const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setNotifications(sorted);
        const unread = sorted.filter(n => !n.lu).length;
        if (onCountChange) onCountChange(unread);
        window.dispatchEvent(new CustomEvent("notifCount", { detail: unread }));
      });
    }
  }, [user, onCountChange]);

  useSocket((event, payload) => {
    if (event === "notification") {
      setNotifications(n => {
        const newList = [{ ...payload, id: payload.id || Math.random(), lu: false }, ...n];
        return newList;
      });
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const socket = window.io && window.io();
    if (socket) {
      socket.emit('identify', user.id);
    }
  }, [user]);

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) return;
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShow(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications(n => {
        const filtered = n.filter(notif => notif.id !== id);
        return filtered;
      });
    } catch (err) {
      alert("Erreur lors de la suppression de la notification");
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(n => n.map(notif => notif.id === id ? { ...notif, lu: true } : notif));
    } catch (err) {
      alert("Erreur lors du passage en lu");
    }
  };

  const unreadCount = notifications.filter(n => !n.lu).length;

  useEffect(() => {
    if (onCountChange) onCountChange(unreadCount);
    window.dispatchEvent(new CustomEvent("notifCount", { detail: unreadCount }));
  }, [unreadCount, onCountChange]);

  if (!show) return null;

  // Gestion navigation mobile
  const navigateBack = () => {
    if (window.innerWidth <= 768) {
      // Sur mobile, on redirige toujours vers le dashboard
      window.location.href = "/dashboard";
    } else {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = "/";
      }
    }
  };

  // Détection mobile
  const isMobile = window.innerWidth <= 768;

  return (
    <div
      ref={notifRef}
      className={`bg-white shadow-lg w-full ${isMobile ? 'fixed inset-0 z-50 rounded-none h-full overflow-auto' : 'rounded-2xl max-w-xl mx-auto'} px-8 py-10`}
      style={isMobile ? { minHeight: '100vh', maxHeight: '100vh' } : { maxWidth: '520px', minWidth: '420px' }}
    >
      {isMobile && (
        <button
          className="absolute top-4 left-4 flex items-center gap-1 text-primary font-bold text-lg bg-white/80 rounded-full px-2 py-1 shadow"
          onClick={navigateBack}
          aria-label="Retour"
          style={{ zIndex: 10 }}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-left"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Retour
        </button>
      )}
      <h4 className="font-semibold text-xl mb-4 text-primary text-center">Notifications</h4>
      <ul className="divide-y divide-accent">
        {notifications.map((n, i) => (
          <li
            key={n.id || i}
            className={`py-3 flex items-center gap-3 justify-between rounded-xl transition ${!n.lu ? 'bg-yellow-50' : ''}`}
          >
            <div className="flex items-center gap-3">
              {!n.lu && <span className="h-2 w-2 bg-primary rounded-full"></span>}
              <span className={`text-sm ${!n.lu ? 'font-bold text-secondary' : 'text-gray-700'}`}>
                {/* Affichage multi-ligne pour chaque info */}
                {n.text ? n.text.split(/\n|\\n|<br\s*\/?>/gi).map((line, i) => (
                  <div key={i}>{line}</div>
                )) : (n.message ? n.message.split(/\n|\\n|<br\s*\/?>/gi).map((line, i) => (
                  <div key={i}>{line}</div>
                )) : null)}
              </span>
            </div>
            <div className="flex items-center gap-1 justify-end">
              {!n.lu && (
                <button
                  className="text-xs text-green-600 hover:text-green-800 flex items-center justify-center"
                  style={{ width: 28, height: 28, minWidth: 0, minHeight: 0, padding: 0 }}
                  onClick={() => handleMarkAsRead(n.id)}
                  title="Marquer comme lue"
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle"><circle cx="10" cy="10" r="9"/><path d="M7 10l2 2 4-4"/></svg>
                </button>
              )}
              <button
                className="text-xs text-red-500 hover:text-red-700 flex items-center justify-center"
                style={{ width: 28, height: 28, minWidth: 0, minHeight: 0, padding: 0 }}
                onClick={() => handleDelete(n.id)}
                title="Supprimer cette notification"
              >
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M2.5 1a1 1 0 0 0-1 1V2.5H1a1 1 0 0 0 0 2h14a1 1 0 0 0 0-2h-.5V2a1 1 0 0 0-1-1h-9zm1 3v9.5a2.5 2.5 0 0 0 2.5 2.5h3a2.5 2.5 0 0 0 2.5-2.5V4h-8zm2.5 2a.5.5 0 0 1 1 0v6a.5.5 0 0 1-1 0v-6zm3 0a.5.5 0 0 1 1 0v6a.5.5 0 0 1-1 0v-6z"/></svg>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

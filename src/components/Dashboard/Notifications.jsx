import React, { useEffect, useState, useRef } from "react";
import useSocket from "../../hooks/useSocket";
import { useAuth } from "../../context/AuthProvider";
import { getUserNotifications, deleteNotification, markNotificationAsRead } from "../../api/notifications";
import "./binButton.css";

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
                className="bin-button"
                onClick={() => handleDelete(n.id)}
                title="Supprimer cette notification"
                style={{marginLeft: 0, marginRight: 0, background: 'none', border: 'none', boxShadow: 'none', color: '#e53e3e'}}
              >
                {/* Trash animated icon, couleurs dynamiques */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 39 7"
                  className="bin-top"
                >
                  <line strokeWidth="4" stroke="currentColor" y2="5" x2="39" y1="5"></line>
                  <line
                    strokeWidth="3"
                    stroke="currentColor"
                    y2="1.5"
                    x2="26.0357"
                    y1="1.5"
                    x1="12"
                  ></line>
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 33 39"
                  className="bin-bottom"
                >
                  <mask fill="white" id="path-1-inside-1_8_19">
                    <path
                      d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"
                    ></path>
                  </mask>
                  <path
                    mask="url(#path-1-inside-1_8_19)"
                    fill="currentColor"
                    d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
                  ></path>
                  <path strokeWidth="4" stroke="currentColor" d="M12 6L12 29"></path>
                  <path strokeWidth="4" stroke="currentColor" d="M21 6V29"></path>
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 89 80"
                  className="garbage"
                >
                  <path
                    fill="currentColor"
                    d="M20.5 10.5L37.5 15.5L42.5 11.5L51.5 12.5L68.75 0L72 11.5L79.5 12.5H88.5L87 22L68.75 31.5L75.5066 25L86 26L87 35.5L77.5 48L70.5 49.5L80 50L77.5 71.5L63.5 58.5L53.5 68.5L65.5 70.5L45.5 73L35.5 79.5L28 67L16 63L12 51.5L0 48L16 25L22.5 17L20.5 10.5Z"
                  ></path>
                </svg>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

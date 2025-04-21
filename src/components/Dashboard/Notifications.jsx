import React, { useEffect, useState } from "react";
import useSocket from "../../hooks/useSocket";
import { useAuth } from "../../context/AuthProvider";
import { getUserNotifications, deleteNotification, markNotificationAsRead } from "../../api/notifications";

export default function Notifications({ onCountChange }) {
  const { user, token } = useAuth();
  const [notifications, setNotifications] = useState([]);

  // Charger les notifications persistées au chargement
  useEffect(() => {
    if (user && token) {
      getUserNotifications(user.id, token).then(data => {
        const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setNotifications(sorted);
        // Synchronise le compteur avec le nombre de notifications non lues dès le chargement
        const unread = sorted.filter(n => !n.lu).length;
        if (onCountChange) onCountChange(unread);
        window.dispatchEvent(new CustomEvent("notifCount", { detail: unread }));
      });
    }
  }, [user, token, onCountChange]);

  // Socket.io : rejoindre la room et écouter les notifications push
  useSocket((event, payload) => {
    if (event === "notification") {
      setNotifications(n => {
        const newList = [{ ...payload, id: payload.id || Math.random(), lu: false }, ...n];
        return newList;
      });
    }
  }, [user]);

  // Identification socket.io (pour rejoindre la bonne room)
  useEffect(() => {
    if (!user) return;
    const socket = window.io && window.io();
    if (socket) {
      socket.emit('identify', user.id);
    }
  }, [user]);

  // Suppression d'une notification
  const handleDelete = async (id) => {
    try {
      await deleteNotification(id, token);
      setNotifications(n => {
        const filtered = n.filter(notif => notif.id !== id);
        return filtered;
      });
    } catch (err) {
      alert("Erreur lors de la suppression de la notification");
    }
  };

  // Marquer une notification comme lue
  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id, token);
      setNotifications(n => n.map(notif => notif.id === id ? { ...notif, lu: true } : notif));
    } catch (err) {
      alert("Erreur lors du passage en lu");
    }
  };

  // Helper pour compter les notifications non lues
  const unreadCount = notifications.filter(n => !n.lu).length;

  // Notifier le header à chaque changement de notifications non lues
  useEffect(() => {
    if (onCountChange) onCountChange(unreadCount);
    window.dispatchEvent(new CustomEvent("notifCount", { detail: unreadCount }));
  }, [unreadCount, onCountChange]);

  return (
    <div className="bg-white rounded-2xl shadow-lg px-8 py-10 w-full max-w-xs mx-auto">
      <h4 className="font-semibold text-xl mb-4 text-primary text-center">Notifications</h4>
      <ul className="divide-y divide-accent">
        {notifications.map((n, i) => (
          <li
            key={n.id || i}
            className={`py-3 flex items-center gap-3 justify-between rounded-xl transition ${!n.lu ? 'bg-yellow-50' : ''}`}
          >
            <div className="flex items-center gap-3">
              {!n.lu && <span className="h-2 w-2 bg-primary rounded-full"></span>}
              <span className={`text-sm ${!n.lu ? 'font-bold text-secondary' : 'text-gray-700'}`}>{n.text || n.message}</span>
            </div>
            <div className="flex items-center gap-2">
              {!n.lu && (
                <button
                  className="text-xs text-green-600 hover:underline"
                  onClick={() => handleMarkAsRead(n.id)}
                  title="Marquer comme lue"
                >
                  Marquer comme lue
                </button>
              )}
              <button
                className="text-xs text-red-500 hover:underline ml-2"
                onClick={() => handleDelete(n.id)}
                title="Supprimer cette notification"
              >
                Supprimer
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

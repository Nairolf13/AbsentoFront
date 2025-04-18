import React, { useEffect, useState } from "react";
import useSocket from "../../hooks/useSocket";
import { useAuth } from "../../context/AuthProvider";
import { getUserNotifications, deleteNotification } from "../../api/notifications";

export default function Notifications() {
  const { user, token } = useAuth();
  const [notifications, setNotifications] = useState([]);

  // Charger les notifications persistées au chargement
  useEffect(() => {
    if (user && token) {
      getUserNotifications(user.id, token).then(data => {
        setNotifications(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
      });
    }
  }, [user, token]);

  // Socket.io : rejoindre la room et écouter les notifications push
  useSocket((event, payload) => {
    if (event === "notification") {
      setNotifications(n => [
        { ...payload, id: payload.id || Math.random() },
        ...n
      ]);
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
      setNotifications(n => n.filter(notif => notif.id !== id));
    } catch (err) {
      alert("Erreur lors de la suppression de la notification");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg px-8 py-10 w-full max-w-xs mx-auto">
      <h4 className="font-semibold text-xl mb-4 text-primary text-center">Notifications</h4>
      <ul className="divide-y divide-accent">
        {notifications.map((n, i) => (
          <li key={n.id || i} className="py-3 flex items-center gap-3 justify-between">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 bg-primary rounded-full"></span>
              <span className="text-sm text-gray-700">{n.text || n.message}</span>
            </div>
            <button
              className="text-xs text-red-500 hover:underline ml-2"
              onClick={() => handleDelete(n.id)}
              title="Supprimer cette notification"
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

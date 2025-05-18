import { useState, useEffect } from 'react';
import { getUserNotifications, deleteNotification, markNotificationAsRead } from "../../../api/notifications";
import useSocket from "../../../hooks/useSocket";


export function useNotifications(user, onCountChange) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const data = await getUserNotifications(user.id);
      const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setNotifications(sorted);
      updateUnreadCount(sorted);
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications:", error);
    }
  };

  const updateUnreadCount = (notifs) => {
    const unread = notifs.filter(n => !n.lu).length;
    if (onCountChange) onCountChange(unread);
    window.dispatchEvent(new CustomEvent("notifCount", { detail: unread }));
  };

  useSocket((event, payload) => {
    if (event === "notification") {
      setNotifications(n => {
        const newList = [{ ...payload, id: payload.id || Math.random(), lu: false }, ...n];
        updateUnreadCount(newList);
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

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications(n => {
        const filtered = n.filter(notif => notif.id !== id);
        updateUnreadCount(filtered);
        return filtered;
      });
      return true;
    } catch (err) {
      console.error("Erreur lors de la suppression de la notification:", err);
      return false;
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(n => {
        const updated = n.map(notif => notif.id === id ? { ...notif, lu: true } : notif);
        updateUnreadCount(updated);
        return updated;
      });
      return true;
    } catch (err) {
      console.error("Erreur lors du passage en lu:", err);
      return false;
    }
  };

  const unreadCount = notifications.filter(n => !n.lu).length;

  useEffect(() => {
    updateUnreadCount(notifications);
  }, [unreadCount]);

  return {
    notifications,
    unreadCount,
    handleDelete,
    handleMarkAsRead,
    fetchNotifications
  };
}

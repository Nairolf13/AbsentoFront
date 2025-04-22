import axios from 'axios';
import { API_URL } from './config';

export async function getUserNotifications(userId, token) {
  const res = await axios.get(`${API_URL}/admin/notifications/${userId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  // Sécurisation : retourne un tableau vide si la réponse n'est pas un tableau
  const data = res.data;
  console.log('Réponse notifications:', data); // DEBUG
  return Array.isArray(data) ? data : [];
}

export async function deleteNotification(id, token) {
  await axios.delete(`${API_URL}/admin/notifications/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function markNotificationAsRead(id, token) {
  await axios.patch(`${API_URL}/admin/notifications/${id}/read`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

import axios from 'axios';
import { API_URL } from './config';

export async function getUserNotifications(userId) {
  const res = await axios.get(`${API_URL}/admin/notifications/${userId}`, {
    withCredentials: true
  });
  // Sécurisation : retourne un tableau vide si la réponse n'est pas un tableau
  const data = res.data;
  return Array.isArray(data) ? data : [];
}

export async function deleteNotification(id) {
  await axios.delete(`${API_URL}/admin/notifications/${id}`, {
    withCredentials: true
  });
}

export async function markNotificationAsRead(id) {
  await axios.patch(`${API_URL}/admin/notifications/${id}/read`, {}, {
    withCredentials: true
  });
}

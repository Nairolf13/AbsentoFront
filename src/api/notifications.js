import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function getUserNotifications(userId, token) {
  const res = await axios.get(`${API_URL}/admin/notifications/${userId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
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

import { API_URL } from './config';

export async function updateUser(id, userData) {
  const res = await fetch(`${API_URL}/utilisateur/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(userData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Erreur lors de la modification du profil');
  return data;
}

export async function deleteUser(id) {
  const res = await fetch(`${API_URL}/utilisateur/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Erreur lors de la suppression du compte');
  return data;
}

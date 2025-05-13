import { API_URL } from './config';
import axios from 'axios';

export async function updateUser(id, userData) {
  try {
    if (userData.dateNaissance && userData.dateNaissance.includes('T')) {
      userData.dateNaissance = userData.dateNaissance.split('T')[0];
    }
    
    const res = await axios.put(`${API_URL}/utilisateur/${id}`, userData);
    return res.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    throw new Error(error.response?.data?.error || 'Erreur lors de la modification du profil');
  }
}

export async function deleteUser(id) {
  try {
    const res = await axios.delete(`${API_URL}/utilisateur/${id}`);
    return res.data;
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
    throw new Error(error.response?.data?.error || 'Erreur lors de la suppression du compte');
  }
}

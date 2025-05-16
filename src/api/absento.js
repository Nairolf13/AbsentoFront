import axios from 'axios';
import { API_URL, setAuthToken } from './config';

export const login = async (email, password) => {
  const resp = await axios.post(`${API_URL}/auth/login`, {
    email: email.trim(),
    password: password.trim()
  });
  
  if (resp.data && resp.data.token) {
    setAuthToken(resp.data.token);
  }
  
  return resp.data;
};

export const logout = async () => {
  try {
    await axios.post(`/auth/logout`, {});
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
  } finally {
    setAuthToken(null);
  }
};

export const register = async (user) => {
  const { data } = await axios.post(`/auth/register`, user);
  return data;
};

export const registerEntreprise = async (entreprise) => {
  const { data } = await axios.post(`/auth/register-entreprise`, entreprise);
  return data;
};

export const requestAbsence = async (absence) => {
  const formData = new FormData();
  formData.append('dateDebut', absence.dateDebut);
  formData.append('dateFin', absence.dateFin);
  formData.append('type', absence.type);
  if (absence.motif) formData.append('motif', absence.motif);
  if (absence.justificatif) formData.append('justificatif', absence.justificatif);
  formData.append('heureDebut', absence.heureDebut || "");
  formData.append('heureFin', absence.heureFin || "");
  const { data } = await axios.post(`${API_URL}/absences/declarer`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const getReplacements = async () => {
  const { data } = await axios.get(`/absences/suggestions`);
  return data;
};

export const getNotifications = async () => {
  const { data } = await axios.get(`/notifications`);
  return data;
};

export const assignReplacement = async (remplacementId) => {
  const { data } = await axios.patch(`/absences/remplacement/${remplacementId}/valider`, {});
  return data;
};

export const refuseReplacement = async (remplacementId) => {
  const { data } = await axios.delete(`/absences/remplacement/${remplacementId}/refuser`);
  return data;
};

export const getMyRemplacements = async () => {
  const { data } = await axios.get(`/absences/mes-remplacements`);
  return data;
};

export const getMyAbsences = async () => {
  const { data } = await axios.get(`/absences/mes-absences`);
  return data;
};

export const validateAbsence = async (absenceId) => {
  const { data } = await axios.patch(`/absences/valider/${absenceId}`, {});
  return data;
};

export const refuseAbsence = async (absenceId) => {
  const { data } = await axios.patch(`/absences/refuser/${absenceId}`, {});
  return data;
};

export const deleteAbsence = async (absenceId) => {
  const { data } = await axios.delete(`/absences/${absenceId}`);
  return data;
};

export const getAbsencesSansRemplacant = async () => {
  const { data } = await axios.get(`/absences/sans-remplacant`);
  return data;
};

export const getAllAbsences = async () => {
  const { data } = await axios.get(`/absences/toutes`);
  return data;
};

export const getUserProfile = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/utilisateur/me`);
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error);
    throw error;
  }
};

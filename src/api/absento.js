import axios from 'axios';
import { API_URL } from './config';

export const login = async (email, password) => {
  const resp = await axios.post(`${API_URL}/auth/login`, {
    email: email.trim(),
    password: password.trim()
  }, {
    withCredentials: true
  });
  return resp.data;
};

export const logout = async () => {
  await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
};

export const register = async (user) => {
  const { data } = await axios.post(`${API_URL}/auth/register`, user, { withCredentials: true });
  return data;
};

export const registerEntreprise = async (entreprise) => {
  const { data } = await axios.post(`${API_URL}/auth/register-entreprise`, entreprise, { withCredentials: true });
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
    withCredentials: true,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const getReplacements = async () => {
  const { data } = await axios.get(`${API_URL}/absences/suggestions`, {
    withCredentials: true
  });
  return data;
};

export const getNotifications = async () => {
  const { data } = await axios.get(`${API_URL}/notifications`, {
    withCredentials: true
  });
  return data;
};

export const assignReplacement = async (remplacementId) => {
  const { data } = await axios.patch(`${API_URL}/absences/remplacement/${remplacementId}/valider`, {}, {
    withCredentials: true
  });
  return data;
};

export const refuseReplacement = async (remplacementId) => {
  const { data } = await axios.delete(`${API_URL}/absences/remplacement/${remplacementId}/refuser`, {
    withCredentials: true
  });
  return data;
};

export const getMyRemplacements = async () => {
  const { data } = await axios.get(`${API_URL}/absences/mes-remplacements`, {
    withCredentials: true
  });
  return data;
};

export const getMyAbsences = async () => {
  const { data } = await axios.get(`${API_URL}/absences/mes-absences`, {
    withCredentials: true
  });
  return data;
};

export const validateAbsence = async (absenceId) => {
  const { data } = await axios.patch(`${API_URL}/absences/valider/${absenceId}`, {}, {
    withCredentials: true
  });
  return data;
};

export const refuseAbsence = async (absenceId) => {
  const { data } = await axios.patch(`${API_URL}/absences/refuser/${absenceId}`, {}, {
    withCredentials: true
  });
  return data;
};

export const deleteAbsence = async (absenceId) => {
  const { data } = await axios.delete(`${API_URL}/absences/${absenceId}`, {
    withCredentials: true
  });
  return data;
};

export const getAbsencesSansRemplacant = async (token) => {
  const { data } = await axios.get(`${API_URL}/absences/sans-remplacant`, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true
  });
  return data;
};

export const getAllAbsences = async () => {
  const { data } = await axios.get(`${API_URL}/absences/toutes`, {
    withCredentials: true
  });
  return data;
};

export const getUserProfile = async () => {
  const { data } = await axios.get(`${API_URL}/utilisateur/me`, {
    withCredentials: true
  });
  return data;
};

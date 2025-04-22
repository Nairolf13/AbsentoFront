import axios from 'axios';
import { API_URL } from './config';

// Sécurisation : trim email et password pour éviter les espaces involontaires
export const login = async (email, password) => {
  const { data } = await axios.post(`${API_URL}/auth/login`, {
    email: email.trim(),
    password: password.trim()
  });
  return data;
};

export const register = async (user) => {
  const { data } = await axios.post(`${API_URL}/auth/register`, user);
  return data;
};

export const registerEntreprise = async (entreprise) => {
  const { data } = await axios.post(`${API_URL}/auth/register-entreprise`, entreprise);
  return data;
};

export const requestAbsence = async (absence, token) => {
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
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const getReplacements = async (token) => {
  const { data } = await axios.get(`${API_URL}/absences/suggestions`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const getNotifications = async (token) => {
  const { data } = await axios.get(`${API_URL}/notifications`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const assignReplacement = async (remplacementId, token) => {
  const { data } = await axios.patch(`${API_URL}/absences/remplacement/${remplacementId}/valider`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const refuseReplacement = async (remplacementId, token) => {
  const { data } = await axios.patch(`${API_URL}/absences/remplacement/${remplacementId}/refuser`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const getMyRemplacements = async (token) => {
  const { data } = await axios.get(`${API_URL}/absences/mes-remplacements`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const getMyAbsences = async (token) => {
  const { data } = await axios.get(`${API_URL}/absences/mes-absences`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const validateAbsence = async (absenceId, token) => {
  const { data } = await axios.patch(`${API_URL}/absences/${absenceId}/valider`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const refuseAbsence = async (absenceId, token) => {
  const { data } = await axios.patch(`${API_URL}/absences/${absenceId}/refuser`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const getAbsencesSansRemplacant = async (token) => {
  const { data } = await axios.get(`${API_URL}/absences/sans-remplacant`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const getAllAbsences = async (token) => {
  const { data } = await axios.get(`${API_URL}/absences`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

// Ajoute une fonction pour récupérer le profil utilisateur complet
export const getUserProfile = async (userId, token) => {
  const { data } = await axios.get(`${API_URL}/utilisateur/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

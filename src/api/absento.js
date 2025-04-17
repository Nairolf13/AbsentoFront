import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const login = async (email, password) => {
  const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });
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
  const { data } = await axios.post(`${API_URL}/absences/declarer`, absence, {
    headers: { Authorization: `Bearer ${token}` },
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
  const { data } = await axios.patch(`${API_URL}/absences/valider/${absenceId}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const refuseAbsence = async (absenceId, token) => {
  const { data } = await axios.patch(`${API_URL}/absences/refuser/${absenceId}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

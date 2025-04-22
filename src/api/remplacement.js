import axios from 'axios';
import { API_URL } from './config';

export async function getRemplacantsPossibles(poste, absentId) {
  const res = await axios.get(`${API_URL}/remplacements/candidats`, {
    params: { poste, absentId },
    withCredentials: true
  });
  return res.data;
}

export async function proposerRemplacant(absenceId, remplacantId) {
  const res = await axios.post(`${API_URL}/remplacements/valider`, {
    absenceId, remplacantId
  }, {
    withCredentials: true
  });
  return res.data;
}

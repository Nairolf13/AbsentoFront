import axios from 'axios';
import { API_URL } from './config';

export async function getRemplacantsPossibles(poste, absentId, token) {
  const res = await axios.get(`${API_URL}/remplacement/candidats`, {
    params: { poste, absentId },
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export async function proposerRemplacant(absenceId, remplaçantId, token) {
  const res = await axios.post(`${API_URL}/remplacement/valider`, {
    absenceId, remplaçantId
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

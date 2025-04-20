import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export async function fetchEmployeePlanning(employeeId, from, to, token) {
  const res = await axios.get(`${API_URL}/planning/${employeeId}`, {
    params: { from, to },
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function setEmployeePlanning(slots, token) {
  // slots: [{ employeeId, date, label }]
  // Correction : envoyer un tableau brut (pas d'objet { slots })
  const res = await axios.post(`${API_URL}/planning`, slots, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function deleteEmployeePlanning(employeeId, dates, token) {
  // dates: [ISODateString]
  const res = await axios.delete(`${API_URL}/planning`, {
    data: { employeeId, dates },
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

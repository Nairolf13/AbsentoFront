import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export async function fetchEmployeePlanning(employeeId, from, to) {
  const res = await axios.get(`${API_URL}/planning/${employeeId}`, {
    params: { from, to },
    withCredentials: true
  });
  return res.data;
}

export async function setEmployeePlanning(slots) {
  const res = await axios.post(`${API_URL}/planning`, slots, {
    withCredentials: true
  });
  return res.data;
}

export async function deleteEmployeePlanning(employeeId, dates) {
  const res = await axios.delete(`${API_URL}/planning`, {
    data: { employeeId, dates },
    withCredentials: true
  });
  return res.data;
}

import axios from 'axios';
import { API_URL } from './config';

export async function fetchEmployeePlanning(employeeId, from, to) {
  const res = await axios.get(`${API_URL}/planning/${employeeId}`, {
    params: { from, to }
  });
  return res.data;
}

export async function setEmployeePlanning(slots) {
  const res = await axios.post(`${API_URL}/planning`, slots);
  return res.data;
}

export async function deleteEmployeePlanning(employeeId, dates) {
  const res = await axios.delete(`${API_URL}/planning`, {
    data: { employeeId, dates }
  });
  return res.data;
}

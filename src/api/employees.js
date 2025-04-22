import { API_URL } from './config';

export async function fetchEmployees(token) {
  const res = await axios.get(`${API_URL}/employes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

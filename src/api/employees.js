import { API_URL } from './config';

export async function fetchEmployees() {
  const res = await fetch(`${API_URL}/utilisateur/entreprise/employes`, {
    credentials: 'include'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Erreur lors de la récupération des employés');
  return Array.isArray(data) ? data : [];
}

export async function addEmployee(employeeData) {
  const res = await fetch(`${API_URL}/utilisateur/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(employeeData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Erreur lors de l\'ajout de l\'employé');
  return data;
}

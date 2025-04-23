import { API_URL } from './config';

// API pour récupérer les employés de l'entreprise connectée
export async function fetchEmployees() {
  const res = await fetch(`${API_URL}/utilisateur/entreprise/employes`, {
    credentials: 'include'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Erreur lors de la récupération des employés');
  // Sécurisation : retourne un tableau vide si la réponse n'est pas un tableau
  return Array.isArray(data) ? data : [];
}

// API pour ajouter un employé
export async function addEmployee(employeeData) {
  const res = await fetch(`${API_URL}/utilisateur/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include', // Important pour envoyer le cookie JWT
    body: JSON.stringify(employeeData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Erreur lors de l\'ajout de l\'employé');
  return data;
}

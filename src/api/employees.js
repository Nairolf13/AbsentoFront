import { API_URL } from './config';

// API pour récupérer les employés de l'entreprise connectée
export async function fetchEmployees(token) {
  const res = await fetch(`${API_URL}/utilisateur/entreprise/employes`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await res.json();
  console.log('Réponse employés:', data); // DEBUG
  if (!res.ok) throw new Error('Erreur lors de la récupération des employés');
  // Sécurisation : retourne un tableau vide si la réponse n'est pas un tableau
  return Array.isArray(data) ? data : [];
}

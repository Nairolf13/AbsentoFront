// API pour récupérer les employés de l'entreprise connectée
export async function fetchEmployees(token) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/utilisateur/entreprise/employes`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Erreur lors de la récupération des employés');
  return res.json();
}

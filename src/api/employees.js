import { API_URL } from './config';
import axios from 'axios';

export async function fetchEmployees() {
  try {
    const res = await axios.get(`${API_URL}/utilisateur/entreprise/employes`);
    return Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    console.error("Erreur lors de la récupération des employés:", error);
    throw new Error(error.response?.data?.error || 'Erreur lors de la récupération des employés');
  }
}

export async function addEmployee(employeeData) {
  try {
    const res = await axios.post(`${API_URL}/utilisateur/create`, employeeData);
    return res.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'employé:", error);
    throw new Error(error.response?.data?.error || 'Erreur lors de l\'ajout de l\'employé');
  }
}

import { useState, useEffect } from "react";
import { fetchEmployees as fetchEmployeesApi } from '../../../../api/employees';


export const useEmployeeList = (user) => {
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [errorEmployees, setErrorEmployees] = useState("");
  const [searchTerm, setSearchTerm] = useState("");


  const fetchEmployees = async () => {
    setLoadingEmployees(true);
    setErrorEmployees("");
    try {
      const data = await fetchEmployeesApi();
      setEmployees(data);
    } catch (e) {
      setErrorEmployees("Erreur lors de la récupération des employés.");
    } finally {
      setLoadingEmployees(false);
    }
  };

  useEffect(() => {
    if (user) fetchEmployees();
  }, [user]);


  const getFilteredEmployees = () => {
    const filtered = employees.filter(emp => {
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase().trim();
      return (
        (emp.nom && emp.nom.toLowerCase().includes(term)) ||
        (emp.prenom && emp.prenom.toLowerCase().includes(term)) ||
        (emp.email && emp.email.toLowerCase().includes(term)) ||
        (emp.telephone && emp.telephone.toLowerCase().includes(term)) ||
        (emp.poste && emp.poste.toLowerCase().includes(term)) ||
        (emp.adresse && emp.adresse.toLowerCase().includes(term))
      );
    });

    return filtered.sort((a, b) => {
      const nomA = (a.nom || '').toLowerCase();
      const nomB = (b.nom || '').toLowerCase();
      if (nomA < nomB) return -1;
      if (nomA > nomB) return 1;
      const prenomA = (a.prenom || '').toLowerCase();
      const prenomB = (b.prenom || '').toLowerCase();
      if (prenomA < prenomB) return -1;
      if (prenomA > prenomB) return 1;
      return 0;
    });
  };

  return {
    employees,
    setEmployees,
    loadingEmployees,
    errorEmployees,
    searchTerm,
    setSearchTerm,
    filteredEmployees: getFilteredEmployees(),
    fetchEmployees
  };
};

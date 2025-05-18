import { useState } from "react";

export const useEmployeeEdit = (fetchEmployees) => {
  const [editEmp, setEditEmp] = useState(null);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  const handleEdit = (emp) => {
    setEditEmp(emp);
    setEditError("");
    setEditSuccess("");
  };

  const updateEmployee = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError("");
    setEditSuccess("");
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/utilisateur/${editEmp.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(editEmp)
      });
      
      if (!res.ok) {
        const data = await res.json();
        setEditError(data.error || "Erreur lors de la modification");
      } else {
        setEditSuccess("Employé modifié avec succès");
        fetchEmployees();
        setTimeout(() => setEditEmp(null), 1000);
      }
    } catch (e) {
      setEditError("Erreur lors de la modification");
    } finally {
      setEditLoading(false);
    }
  };

  return {
    editEmp,
    setEditEmp,
    editError,
    editSuccess,
    editLoading,
    handleEdit,
    updateEmployee
  };
};

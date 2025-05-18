import { useState } from "react";

export const useEmployeeDelete = (setEmployees) => {
  const [modalDelete, setModalDelete] = useState({ open: false, emp: null });

  const handleDelete = (emp) => setModalDelete({ open: true, emp });

  const confirmDelete = async () => {
    if (!modalDelete.emp) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/utilisateur/${modalDelete.emp.id}`, {
        method: "DELETE",
        credentials: 'include', 
      });
      if (res.ok) {
        setEmployees((emps) => emps.filter((e) => e.id !== modalDelete.emp.id));
      }
    } catch (e) {
      alert("Erreur lors de la suppression");
    } finally {
      setModalDelete({ open: false, emp: null });
    }
  };

  return {
    modalDelete,
    setModalDelete,
    handleDelete,
    confirmDelete
  };
};

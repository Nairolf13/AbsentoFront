import { useState } from "react";
import axios from 'axios';
import { API_URL } from '../../../../api/config';

export const useEmployeeAdd = (fetchEmployees, setShowAddForm) => {
  const [singleForm, setSingleForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    dateNaissance: "",
    adresse: "",
    poste: "",
    role: "EMPLOYE"
  });
  const [singleError, setSingleError] = useState("");
  const [singleSuccess, setSingleSuccess] = useState("");
  const [singleLoading, setSingleLoading] = useState(false);

  const handleSingleChange = (e) => {
    setSingleForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    setSingleLoading(true);
    setSingleError("");
    setSingleSuccess("");
    
    const requiredFields = ["nom", "prenom", "email", "telephone", "dateNaissance", "adresse", "poste", "role"];
    const missing = requiredFields.filter(f => !singleForm[f]);
    
    if (missing.length > 0) {
      setSingleError("Champs manquants : " + missing.join(", "));
      setSingleLoading(false);
      return;
    }
    
    try {
      const normalizedForm = { ...singleForm, email: singleForm.email.trim().toLowerCase() };
      await axios.post(`${API_URL}/password/invite`, [normalizedForm]);
      setSingleSuccess("Employé ajouté et mail d'invitation envoyé");
      setSingleForm({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        dateNaissance: "",
        adresse: "",
        poste: "",
        role: "EMPLOYE"
      });
      fetchEmployees();
      setShowAddForm(false);
    } catch (e) {
      setSingleError(e.message || "Erreur lors de l'ajout de l'employé.");
    } finally {
      setSingleLoading(false);
    }
  };

  return {
    singleForm,
    singleError,
    singleSuccess,
    singleLoading,
    handleSingleChange,
    handleSingleSubmit
  };
};

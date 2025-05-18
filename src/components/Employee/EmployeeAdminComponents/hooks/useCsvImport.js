import { useState, useRef } from "react";
import Papa from "papaparse";
import axios from 'axios';
import { API_URL } from '../../../../api/config';

export const useCsvImport = (fetchEmployees) => {
  const [csvError, setCsvError] = useState("");
  const [csvSuccess, setCsvSuccess] = useState("");
  const [csvLoading, setCsvLoading] = useState(false);
  const [csvData, setCsvData] = useState(null);
  const [csvImportResult, setCsvImportResult] = useState(null);
  const csvInputRef = useRef(null);

  const processCsvFile = (file) => {
    setCsvLoading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const requiredFields = [
          "nom", "prenom", "email", "telephone", "dateNaissance", "adresse", "poste", "role"
        ];
        const missingFields = requiredFields.filter(f => !results.meta.fields.includes(f));
        if (missingFields.length > 0) {
          setCsvError("Colonnes manquantes dans le CSV : " + missingFields.join(", "));
          setCsvLoading(false);
          return;
        }
        setCsvData(results.data);
        setCsvSuccess("Fichier CSV chargé avec succès.");
        setCsvLoading(false);
      },
      error: () => {
        setCsvError("Erreur lors de la lecture du fichier CSV.");
        setCsvLoading(false);
      }
    });
  };

  const handleCsvDrop = (e) => {
    e.preventDefault();
    setCsvError(""); 
    setCsvSuccess("");
    const file = e.dataTransfer.files[0];
    if (!file || file.type !== "text/csv") {
      setCsvError("Veuillez glisser un fichier CSV valide.");
      return;
    }
    processCsvFile(file);
  };

  const handleFileInputChange = (e) => {
    setCsvError(""); 
    setCsvSuccess("");
    const file = e.target.files[0];
    if (!file || file.type !== "text/csv") {
      setCsvError("Veuillez choisir un fichier CSV valide.");
      return;
    }
    processCsvFile(file);
  };

  const handleCsvAdd = async () => {
    if (!csvData || csvData.length === 0) return;
    setCsvError(""); 
    setCsvSuccess(""); 
    setCsvLoading(true);
    setCsvImportResult(null); 
    const requiredFields = ["nom", "prenom", "email", "telephone", "dateNaissance", "adresse", "poste", "role"];
    const validRows = [];
    const invalidRows = [];
    
    csvData.forEach(row => {
      if (row.email) row.email = row.email.trim().toLowerCase();
      const hasAllFields = requiredFields.every(f => row[f]);
      const dateObj = new Date(row.dateNaissance);
      if (!hasAllFields || isNaN(dateObj.getTime())) {
        invalidRows.push(row.email || "(email manquant)");
      } else {
        validRows.push(row);
      }
    });
    
    if (validRows.length === 0) {
      setCsvError(`Aucun employé valide à importer. ${invalidRows.length} lignes invalides (champs manquants ou date incorrecte) : ${invalidRows.join(", ")}`);
      setCsvLoading(false);
      return;
    }
    
    try {
      const res = await axios.post(`${API_URL}/password/invite`, validRows);
      const data = res.data;
      setCsvImportResult(data); 
      
      let msg = "";
      if (data.created?.length) msg += `${data.created.length} employés importés : ${data.created.join(", ")}.\n`;
      if (data.ignored?.length) msg += `${data.ignored.length} déjà existants ignorés : ${data.ignored.join(", ")}.\n`;
      if (invalidRows.length) msg += `${invalidRows.length} lignes invalides ignorées (champs manquants ou date incorrecte) : ${invalidRows.join(", ")}.\n`;
      if (data.invalid?.length) msg += `${data.invalid.length} lignes invalides ignorées côté backend : ${data.invalid.join(", ")}.`;
      
      setCsvSuccess(msg.trim());
      setCsvData(null);
      fetchEmployees(); 
    } catch (e) {
      setCsvError("Erreur lors de l'import des employés.");
    } finally {
      setCsvLoading(false);
    }
  };

  return {
    csvError,
    csvSuccess,
    csvLoading,
    csvData,
    csvImportResult,
    csvInputRef,
    handleCsvDrop,
    handleCsvAdd,
    handleFileInputChange
  };
};
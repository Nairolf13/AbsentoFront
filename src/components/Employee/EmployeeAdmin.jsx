import React, { useState, useEffect, useRef } from "react";
import Papa from "papaparse";
import { useAuth } from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../ui/ConfirmModal";
import "../ui/animations.css";
import { fetchEmployees as fetchEmployeesApi } from '../../api/employees';

export default function EmployeeAdmin() {
  const { user } = useAuth();
  const [csvError, setCsvError] = useState("");
  const [csvSuccess, setCsvSuccess] = useState("");
  const [csvLoading, setCsvLoading] = useState(false);
  const [csvData, setCsvData] = useState(null);
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
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [errorEmployees, setErrorEmployees] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editEmp, setEditEmp] = useState(null);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [modalDelete, setModalDelete] = useState({ open: false, emp: null });

  const navigate = useNavigate();
  const csvInputRef = useRef(null);

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

  const handleCsvDrop = (e) => {
    e.preventDefault();
    setCsvError(""); setCsvSuccess("");
    const file = e.dataTransfer.files[0];
    if (!file || file.type !== "text/csv") {
      setCsvError("Veuillez glisser un fichier CSV valide.");
      return;
    }
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

  const handleCsvAdd = async () => {
    if (!csvData || csvData.length === 0) return;
    setCsvError(""); setCsvSuccess(""); setCsvLoading(true);
    const requiredFields = ["nom", "prenom", "email", "telephone", "dateNaissance", "adresse", "poste", "role"];
    const validRows = [];
    const invalidRows = [];
    csvData.forEach(row => {
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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/password/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validRows)
      });
      const data = await res.json();
      if (!res.ok) {
        setCsvError(data.message || "Erreur lors de l'import des employés.");
      } else {
        let msg = "";
        if (data.created?.length) msg += `${data.created.length} employés importés : ${data.created.join(", ")}.\n`;
        if (data.ignored?.length) msg += `${data.ignored.length} déjà existants ignorés : ${data.ignored.join(", ")}.\n`;
        if (invalidRows.length) msg += `${invalidRows.length} lignes invalides ignorées (champs manquants ou date incorrecte) : ${invalidRows.join(", ")}.\n`;
        if (data.invalid?.length) msg += `${data.invalid.length} lignes invalides ignorées côté backend : ${data.invalid.join(", ")}.`;
        setCsvSuccess(msg.trim());
        setCsvData(null);
      }
    } catch (e) {
      setCsvError("Erreur lors de l'import des employés.");
    } finally {
      setCsvLoading(false);
    }
  };

  const handleSingleChange = (e) => {
    setSingleForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };
  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    setSingleError(""); setSingleSuccess("");
    setSingleLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/password/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([singleForm])
      });
      const data = await res.json();
      if (!res.ok) {
        setSingleError(data.message || "Erreur lors de l'ajout");
      } else {
        setSingleSuccess("Employé ajouté et mail d'invitation envoyé");
        setSingleForm({ nom: "", prenom: "", email: "", telephone: "", dateNaissance: "", adresse: "", poste: "", role: "EMPLOYE" });
        setShowAddForm(false); 
        await fetchEmployees(); 
      }
    } catch {
      setSingleError("Erreur lors de l'ajout");
    } finally {
      setSingleLoading(false);
    }
  };

  const handleEdit = (emp) => {
    setEditEmp(emp);
    setEditError("");
    setEditSuccess("");
  };

  const handleDelete = (emp) => setModalDelete({ open: true, emp });
  const confirmDelete = async () => {
    if (!modalDelete.emp) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/utilisateur/${modalDelete.emp.id}`, {
        method: "DELETE",
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

  const getExistingEmails = () => {
    return new Set(employees.map(e => e.email.toLowerCase()));
  };

  const sortedEmployees = [...employees].sort((a, b) => {
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-accent py-12">
      <div className="w-full  mx-auto relative">
        {/* Bouton Ajouter en haut à droite */}
        <div className="absolute top-0 right-12 mt-4 mr-4 z-20" style={{ right: '3px' }}>
          <button
            className="bg-primary text-white font-bold py-2 px-3 rounded-xl shadow hover:bg-primary/80 transition block md:hidden"
            onClick={() => setShowAddForm(f => !f)}
            aria-label={showAddForm ? 'Fermer le formulaire' : 'Ajouter un employé'}
          >
            {/* Icône croix ou + selon l'état */}
            {showAddForm ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            )}
          </button>
          <button
            className="bg-primary text-white font-bold py-2 px-6 rounded-xl shadow hover:bg-primary/80 transition hidden md:block"
            onClick={() => setShowAddForm(f => !f)}
          >
            {showAddForm ? 'Fermer le formulaire' : 'Ajouter un employé'}
          </button>
        </div>
        {/* Liste des employés, prend toute la largeur */}
        <div className={`bg-white rounded-2xl shadow-lg px-10 py-8 border border-gray-200 transition-all duration-300 w-full max-w-[98vw] overflow-x-auto ${showAddForm ? 'opacity-40 pointer-events-none select-none' : ''}`}>
          <h2 className="text-2xl font-bold mb-6 text-primary text-center">Liste des employés</h2>
          {loadingEmployees ? (
            <div>Chargement…</div>
          ) : errorEmployees ? (
            <div className="text-red-500 text-center">{errorEmployees}</div>
          ) : sortedEmployees.length === 0 ? (
            <div>Il n'y a pas d'employés à afficher.</div>
          ) : (
            <table className="w-full bg-white border border-gray-200 rounded-xl text-sm">
              <thead>
                <tr>
                  <th className="py-2 px-3 border-b">Nom</th>
                  <th className="py-2 px-3 border-b">Prénom</th>
                  <th className="py-2 px-3 border-b">Email</th>
                  <th className="py-2 px-3 border-b">Téléphone</th>
                  <th className="py-2 px-3 border-b">Poste</th>
                  <th className="py-2 px-3 border-b">Rôle</th>
                  <th className="py-2 px-3 border-b">Entreprise</th>
                  <th className="py-2 px-3 border-b">Adresse</th>
                  <th className="py-2 px-3 border-b">Date de naissance</th>
                  <th className="py-2 px-3 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedEmployees.map(emp => (
                  <tr key={emp.id} className="text-center">
                    <td className="py-2 px-3 border-b whitespace-nowrap">{emp.nom}</td>
                    <td className="py-2 px-3 border-b whitespace-nowrap">{emp.prenom}</td>
                    <td className="py-2 px-3 border-b whitespace-nowrap">{emp.email}</td>
                    <td className="py-2 px-3 border-b whitespace-nowrap">{emp.telephone}</td>
                    <td className="py-2 px-3 border-b whitespace-nowrap">{emp.poste}</td>
                    <td className="py-2 px-3 border-b whitespace-nowrap">{emp.role}</td>
                    <td className="py-2 px-3 border-b whitespace-nowrap">{emp.entreprise?.nom}</td>
                    <td className="py-2 px-3 border-b whitespace-nowrap">{emp.adresse}</td>
                    <td className="py-2 px-3 border-b whitespace-nowrap">{emp.dateNaissance ? (typeof emp.dateNaissance === 'string' ? emp.dateNaissance.split('T')[0] : new Date(emp.dateNaissance).toISOString().split('T')[0]) : ''}</td>
                    <td className="py-2 px-3 border-b">
                      <div className="flex flex-row justify-center gap-2">
                        <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-3 py-1 rounded" onClick={() => handleEdit(emp)}>Modifier</button>
                        <button className="bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-1 rounded" onClick={() => handleDelete(emp)}>Supprimer</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {/* Overlay du formulaire d'ajout (manuel + CSV) */}
        {showAddForm && (
          <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-2xl px-8 py-10 w-full max-w-2xl mx-auto relative animate-fade-in">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold"
                onClick={() => setShowAddForm(false)}
                aria-label="Fermer"
              >×</button>
              {/* Section Import CSV */}
              <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 gap-2">
                  <h3 className="font-semibold text-lg text-center">Importer via CSV</h3>
                  {/* Mobile: bouton icône download */}
                  <a
                    href="/modele_employes.csv"
                    download
                    className="block md:hidden bg-primary text-white rounded-full p-2 shadow hover:bg-primary/80 transition mx-auto"
                    aria-label="Télécharger un modèle CSV"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 4v12" />
                    </svg>
                  </a>
                  {/* Desktop: lien texte */}
                  <a
                    href="/modele_employes.csv"
                    download
                    className="hidden md:inline text-xs text-primary underline hover:text-primary/70 text-center md:text-right"
                  >
                    Télécharger un modèle CSV
                  </a>
                </div>
                {/* Bouton choisir un fichier pour mobile et input file caché */}
                <div className="flex flex-col items-center mt-2 mb-2">
                  <input
                    ref={csvInputRef}
                    type="file"
                    accept=".csv,text/csv"
                    style={{ display: 'none' }}
                    onChange={e => {
                      setCsvError(""); setCsvSuccess("");
                      const file = e.target.files[0];
                      if (!file || file.type !== "text/csv") {
                        setCsvError("Veuillez choisir un fichier CSV valide.");
                        return;
                      }
                      setCsvLoading(true);
                      Papa.parse(file, {
                        header: true,
                        complete: results => {
                          if (!results.data || results.errors.length) {
                            setCsvError("Erreur lors de la lecture du fichier CSV.");
                            setCsvLoading(false);
                          } else {
                            setCsvData(results.data);
                            setCsvSuccess("Fichier CSV chargé avec succès.");
                            setCsvLoading(false);
                          }
                        },
                        error: () => {
                          setCsvError("Erreur lors de la lecture du fichier CSV.");
                          setCsvLoading(false);
                        }
                      });
                    }}
                  />
                  <button
                    type="button"
                    className="mt-2 mb-2 px-4 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary/80 transition md:hidden"
                    onClick={() => csvInputRef.current && csvInputRef.current.click()}
                  >
                    Choisir un fichier CSV
                  </button>
                </div>
                <div
                  className="border-2 border-dashed border-primary rounded-xl p-8 text-center cursor-pointer bg-accent/30 hover:bg-accent/60 transition"
                  onDrop={handleCsvDrop}
                  onDragOver={e => e.preventDefault()}
                >
                  Glissez-déposez un fichier CSV ici
                  <div className="text-xs text-secondary mt-2">
                    Colonnes attendues : nom, prenom, email, telephone, dateNaissance (YYYY-MM-DD), adresse, poste, role (EMPLOYE ou ADMIN)
                  </div>
                </div>
              </div>
              {/* Section Ajout Manuel */}
              <div className="w-full">
                <h3 className="font-semibold text-lg mb-2 text-center">Ajouter un employé manuellement</h3>
                <form onSubmit={handleSingleSubmit} className="space-y-4 w-full flex flex-col items-center">
                  <div className="w-full flex gap-4">
                    <input type="text" name="nom" placeholder="Nom" className="block w-full rounded-xl border border-primary px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700" value={singleForm.nom} onChange={handleSingleChange} required />
                    <input type="text" name="prenom" placeholder="Prénom" className="block w-full rounded-xl border border-primary px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700" value={singleForm.prenom} onChange={handleSingleChange} required />
                  </div>
                  <input type="email" name="email" placeholder="Email" className="block w-full rounded-xl border border-primary px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700" value={singleForm.email} onChange={handleSingleChange} required />
                  <input type="tel" name="telephone" placeholder="Téléphone" className="block w-full rounded-xl border border-primary px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700" value={singleForm.telephone} onChange={handleSingleChange} required />
                  {/* Date de naissance moderne avec label flottant et icône */}
                  <div className="relative w-full mb-2">
                    {/* Icône calendrier, affichée à droite sur mobile et desktop, masquée sur desktop si déjà présente via input[type=date] */}
                    <span
                      className="absolute right-2 md:right-2 md:left-auto md:hidden"
                      style={{ top: '50%', transform: 'translateY(-50%)', zIndex: 100 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <input
                      type="date"
                      name="dateNaissance"
                      id="dateNaissance"
                      className={`block w-screen max-w-none rounded-xl border border-primary pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700 bg-white shadow-sm hover:border-secondary transition peer ${singleForm.dateNaissance ? 'not-empty' : ''} md:w-full md:mx-0 md:pr-10`}
                      style={{ marginLeft: '0px', width: 'calc(100vw - 65px)', paddingLeft: '1rem', maxWidth: '100%' }}
                      value={singleForm.dateNaissance}
                      onChange={handleSingleChange}
                      required
                      min="1950-01-01"
                      max={new Date().toISOString().split('T')[0]}
                    />
                    <label
                      htmlFor="dateNaissance"
                      className="absolute top-1/2 -translate-y-1/2 bg-white px-1 text-gray-500 text-sm pointer-events-none transition-all duration-200 peer-focus:-top-3 peer-focus:text-xs peer-focus:text-primary peer-[.not-empty]:-top-3 peer-[.not-empty]:text-xs peer-[.not-empty]:text-primary md:left-4"
                      style={{
                        left: '0.75rem',
                        top: singleForm.dateNaissance ? '-0.75rem' : '50%',
                        fontSize: singleForm.dateNaissance ? '0.75rem' : '1rem',
                        color: singleForm.dateNaissance ? '#2563eb' : '#6b7280',
                        background: 'white',
                        padding: '0 0.25rem',
                        display: singleForm.dateNaissance ? 'none' : 'block',
                      }}
                    >
                      Date de naissance
                    </label>
                  </div>
                  <input type="text" name="adresse" placeholder="Adresse" className="block w-full rounded-xl border border-primary px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700" value={singleForm.adresse} onChange={handleSingleChange} required />
                  <input type="text" name="poste" placeholder="Poste" className="block w-full rounded-xl border border-primary px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700" value={singleForm.poste} onChange={handleSingleChange} required />
                  <select name="role" className="block w-full rounded-xl border border-primary px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700" value={singleForm.role} onChange={handleSingleChange} required>
                    <option value="EMPLOYE">Employé</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                  <button className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/80 transition" type="submit" disabled={singleLoading}>Ajouter</button>
                  {singleError && <div className="text-xs text-red-500 text-center mt-2 w-full">{singleError}</div>}
                  {singleSuccess && <div className="text-xs text-green-600 text-center mt-2 w-full">{singleSuccess}</div>}
                </form>
              </div>
            </div>
          </div>
        )}
        {/* Overlay du formulaire d'ajout (manuel + CSV) */}
        {/* Fin du formulaire d'ajout employé */}
      </div>
    </div>
  );
}

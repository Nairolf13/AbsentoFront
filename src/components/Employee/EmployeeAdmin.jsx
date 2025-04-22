import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { useAuth } from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../ui/ConfirmModal";
import "../ui/animations.css";
import { fetchEmployees as fetchEmployeesApi } from '../../api/employees';

export default function EmployeeAdmin() {
  const { user, token } = useAuth();
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

  const fetchEmployees = async () => {
    setLoadingEmployees(true);
    setErrorEmployees("");
    try {
      const data = await fetchEmployeesApi(token);
      setEmployees(data);
    } catch (e) {
      setErrorEmployees("Erreur lors de la récupération des employés.");
    } finally {
      setLoadingEmployees(false);
    }
  };

  useEffect(() => {
    if (token) fetchEmployees();
  }, [token]);

  // CSV Upload Handler
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
    // Validation côté frontend
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
          "Authorization": `Bearer ${token}`
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

  // Single Employee Handler
  const handleSingleChange = (e) => {
    setSingleForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };
  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    setSingleError(""); setSingleSuccess("");
    setSingleLoading(true);
    try {
      // Appel réel au backend pour créer l'employé
      const res = await fetch(`${import.meta.env.VITE_API_URL}/password/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify([singleForm])
      });
      const data = await res.json();
      if (!res.ok) {
        setSingleError(data.message || "Erreur lors de l'ajout");
      } else {
        setSingleSuccess("Employé ajouté et mail d'invitation envoyé");
        setSingleForm({ nom: "", prenom: "", email: "", telephone: "", dateNaissance: "", adresse: "", poste: "", role: "EMPLOYE" });
        setShowAddForm(false); // Ferme le formulaire
        await fetchEmployees(); // Rafraîchit la liste automatiquement
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
        headers: { Authorization: `Bearer ${token}` },
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

  // --- Tri alphabétique ---
  const sortedEmployees = [...employees].sort((a, b) => {
    const nomA = (a.nom || '').toLowerCase();
    const nomB = (b.nom || '').toLowerCase();
    if (nomA < nomB) return -1;
    if (nomA > nomB) return 1;
    // Si même nom, trie par prénom
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
        <div className="absolute top-0 right-12 mt-4 mr-4 z-20">
          <button
            className="bg-primary text-white font-bold py-2 px-6 rounded-xl shadow hover:bg-primary/80 transition"
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
                  <a
                    href="/modele_employes.csv"
                    download
                    className="text-xs text-primary underline hover:text-primary/70 text-center md:text-right"
                  >
                    Télécharger un modèle CSV
                  </a>
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
                  <input type="date" name="dateNaissance" placeholder="Date de naissance" className="block w-full rounded-xl border border-primary px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700" value={singleForm.dateNaissance} onChange={handleSingleChange} required />
                  <input type="text" name="adresse" placeholder="Adresse" className="block w-full rounded-xl border border-primary px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700" value={singleForm.adresse} onChange={handleSingleChange} required />
                  <input type="text" name="poste" placeholder="Poste" className="block w-full rounded-xl border border-primary px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700" value={singleForm.poste} onChange={handleSingleChange} required />
                  <select name="role" className="block w-full rounded-xl border border-primary px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700" value={singleForm.role} onChange={handleSingleChange} required>
                    <option value="EMPLOYE">Employé</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                  <button className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/80 transition" type="submit" disabled={singleLoading}>Ajouter</button>
                  {singleError && <div className="text-xs text-red-500 text-center mt-2 w-full">{singleError}</div>}
                  {singleSuccess && <div className="text-xs text-green-600 text-center mt-2">{singleSuccess}</div>}
                </form>
              </div>
            </div>
          </div>
        )}
        {csvData && csvData.length > 0 && (() => {
          const existingEmails = getExistingEmails();
          // Trie : d'abord ceux qui peuvent être ajoutés (vert), ensuite ceux déjà existants (rouge)
          const sortedRows = [...csvData].sort((a, b) => {
            const aExists = existingEmails.has((a.email || '').toLowerCase());
            const bExists = existingEmails.has((b.email || '').toLowerCase());
            if (aExists === bExists) return 0;
            return aExists ? 1 : -1;
          });
          return (
            <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
              <div className="bg-white rounded-2xl shadow-2xl px-8 py-10 w-full max-w-3xl mx-auto relative animate-fade-in">
                <button className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold" onClick={() => setCsvData(null)} aria-label="Fermer">×</button>
                <h4 className="font-semibold text-lg mb-4 text-center">Employés détectés dans le CSV</h4>
                <div className="overflow-x-auto max-h-[50vh]">
                  <table className="w-full bg-white border border-gray-200 rounded-xl text-sm">
                    <thead>
                      <tr>
                        <th className="py-2 px-3 border-b">Nom</th>
                        <th className="py-2 px-3 border-b">Prénom</th>
                        <th className="py-2 px-3 border-b">Email</th>
                        <th className="py-2 px-3 border-b">Téléphone</th>
                        <th className="py-2 px-3 border-b">Adresse</th>
                        <th className="py-2 px-3 border-b">Date de naissance</th>
                        <th className="py-2 px-3 border-b">Poste</th>
                        <th className="py-2 px-3 border-b">Rôle</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedRows.map((row, idx) => {
                        const isExisting = existingEmails.has((row.email || '').toLowerCase());
                        return (
                          <tr key={idx} className={`text-center ${isExisting ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            <td className="py-2 px-3 border-b whitespace-nowrap">{row.nom}</td>
                            <td className="py-2 px-3 border-b whitespace-nowrap">{row.prenom}</td>
                            <td className="py-2 px-3 border-b whitespace-nowrap">{row.email}</td>
                            <td className="py-2 px-3 border-b whitespace-nowrap">{row.telephone}</td>
                            <td className="py-2 px-3 border-b whitespace-nowrap">{row.adresse}</td>
                            <td className="py-2 px-3 border-b whitespace-nowrap">{row.dateNaissance}</td>
                            <td className="py-2 px-3 border-b whitespace-nowrap">{row.poste}</td>
                            <td className="py-2 px-3 border-b whitespace-nowrap">{row.role}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 flex flex-col items-center">
                  <div className="flex gap-4 items-center mb-2">
                    <span className="inline-block w-4 h-4 rounded bg-green-200 border border-green-600 mr-1"></span>
                    <span className="text-green-700 text-sm">Peut être ajouté</span>
                    <span className="inline-block w-4 h-4 rounded bg-red-200 border border-red-600 ml-6 mr-1"></span>
                    <span className="text-red-700 text-sm">Déjà existant (ne sera pas ajouté)</span>
                  </div>
                </div>
                <button
                  className="mt-6 w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/80 transition"
                  onClick={handleCsvAdd}
                  disabled={csvLoading}
                >
                  Valider et ajouter {csvData.length} employé(s)
                </button>
                {csvLoading && <div className="text-primary mt-2 font-semibold animate-pulse">Envoi des emails de bienvenue aux employés en cours…</div>}
                {csvError && <div className="text-red-500 text-center mt-2">{csvError}</div>}
                {csvSuccess && <div className="text-green-600 text-center mt-2">{csvSuccess}</div>}
              </div>
            </div>
          );
        })()}
        {editEmp && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-2xl px-8 py-10 w-full max-w-xl mx-auto relative animate-fade-in">
              <button className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold" onClick={() => setEditEmp(null)} aria-label="Fermer">×</button>
              <h3 className="font-semibold text-lg mb-4 text-center">Modifier l'employé</h3>
              <form onSubmit={async (e) => {
                e.preventDefault();
                setEditError("");
                setEditLoading(true);
                try {
                  // Ne garder que les champs attendus par le backend
                  const { id, entreprise, createdAt, updatedAt, ...toSend } = editEmp;
                  // Correction format date
                  if (toSend.dateNaissance && typeof toSend.dateNaissance === "object") {
                    toSend.dateNaissance = toSend.dateNaissance.toISOString().split('T')[0];
                  }
                  console.log("[MODIF] id envoyé:", parseInt(editEmp.id));
                  console.log("[MODIF] body envoyé:", toSend);
                  console.log("[MODIF] Champs envoyés:", Object.keys(toSend));
                  const res = await fetch(`${import.meta.env.VITE_API_URL}/utilisateur/${parseInt(editEmp.id)}`, {
                    method: "PUT",
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(toSend)
                  });
                  if (!res.ok) throw new Error("Erreur lors de la modification");
                  const updated = await res.json();
                  setEmployees(employees.map(e => e.id === editEmp.id ? { ...e, ...toSend } : e));
                  setEditSuccess("Employé modifié");
                  setEditEmp(null);
                } catch {
                  setEditError("Erreur lors de la modification");
                } finally {
                  setEditLoading(false);
                }
              }} className="space-y-4">
                <input type="text" className="block w-full rounded-xl border px-4 py-3" value={editEmp.nom} onChange={e => setEditEmp({ ...editEmp, nom: e.target.value })} required />
                <input type="text" className="block w-full rounded-xl border px-4 py-3" value={editEmp.prenom} onChange={e => setEditEmp({ ...editEmp, prenom: e.target.value })} required />
                <input type="email" className="block w-full rounded-xl border px-4 py-3" value={editEmp.email} onChange={e => setEditEmp({ ...editEmp, email: e.target.value })} required />
                <input type="tel" className="block w-full rounded-xl border px-4 py-3" value={editEmp.telephone} onChange={e => setEditEmp({ ...editEmp, telephone: e.target.value })} required />
                <input type="text" className="block w-full rounded-xl border px-4 py-3" value={editEmp.adresse || ''} onChange={e => setEditEmp({ ...editEmp, adresse: e.target.value })} required placeholder="Adresse" />
                <input type="date" className="block w-full rounded-xl border px-4 py-3" value={editEmp.dateNaissance ? (typeof editEmp.dateNaissance === 'string' ? editEmp.dateNaissance.split('T')[0] : editEmp.dateNaissance.toISOString().split('T')[0]) : ''} onChange={e => setEditEmp({ ...editEmp, dateNaissance: e.target.value })} required placeholder="Date de naissance" />
                <input type="text" className="block w-full rounded-xl border px-4 py-3" value={editEmp.poste} onChange={e => setEditEmp({ ...editEmp, poste: e.target.value })} required />
                <select className="block w-full rounded-xl border px-4 py-3" value={editEmp.role} onChange={e => setEditEmp({ ...editEmp, role: e.target.value })} required>
                  <option value="EMPLOYE">Employé</option>
                  <option value="ADMIN">Admin</option>
                </select>
                <button className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/80 transition" type="submit" disabled={editLoading}>Enregistrer</button>
                {editError && <div className="text-xs text-red-500 text-center mt-2 w-full">{editError}</div>}
                {editSuccess && <div className="text-xs text-green-600 text-center mt-2 w-full">{editSuccess}</div>}
              </form>
            </div>
          </div>
        )}
        {/* Modal de confirmation suppression employé */}
        <ConfirmModal
          open={modalDelete.open}
          title="Supprimer l'employé ?"
          message={`Voulez-vous vraiment supprimer ${modalDelete.emp ? modalDelete.emp.nom + ' ' + modalDelete.emp.prenom : ''} ? Cette action est irréversible.`}
          onConfirm={confirmDelete}
          onCancel={() => setModalDelete({ open: false, emp: null })}
          confirmText="Supprimer"
          cancelText="Annuler"
        />
      </div>
    </div>
  );
}

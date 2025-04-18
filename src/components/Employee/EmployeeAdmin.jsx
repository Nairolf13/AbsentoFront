import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import useAuth from "../../hooks/useAuth";

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

  useEffect(() => {
    const fetchData = async () => {
      setLoadingEmployees(true);
      setErrorEmployees("");
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/utilisateur/entreprise/employes`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Erreur lors de la récupération des employés');
        const data = await res.json();
        setEmployees(data);
      } catch (e) {
        setErrorEmployees("Erreur lors de la récupération des employés.");
      } finally {
        setLoadingEmployees(false);
      }
    };
    if (token) fetchData();
  }, [token]);

  if (!user || user.role !== "ADMIN") {
    return <div className="text-center mt-16 text-red-500 font-bold">Accès réservé aux administrateurs.</div>;
  }

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
      // TODO: Envoyer singleForm au backend pour création d'un employé
      // Le backend doit : créer l'utilisateur SANS mot de passe et envoyer un mail d'invitation
      setSingleSuccess("Employé ajouté et mail d'invitation envoyé (simulation)");
      setSingleForm({ nom: "", prenom: "", email: "", telephone: "", dateNaissance: "", adresse: "", poste: "", role: "EMPLOYE" });
    } catch {
      setSingleError("Erreur lors de l'ajout");
    } finally {
      setSingleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-accent py-12">
      <div className="bg-white rounded-2xl shadow-lg px-8 py-10 w-full max-w-2xl mx-auto flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6 text-primary text-center">Gestion des employés</h2>
        {/* Section Import CSV */}
        <div className="w-full mb-8">
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
          {csvData && csvData.length > 0 && (
            <button
              className="mt-4 w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/80 transition"
              onClick={handleCsvAdd}
              disabled={csvLoading}
            >
              Ajouter {csvData.length} employé(s)
            </button>
          )}
          {csvLoading && <div className="text-primary mt-2">Chargement…</div>}
          {csvError && <div className="text-red-500 text-center mt-2">{csvError}</div>}
          {csvSuccess && <div className="text-green-600 text-center mt-2">{csvSuccess}</div>}
        </div>
        {/* Section Liste des employés */}
        <div className="w-full mb-8">
          <h3 className="font-semibold text-lg mb-2 text-center">Liste des employés</h3>
          {loadingEmployees ? (
            <div>Chargement…</div>
          ) : errorEmployees ? (
            <div className="text-red-500 text-center">{errorEmployees}</div>
          ) : employees.length === 0 ? (
            <div>Il n'y a pas d'employés à afficher.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-xl">
                <thead>
                  <tr>
                    <th className="py-2 px-3 border-b">Nom</th>
                    <th className="py-2 px-3 border-b">Prénom</th>
                    <th className="py-2 px-3 border-b">Email</th>
                    <th className="py-2 px-3 border-b">Téléphone</th>
                    <th className="py-2 px-3 border-b">Poste</th>
                    <th className="py-2 px-3 border-b">Rôle</th>
                    <th className="py-2 px-3 border-b">Entreprise</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map(emp => (
                    <tr key={emp.id} className="text-center">
                      <td className="py-2 px-3 border-b">{emp.nom}</td>
                      <td className="py-2 px-3 border-b">{emp.prenom}</td>
                      <td className="py-2 px-3 border-b">{emp.email}</td>
                      <td className="py-2 px-3 border-b">{emp.telephone}</td>
                      <td className="py-2 px-3 border-b">{emp.poste}</td>
                      <td className="py-2 px-3 border-b">{emp.role}</td>
                      <td className="py-2 px-3 border-b">{emp.entreprise?.nom}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {/* Section Ajout Manuel */}
        <div className="w-full">
          <h3 className="font-semibold text-lg mb-2 text-center">Ajouter un employé</h3>
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
            {singleSuccess && <div className="text-xs text-green-600 text-center mt-2 w-full">{singleSuccess}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}

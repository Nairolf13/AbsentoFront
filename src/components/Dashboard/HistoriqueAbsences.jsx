import React, { useEffect, useState } from "react";
import { getMyAbsences, getAllAbsences, validateAbsence, refuseAbsence } from "../../api/absento";
import { fetchEmployees } from "../../api/employees";
import { proposerRemplacant } from "../../api/remplacement";
import { useAuth } from "../../context/AuthProvider";

const statusColors = {
  "En attente": "bg-yellow-300 text-yellow-900",
  "Validée": "bg-green-400 text-white",
  "Refusée": "bg-red-400 text-white",
};

const remplacementStatusColors = {
  "Aucun": "bg-gray-300 text-gray-700",
  "En cours": "bg-yellow-300 text-yellow-900",
  "Validé": "bg-green-400 text-white",
};

function isImageUrl(url) {
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
}

function isPdfUrl(url) {
  return /\.pdf$/i.test(url);
}

export default function HistoriqueAbsences() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { user } = useAuth();
  const [absences, setAbsences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAbsence, setSelectedAbsence] = useState(null);
  const [remplacantId, setRemplacantId] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [justificatifPreview, setJustificatifPreview] = useState(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setError(null);
    const privilegedRoles = ["ADMIN", "RH", "MANAGER"];
    const fetchAbsences = privilegedRoles.includes(user?.role)
      ? getAllAbsences
      : getMyAbsences;
    fetchAbsences()
      .then(setAbsences)
      .catch((e) => setError(e?.response?.data?.error || e.message))
      .finally(() => setLoading(false));
  }, [user]);

  const handleValidate = async (id) => {
    try {
      const { absence } = await validateAbsence(id);
      setAbsences(absences => absences.map(a => a.id === id ? { ...a, status: absence.status } : a));
      window.dispatchEvent(new CustomEvent("refreshAbsenceCounter"));
    } catch (e) {
      alert("Erreur lors de la validation : " + (e?.response?.data?.error || e.message));
    }
  };

  const handleRefuse = async (id) => {
    try {
      const { absence } = await refuseAbsence(id);
      setAbsences(absences => absences.map(a => a.id === id ? { ...a, status: absence.status } : a));
      window.dispatchEvent(new CustomEvent("refreshAbsenceCounter"));
    } catch (e) {
      alert("Erreur lors du refus : " + (e?.response?.data?.error || e.message));
    }
  };

  const handleOpenModifier = async (absence) => {
    setSelectedAbsence(absence);
    setRemplacantId("");
    try {
      const emps = await fetchEmployees();
      setEmployees(emps);
    } catch (e) {
      setEmployees([]);
    }
  };

  const handleChangeRemplacant = async () => {
    if (!remplacantId) return;
    setActionLoading(true);
    try {
      const updated = await proposerRemplacant(selectedAbsence.id, remplacantId);
      setAbsences(absences => absences.map(a =>
        a.id === selectedAbsence.id
          ? { ...a, remplacement: { ...a.remplacement, remplacant: employees.find(e => e.id === Number(remplacantId)) } }
          : a
      ));
      setSelectedAbsence(null);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="text-center text-secondary py-8">Chargement…</div>;
  if (error) return <div className="text-center text-red-500 py-8">Erreur lors du chargement</div>;

  return (
    <div className="min-h-screen flex flex-col items-center bg-accent py-4 px-0 sm:px-4">
      <div className="w-full max-w-[1600px] mx-auto flex justify-center">
        <div className="bg-white rounded-2xl shadow-lg px-2 py-4 sm:px-6 sm:py-8 w-full max-w-[1500px] flex flex-col items-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-primary text-center">Historique des absences</h2>
          {absences.length === 0 ? (
            <div className="text-secondary text-center">Aucune absence soumise.</div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full bg-white border border-gray-200 rounded-xl text-xs sm:text-sm text-center">
                <thead>
                  <tr className="bg-accent text-secondary">
                    <th className="py-2 px-1 sm:px-3">Date</th>
                    <th className="py-2 px-1 sm:px-3">Début</th>
                    <th className="py-2 px-1 sm:px-3">Fin</th>
                    <th className="py-2 px-1 sm:px-3">Type</th>
                    <th className="py-2 px-1 sm:px-3">Motif</th>
                    <th className="py-2 px-1 sm:px-3">Statut</th>
                    <th className="py-2 px-1 sm:px-3">Remplaçant</th>
                    <th className="py-2 px-1 sm:px-3">Justificatif</th>
                    {(user?.role === "ADMIN" || user?.role === "RH" || user?.role === "MANAGER") && <th className="py-2 px-1 sm:px-3">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {absences.map((a) => (
                    <tr key={a.id} className="border-b last:border-b-0 hover:bg-accent/40 transition">
                      <td className="py-2 px-1 sm:px-3 whitespace-nowrap">{new Date(a.startDate).toLocaleDateString()}</td>
                      <td className="py-2 px-1 sm:px-3 whitespace-nowrap">{new Date(a.startDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
                      <td className="py-2 px-1 sm:px-3 whitespace-nowrap">{new Date(a.endDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
                      <td className="py-2 px-1 sm:px-3 whitespace-nowrap">{a.type}</td>
                      <td className="py-2 px-1 sm:px-3 whitespace-nowrap">{a.reason || "-"}</td>
                      <td className="py-2 px-1 sm:px-3 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-xl text-xs font-semibold ${statusColors[a.status] || "bg-gray-200 text-gray-700"}`}>{a.status}</span>
                      </td>
                      <td className="py-2 px-1 sm:px-3 whitespace-nowrap">
                        {a.remplacement?.remplacant ? `${a.remplacement.remplacant.prenom} ${a.remplacement.remplacant.nom}` : "-"}
                      </td>
                      <td className="py-2 px-1 sm:px-3 whitespace-nowrap">
                        {a.justificatifUrl ? (
                          <button
                            className="text-primary underline font-semibold"
                            onClick={() => setJustificatifPreview(a.justificatifUrl)}
                          >
                            Voir
                          </button>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      {(user?.role === "ADMIN" || user?.role === "RH" || user?.role === "MANAGER") && (
                        <td className="py-2 px-1 sm:px-3 whitespace-nowrap flex flex-col gap-2 sm:flex-row sm:gap-2 items-center justify-center">
                          <button className="bg-primary text-white rounded-xl px-2 sm:px-3 py-1 text-xs font-bold hover:bg-primary/80 transition w-full sm:w-auto" onClick={() => handleValidate(a.id)}>Valider</button>
                          <button className="bg-red-500 text-white rounded-xl px-2 sm:px-3 py-1 text-xs font-bold hover:bg-red-500/80 transition w-full sm:w-auto" onClick={() => handleRefuse(a.id)}>Refuser</button>
                          <button className="bg-blue-500 text-white rounded-xl px-2 sm:px-3 py-1 text-xs font-bold hover:bg-blue-500/80 transition w-full sm:w-auto" onClick={() => handleOpenModifier(a)}>Modifier</button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {selectedAbsence && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-2">
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 w-full max-w-lg mx-auto relative">
                <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => setSelectedAbsence(null)}>&times;</button>
                <h3 className="text-base sm:text-lg font-bold mb-2">Modifier le remplaçant pour l'absence du {new Date(selectedAbsence.startDate).toLocaleDateString()}</h3>
                <select value={remplacantId} onChange={e => setRemplacantId(e.target.value)} className="py-2 px-3 border border-gray-300 rounded-lg w-full mb-4">
                  <option value="">Sélectionner un remplaçant</option>
                  {employees.filter(emp => emp.poste === (selectedAbsence.remplacement?.remplace?.poste || selectedAbsence.employee?.poste || selectedAbsence.poste)).map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.prenom} {emp.nom}</option>
                  ))}
                </select>
                <button className="bg-primary text-white rounded-xl px-3 py-1 text-xs font-bold hover:bg-primary/80 transition mt-2 w-full" onClick={handleChangeRemplacant} disabled={actionLoading || !remplacantId}>Valider le changement</button>
                <button className="bg-gray-200 text-gray-700 rounded-xl px-3 py-1 text-xs font-bold hover:bg-gray-200/80 transition mt-2 w-full" onClick={() => setSelectedAbsence(null)}>Annuler</button>
              </div>
            </div>
          )}
          {justificatifPreview && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-2">
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 w-full max-w-lg mx-auto relative flex flex-col items-center">
                <button
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
                  onClick={() => setJustificatifPreview(null)}
                >
                  &times;
                </button>
                <h3 className="text-base sm:text-lg font-bold mb-2">Justificatif</h3>
                {isImageUrl(justificatifPreview) ? (
                  <img
                    src={justificatifPreview}
                    alt="Justificatif"
                    className="max-h-96 max-w-full mb-4 rounded"
                    onError={e => { e.target.onerror = null; e.target.style.display = 'none'; }}
                  />
                ) : isPdfUrl(justificatifPreview) ? (
                  <embed src={justificatifPreview} type="application/pdf" className="w-full h-96 mb-4" />
                ) : (
                  <div className="text-red-500 mb-4">Format de justificatif non supporté.<br/>URL : <span className="break-all">{justificatifPreview}</span></div>
                )}
                <a
                  href={justificatifPreview}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded hover:bg-primary/80 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" /></svg>
                  Télécharger
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

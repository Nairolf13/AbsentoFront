import React, { useEffect, useState } from "react";
import { getMyAbsences, getAllAbsences, validateAbsence, refuseAbsence } from "../../api/absento";
import { fetchEmployees } from "../../api/employees";
import { proposerRemplacant } from "../../api/remplacement";
import useAuth from "../../hooks/useAuth";

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

export default function HistoriqueAbsences() {
  const { token, user } = useAuth();
  const [absences, setAbsences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAbsence, setSelectedAbsence] = useState(null);
  const [remplacantId, setRemplacantId] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    const privilegedRoles = ["ADMIN", "RH", "MANAGER"];
    const fetchAbsences = privilegedRoles.includes(user?.role)
      ? getAllAbsences
      : getMyAbsences;
    fetchAbsences(token)
      .then(setAbsences)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [token, user]);

  const handleValidate = async (id) => {
    try {
      const { absence } = await validateAbsence(id, token);
      setAbsences(absences => absences.map(a => a.id === id ? { ...a, status: absence.status } : a));
    } catch (e) {
      alert("Erreur lors de la validation : " + (e?.response?.data?.error || e.message));
    }
  };

  const handleOpenModifier = async (absence) => {
    setSelectedAbsence(absence);
    setRemplacantId("");
    // Charge la liste des employés à l'ouverture de la modal
    try {
      const emps = await fetchEmployees(token);
      setEmployees(emps);
    } catch (e) {
      setEmployees([]);
    }
  };

  const handleChangeRemplacant = async () => {
    if (!remplacantId) return;
    setActionLoading(true);
    try {
      // Appel API pour modifier le remplaçant
      const updated = await proposerRemplacant(selectedAbsence.id, remplacantId, token);
      // Met à jour l'affichage localement
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-accent py-12">
      <div className="w-full max-w-[1600px] mx-auto flex justify-center">
        <div className="bg-white rounded-2xl shadow-lg px-10 py-10 w-full max-w-[1500px] flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-6 text-primary text-center">Historique des absences</h2>
          {absences.length === 0 ? (
            <div className="text-secondary text-center">Aucune absence soumise.</div>
          ) : (
            <table className="w-full bg-white border border-gray-200 rounded-xl text-sm text-center">
              <thead>
                <tr className="bg-accent text-secondary">
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3">Début</th>
                  <th className="py-2 px-3">Fin</th>
                  <th className="py-2 px-3">Type</th>
                  <th className="py-2 px-3">Motif</th>
                  <th className="py-2 px-3">Statut</th>
                  {/* <th className="py-2 px-3">Statut Remplacement</th> */}
                  <th className="py-2 px-3">Remplaçant</th>
                  <th className="py-2 px-3">Justificatif</th>
                  {(user?.role === "ADMIN" || user?.role === "RH" || user?.role === "MANAGER") && <th className="py-2 px-3">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {absences.map((a) => (
                  <tr key={a.id} className="border-b last:border-b-0">
                    <td className="py-2 px-3 whitespace-nowrap">{new Date(a.startDate).toLocaleDateString()}</td>
                    <td className="py-2 px-3 whitespace-nowrap">{new Date(a.startDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
                    <td className="py-2 px-3 whitespace-nowrap">{new Date(a.endDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
                    <td className="py-2 px-3 whitespace-nowrap">{a.type}</td>
                    <td className="py-2 px-3 whitespace-nowrap">{a.reason || "-"}</td>
                    <td className="py-2 px-3 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-xl text-xs font-semibold ${statusColors[a.status] || "bg-gray-200 text-gray-700"}`}>{a.status}</span>
                    </td>
                    {/* <td className="py-2 px-3 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-xl text-xs font-semibold ${remplacementStatusColors[a.remplacement?.status] || "bg-gray-200 text-gray-700"}`}>{a.remplacement?.status || "Aucun"}</span>
                    </td> */}
                    <td className="py-2 px-3 whitespace-nowrap">
                      {a.remplacement?.remplacant ? `${a.remplacement.remplacant.prenom} ${a.remplacement.remplacant.nom}` : "-"}
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap">
                      {a.justificatifUrl ? (
                        <a href={a.justificatifUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline font-semibold">Voir</a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    {(user?.role === "ADMIN" || user?.role === "RH" || user?.role === "MANAGER") && (
                      <td className="py-2 px-3 whitespace-nowrap">
                        <button className="bg-primary text-white rounded-xl px-3 py-1 text-xs font-bold hover:bg-primary/80 transition" onClick={() => handleValidate(a.id)}>Valider</button>
                        <button className="bg-blue-500 text-white rounded-xl px-3 py-1 text-xs font-bold hover:bg-blue-500/80 transition ml-2" onClick={() => handleOpenModifier(a)}>Modifier remplaçant</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {selectedAbsence && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg mx-auto relative">
                <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl" onClick={() => setSelectedAbsence(null)}>&times;</button>
                <h3 className="text-lg font-bold mb-2">Modifier le remplaçant pour l'absence du {new Date(selectedAbsence.startDate).toLocaleDateString()}</h3>
                <select value={remplacantId} onChange={e => setRemplacantId(e.target.value)} className="py-2 px-3 border border-gray-300 rounded-lg w-full mb-4">
                  <option value="">Sélectionner un remplaçant</option>
                  {/* Filtre avec le poste du remplaçé selon le schéma Prisma */}
                  {employees.filter(emp => emp.poste === (selectedAbsence.remplacement?.remplace?.poste || selectedAbsence.employee?.poste || selectedAbsence.poste)).map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.prenom} {emp.nom}</option>
                  ))}
                </select>
                <button className="bg-primary text-white rounded-xl px-3 py-1 text-xs font-bold hover:bg-primary/80 transition mt-2" onClick={handleChangeRemplacant} disabled={actionLoading || !remplacantId}>Valider le changement</button>
                <button className="bg-gray-200 text-gray-700 rounded-xl px-3 py-1 text-xs font-bold hover:bg-gray-200/80 transition mt-2 ml-2" onClick={() => setSelectedAbsence(null)}>Annuler</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { getMyAbsences, validateAbsence, refuseAbsence } from "../../api/absento";
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

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    getMyAbsences(token)
      .then(setAbsences)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [token]);

  const handleValidate = async (id) => {
    try {
      const { absence } = await validateAbsence(id, token);
      setAbsences(absences => absences.map(a => a.id === id ? { ...a, status: absence.status } : a));
    } catch (e) {
      alert("Erreur lors de la validation : " + (e?.response?.data?.error || e.message));
    }
  };

  const handleOpenModifier = (absence) => {
    setSelectedAbsence(absence);
    setRemplacantId("");
  };

  const handleChangeRemplacant = async () => {
    if (!remplacantId) return;
    setActionLoading(true);
    try {
      // TODO: appeler l'API pour modifier le remplaçant
      // await updateRemplacant(selectedAbsence.id, remplacantId, token);
      // Simule la mise à jour côté front :
      setAbsences(absences => absences.map(a => a.id === selectedAbsence.id ? { ...a, remplacementStatus: "En cours" } : a));
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
          <h2 className="text-2xl font-bold mb-6 text-primary text-center">Historique de mes absences</h2>
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
                  <th className="py-2 px-3">Remplacement</th>
                  {user?.role === "ADMIN" && <th className="py-2 px-3">Actions</th>}
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
                    <td className="py-2 px-3 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-xl text-xs font-semibold ${remplacementStatusColors[a.remplacementStatus] || "bg-gray-200 text-gray-700"}`}>{a.remplacementStatus || "Aucun"}</span>
                    </td>
                    {user?.role === "ADMIN" && (
                      <td className="py-2 px-3 whitespace-nowrap">
                        {a.status === "En attente" && (
                          <>
                            <button className="bg-primary text-white rounded-xl px-3 py-1 text-xs font-bold hover:bg-primary/80 transition" onClick={() => handleValidate(a.id)}>Valider</button>
                            <button className="bg-blue-500 text-white rounded-xl px-3 py-1 text-xs font-bold hover:bg-blue-500/80 transition ml-2" onClick={() => handleOpenModifier(a)}>Modifier remplaçant</button>
                          </>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {selectedAbsence && (
            <div className="mt-6 w-full max-w-lg mx-auto">
              <h3 className="text-lg font-bold mb-2">Modifier le remplaçant pour l'absence du {new Date(selectedAbsence.startDate).toLocaleDateString()}</h3>
              <input type="text" placeholder="ID du remplaçant" value={remplacantId} onChange={e => setRemplacantId(e.target.value)} className="py-2 px-3 border border-gray-300 rounded-lg w-full" />
              <button className="bg-primary text-white rounded-xl px-3 py-1 text-xs font-bold hover:bg-primary/80 transition mt-2" onClick={handleChangeRemplacant} disabled={actionLoading || !remplacantId}>Valider le changement</button>
              <button className="bg-gray-200 text-gray-700 rounded-xl px-3 py-1 text-xs font-bold hover:bg-gray-200/80 transition mt-2 ml-2" onClick={() => setSelectedAbsence(null)}>Annuler</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

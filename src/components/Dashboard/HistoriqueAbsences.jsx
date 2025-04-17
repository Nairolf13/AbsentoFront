import React, { useEffect, useState } from "react";
import { getMyAbsences, validateAbsence, refuseAbsence } from "../../api/absento";
import useAuth from "../../hooks/useAuth";

const statusColors = {
  "En attente": "#facc15",
  "Validée": "#22c55e",
  "Refusée": "#ef4444",
};

const remplacementStatusColors = {
  "Aucun": "#d1d5db",
  "En cours": "#facc15",
  "Validé": "#22c55e",
};

export default function HistoriqueAbsences() {
  const { token, user } = useAuth();
  const [absences, setAbsences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAbsence, setSelectedAbsence] = useState(null);
  const [remplacantId, setRemplacantId] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  // TODO: charger la liste des utilisateurs/remplaçants possibles
  // const [remplacants, setRemplacants] = useState([]);

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
    // TODO: charger les remplaçants possibles ici si besoin
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

  if (loading) return <div>Chargement…</div>;
  if (error) return <div>Erreur lors du chargement</div>;

  return (
    <div style={{ padding: 24 }}>
      <h2>Historique de mes absences</h2>
      {loading ? (
        <div>Chargement...</div>
      ) : absences.length === 0 ? (
        <div>Aucune absence soumise.</div>
      ) : (
        <table style={{ width: "100%", marginTop: 16, borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Début</th>
              <th>Fin</th>
              <th>Type</th>
              <th>Motif</th>
              <th>Status</th>
              <th>Remplacement</th>
              {user?.role === "ADMIN" && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {absences.map((a) => (
              <tr key={a.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td>{new Date(a.startDate).toLocaleDateString()}</td>
                <td>{new Date(a.startDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
                <td>{new Date(a.endDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
                <td>{a.type}</td>
                <td>{a.reason || "-"}</td>
                <td>
                  <span style={{ background: statusColors[a.status] || "#ddd", color: "#222", padding: "2px 8px", borderRadius: 4 }}>
                    {a.status}
                  </span>
                </td>
                <td>
                  <span style={{ background: a.remplacementStatus ? (remplacementStatusColors[a.remplacementStatus] || "#ddd") : "#d1d5db", color: "#222", padding: "2px 8px", borderRadius: 4 }}>
                    {a.remplacementStatus || "Aucun"}
                  </span>
                </td>
                {user?.role === "ADMIN" && (
                  <td>
                    {a.status === "En attente" && (
                      <>
                        <button onClick={() => handleValidate(a.id)} style={{ color: "green", marginRight: 8 }}>Valider</button>
                        <button onClick={() => handleOpenModifier(a)} style={{ color: "#2563eb" }}>Modifier remplaçant</button>
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
        <div style={{ marginTop: 24, background: "#f3f4f6", padding: 16, borderRadius: 8 }}>
          <h3>Modifier le remplaçant pour l'absence du {new Date(selectedAbsence.startDate).toLocaleDateString()}</h3>
          <input type="text" placeholder="ID du remplaçant" value={remplacantId} onChange={e => setRemplacantId(e.target.value)} style={{ marginRight: 8 }} />
          <button onClick={handleChangeRemplacant} disabled={actionLoading || !remplacantId} style={{ color: "green" }}>Valider le changement</button>
          <button onClick={() => setSelectedAbsence(null)} style={{ marginLeft: 8 }}>Annuler</button>
        </div>
      )}
    </div>
  );
}

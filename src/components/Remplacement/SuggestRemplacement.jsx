import React, { useEffect, useState } from "react";
import { getRemplacantsPossibles, proposerRemplacant } from "../../api/remplacement";
import useAuth from "../../hooks/useAuth";
import { useLocation } from "react-router-dom";

export default function SuggestRemplacement() {
  const { token, user } = useAuth();
  const location = useLocation();
  // On suppose que l'absence courante est passée dans le state de la route
  const absence = location.state?.absence;
  const [candidats, setCandidats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token || !absence?.poste) return;
    setLoading(true);
    getRemplacantsPossibles(absence.poste, absence.utilisateurId, token)
      .then(setCandidats)
      .catch(() => setError("Erreur lors du chargement des remplaçants"))
      .finally(() => setLoading(false));
  }, [token, absence]);

  const handleProposer = async (remplacantId) => {
    setError("");
    setSuccess("");
    try {
      await proposerRemplacant(absence.id, remplacantId, token);
      setSuccess("Remplaçant proposé avec succès !");
    } catch (e) {
      setError("Erreur lors de la proposition du remplaçant");
    }
  };

  if (!absence) return <div className="text-center mt-8">Aucune absence sélectionnée.</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-accent py-12">
      <div className="bg-white rounded-2xl shadow-lg px-8 py-10 w-full max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-primary text-center">
          Proposer un remplaçant pour {absence.nom} {absence.prenom} ({absence.poste})
        </h2>
        {loading ? (
          <div className="text-center">Chargement…</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <ul className="divide-y divide-accent mb-6">
            {candidats.map(c => (
              <li key={c.id} className="flex items-center justify-between py-3">
                <div>
                  <span className="font-semibold">{c.nom} {c.prenom}</span> <span className="text-secondary text-xs">({c.email})</span>
                  <span className="ml-2 text-xs text-gray-400">{c.telephone}</span>
                </div>
                <button
                  className="bg-primary text-white rounded-xl px-4 py-2 text-sm font-bold hover:bg-primary/80 transition"
                  onClick={() => handleProposer(c.id)}
                >
                  Proposer
                </button>
              </li>
            ))}
            {candidats.length === 0 && <li className="text-center py-4 text-secondary">Aucun remplaçant disponible pour ce poste.</li>}
          </ul>
        )}
        {success && <div className="text-green-600 text-center mt-4">{success}</div>}
      </div>
    </div>
  );
}

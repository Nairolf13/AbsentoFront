import React, { useEffect, useState } from "react";
import { getRemplacantsPossibles, proposerRemplacant } from "../../api/remplacement";
import useAuth from "../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import ConfirmModal from "../ui/ConfirmModal";
import "../ui/animations.css";

export default function SuggestRemplacement() {
  const { token, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  // On suppose que l'absence courante est passée dans le state de la route
  const absence = location.state?.absence;
  // Fallback : si absence non présente dans le state, essayer de la récupérer depuis le localStorage
  useEffect(() => {
    if (!absence) {
      const stored = localStorage.getItem("selectedAbsence");
      if (stored) {
        location.state = { absence: JSON.parse(stored) };
      }
    } else {
      // Stocke l'absence en localStorage pour persistance navigation/refresh
      localStorage.setItem("selectedAbsence", JSON.stringify(absence));
    }
  }, [absence]);

  const [candidats, setCandidats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [modalPropose, setModalPropose] = useState({ open: false, candidat: null });

  useEffect(() => {
    console.log('[DEBUG] Token juste avant chargement candidats:', token);
    if (!token || !absence || !absence.employee) return;
    setLoading(true);
    getRemplacantsPossibles(absence.employee.poste, absence.employee.id, token)
      .then(setCandidats)
      .catch((e) => {
        setError("Erreur lors du chargement des remplaçants");
        if (e.response) {
          console.error('[DEBUG] Erreur API:', e.response.status, e.response.data);
        } else {
          console.error('[DEBUG] Erreur inconnue:', e);
        }
      })
      .finally(() => setLoading(false));
  }, [token, absence]);

  const handleProposer = async (remplacantId) => {
    setError("");
    setSuccess("");
    setModalPropose({ open: true, candidat: candidats.find(c => c.id === remplacantId) });
  };

  const confirmProposer = async () => {
    if (!modalPropose.candidat) return;
    // LOG: Vérifie le token juste avant l'appel API
    console.log('[DEBUG] Token juste avant proposerRemplacant:', token);
    try {
      await proposerRemplacant(absence.id, modalPropose.candidat.id, token);
      setSuccess("Remplaçant proposé avec succès !");
      setTimeout(() => {
        navigate("/dashboard"); // redirige vers le dashboard (route existante)
      }, 1000);
    } catch (e) {
      setError("Erreur lors de la proposition du remplaçant");
      // LOG: Affiche la réponse exacte de l'API
      if (e.response) {
        console.error('[DEBUG] Erreur API:', e.response.status, e.response.data);
      } else {
        console.error('[DEBUG] Erreur inconnue:', e);
      }
    } finally {
      setModalPropose({ open: false, candidat: null });
    }
  };

  if (!absence || !absence.employee) {
    return <div className="text-center mt-8">Aucune absence sélectionnée ou informations employé manquantes.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-accent py-12">
      <div className="bg-white rounded-2xl shadow-lg px-8 py-10 w-full max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-primary text-center">
          Proposer un remplaçant pour {absence.employee.nom} {absence.employee.prenom} ({absence.employee.poste})
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
      {/* Modal de confirmation proposition remplaçant */}
      <ConfirmModal
        open={modalPropose.open}
        title="Confirmer la proposition ?"
        message={`Voulez-vous vraiment proposer ${modalPropose.candidat ? modalPropose.candidat.nom + ' ' + modalPropose.candidat.prenom : ''} comme remplaçant ?`}
        onConfirm={confirmProposer}
        onCancel={() => setModalPropose({ open: false, candidat: null })}
        confirmText="Proposer"
        cancelText="Annuler"
      />
    </div>
  );
}

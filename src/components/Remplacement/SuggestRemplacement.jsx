import React, { useEffect, useState } from "react";
import { getRemplacantsPossibles, proposerRemplacant } from "../../api/remplacement";
import { getAbsencesSansRemplacant } from "../../api/absento";
import { useAuth } from "../../context/AuthProvider";
import { useLocation, useNavigate } from "react-router-dom";
import ConfirmModal from "../ui/ConfirmModal";
import "../ui/animations.css";

export default function SuggestRemplacement() {
  const { token, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  // Nouvelle logique : on gère une absence sélectionnée OU la liste de toutes les absences à remplacer
  const [selectedAbsence, setSelectedAbsence] = useState(location.state?.absence || null);
  const [absences, setAbsences] = useState([]);
  const [loadingAbsences, setLoadingAbsences] = useState(false);
  const [errorAbsences, setErrorAbsences] = useState("");

  // Si aucune absence sélectionnée, on charge la liste de toutes les absences à remplacer
  useEffect(() => {
    if (!selectedAbsence && token) {
      setLoadingAbsences(true);
      getAbsencesSansRemplacant(token)
        .then(setAbsences)
        .catch(() => setErrorAbsences("Erreur lors du chargement des absences à remplacer."))
        .finally(() => setLoadingAbsences(false));
    }
  }, [selectedAbsence, token]);

  // Ancienne logique conservée pour la sélection d'une absence
  useEffect(() => {
    if (selectedAbsence) {
      localStorage.setItem("selectedAbsence", JSON.stringify(selectedAbsence));
    }
  }, [selectedAbsence]);

  const [candidats, setCandidats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [modalPropose, setModalPropose] = useState({ open: false, candidat: null });

  // Charge les candidats SEULEMENT si une absence est sélectionnée
  useEffect(() => {
    if (!token || !selectedAbsence || !selectedAbsence.employee) return;
    setLoading(true);
    getRemplacantsPossibles(selectedAbsence.employee.poste, selectedAbsence.employee.id, token)
      .then(setCandidats)
      .catch(() => setError("Erreur lors du chargement des remplaçants"))
      .finally(() => setLoading(false));
  }, [token, selectedAbsence]);

  const handleProposer = async (remplacantId) => {
    setError("");
    setSuccess("");
    setModalPropose({ open: true, candidat: candidats.find(c => c.id === remplacantId) });
  };

  const confirmProposer = async () => {
    if (!modalPropose.candidat) return;
    try {
      await proposerRemplacant(selectedAbsence.id, modalPropose.candidat.id, token);
      setSuccess("Remplaçant proposé avec succès !");
      setTimeout(() => {
        setSelectedAbsence(null); // On revient à la liste après proposition
        setSuccess("");
      }, 1200);
    } catch (e) {
      setError("Erreur lors de la proposition du remplaçant");
    } finally {
      setModalPropose({ open: false, candidat: null });
    }
  };

  // Affichage principal
  if (!selectedAbsence) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-accent py-12">
        <div className="bg-white rounded-2xl shadow-lg px-8 py-10 w-full max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-primary text-center">Absences à remplacer</h2>
          {loadingAbsences ? (
            <div className="text-center">Chargement…</div>
          ) : errorAbsences ? (
            <div className="text-center text-red-500">{errorAbsences}</div>
          ) : (
            <ul className="divide-y divide-accent mb-6">
              {absences.map(abs => (
                <li key={abs.id} className="flex items-center justify-between py-3">
                  <div>
                    <span className="font-semibold">{abs.employee?.nom} {abs.employee?.prenom}</span>
                    <span className="ml-2 text-xs text-gray-400">({abs.employee?.poste})</span>
                    <span className="ml-2 text-xs text-gray-400">{abs.dateDebut} → {abs.dateFin}</span>
                  </div>
                  <button
                    className="bg-primary text-white rounded-xl px-4 py-2 text-sm font-bold hover:bg-primary/80 transition"
                    onClick={() => setSelectedAbsence(abs)}
                  >
                    Voir candidats
                  </button>
                </li>
              ))}
              {absences.length === 0 && <li className="text-center py-4 text-secondary">Aucune absence à remplacer.</li>}
            </ul>
          )}
        </div>
      </div>
    );
  }

  // Si une absence est sélectionnée, affiche la logique existante
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-accent py-12">
      <div className="bg-white rounded-2xl shadow-lg px-8 py-10 w-full max-w-2xl mx-auto">
        <button className="mb-4 text-primary underline" onClick={() => setSelectedAbsence(null)}>
          ← Retour à la liste des absences
        </button>
        <h2 className="text-2xl font-bold mb-6 text-primary text-center">
          Proposer un remplaçant pour {selectedAbsence.employee.nom} {selectedAbsence.employee.prenom} ({selectedAbsence.employee.poste})
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

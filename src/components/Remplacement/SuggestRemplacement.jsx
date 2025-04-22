import React, { useEffect, useState } from "react";
import { getRemplacantsPossibles, proposerRemplacant } from "../../api/remplacement";
import { getAbsencesSansRemplacant } from "../../api/absento";
import { useAuth } from "../../context/AuthProvider";
import { useLocation, useNavigate } from "react-router-dom";
import ConfirmModal from "../ui/ConfirmModal";
import "../ui/animations.css";

export default function SuggestRemplacement() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { token, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedAbsence, setSelectedAbsence] = useState(location.state?.absence || null);
  const [absences, setAbsences] = useState([]);
  const [loadingAbsences, setLoadingAbsences] = useState(false);
  const [errorAbsences, setErrorAbsences] = useState("");

  useEffect(() => {
    if (!selectedAbsence && token) {
      setLoadingAbsences(true);
      getAbsencesSansRemplacant(token)
        .then(setAbsences)
        .catch(() => setErrorAbsences("Erreur lors du chargement des absences à remplacer."))
        .finally(() => setLoadingAbsences(false));
    }
  }, [selectedAbsence, token]);

  useEffect(() => {
    if (selectedAbsence) {
      localStorage.setItem("selectedAbsence", JSON.stringify(selectedAbsence));
    }
  }, [selectedAbsence]);

  useEffect(() => {
    if (selectedAbsence) {
      console.log("[DEBUG] Absence sélectionnée:", selectedAbsence);
      if (selectedAbsence.employee) {
        console.log("[DEBUG] Poste de l'absent:", selectedAbsence.employee.poste);
        console.log("[DEBUG] ID de l'absent:", selectedAbsence.employee.id);
      } else {
        console.warn("[DEBUG] Aucun employé associé à l'absence sélectionnée.");
      }
    } else {
      console.warn("[DEBUG] Aucune absence sélectionnée.");
    }
  }, [selectedAbsence]);

  const [candidats, setCandidats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [modalPropose, setModalPropose] = useState({ open: false, candidat: null });

  useEffect(() => {
    console.log("[DEBUG] useEffect déclenché : token=", token, ", selectedAbsence=", selectedAbsence);
    if (token === undefined) {
      console.warn("[DEBUG] Token pas encore chargé, on attend...");
      return;
    }
    if (!selectedAbsence || !selectedAbsence.employee) {
      console.warn("[DEBUG] useEffect non exécuté: condition non remplie.");
      return;
    }
    setLoading(true);
    getRemplacantsPossibles(selectedAbsence.employee.poste, selectedAbsence.employee.id)
      .then(data => {
        console.log("[DEBUG] Réponse API candidats:", data);
        setCandidats(data);
      })
      .catch((err) => {
        setError("Erreur lors du chargement des remplaçants");
        console.error("[DEBUG] Erreur API candidats:", err);
      })
      .finally(() => setLoading(false));
  }, [selectedAbsence]);

  const handleProposer = async (remplacantId) => {
    setError("");
    setSuccess("");
    setModalPropose({ open: true, candidat: candidats.find(c => c.id === remplacantId) });
  };

  const confirmProposer = async () => {
    if (!modalPropose.candidat) return;
    try {
      await proposerRemplacant(selectedAbsence.id, modalPropose.candidat.id);
      setSuccess("Remplaçant proposé avec succès !");
      setTimeout(() => {
        setSelectedAbsence(null); 
        setSuccess("");
      }, 1200);
    } catch (e) {
      setError("Erreur lors de la proposition du remplaçant");
    } finally {
      setModalPropose({ open: false, candidat: null });
    }
  };

  if (!selectedAbsence) {
    return (
      <div className="min-h-screen flex flex-col items-center bg-accent py-8">
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

  return (
    <div className="min-h-screen flex flex-col items-center bg-accent py-12">
      <div className="bg-white rounded-2xl shadow-lg px-8 py-10 w-full max-w-2xl mx-auto">
        <button className="mb-4 text-primary underline" onClick={() => navigate("/dashboard/remplacement")}> 
          ← Retour à la liste des absences
        </button>
        <h2 className="text-2xl font-bold mb-6 text-primary text-center">
          Suggestions de remplaçants
        </h2>
        {loading ? (
          <div className="text-center">Chargement…</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : candidats.length === 0 ? (
          <div className="text-center text-secondary">Aucun remplaçant disponible pour ce poste dans l'entreprise.</div>
        ) : (
          <ul className="divide-y divide-accent mb-6">
            {candidats.map((c) => (
              <li key={c.id} className="flex items-center justify-between py-3">
                <div>
                  <span className="font-semibold">{c.nom} {c.prenom}</span>
                  <span className="ml-2 text-xs text-gray-400">{c.email}</span>
                  <span className="ml-2 text-xs text-gray-400">{c.telephone}</span>
                </div>
                <button
                  className="bg-primary text-white rounded-xl px-4 py-2 text-sm font-bold hover:bg-primary/80 transition"
                  onClick={() => handleProposer(c.id)}
                >
                  Proposer ce remplaçant
                </button>
              </li>
            ))}
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

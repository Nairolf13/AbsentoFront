import { useEffect } from "react";
import { useAuth } from "../../context/AuthProvider";
import ConfirmModal from "../ui/ConfirmModal";

// Importation des composants refactorisés
import {
  AbsenceTable,
  AbsenceCardList,
  JustificatifModal,
  RemplacantModal,
  useAbsenceData
} from "./AbsenceHistoryComponents";

export default function HistoriqueAbsences() {
  // Scroll en haut de la page au montage du composant
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Récupération des données utilisateur depuis le contexte d'authentification
  const { user } = useAuth();
  
  // Utilisation du hook personnalisé pour la gestion des données d'absence
  const {
    absences,
    loading,
    error,
    selectedAbsence,
    setSelectedAbsence,
    remplacantId,
    setRemplacantId,
    actionLoading,
    employees,
    justificatifPreview,
    setJustificatifPreview,
    confirmDeleteId,
    setConfirmDeleteId,
    deleteLoading,
    handleValidate,
    handleRefuse,
    handleOpenModifier,
    handleChangeRemplacant,
    handleDeleteAbsence
  } = useAbsenceData(user);

  // États de chargement et d'erreur
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
            <>
              {/* Vue desktop : tableau */}
              <AbsenceTable 
                absences={absences}
                user={user}
                onValidate={handleValidate}
                onRefuse={handleRefuse}
                onModify={handleOpenModifier}
                onDelete={setConfirmDeleteId}
                onShowJustificatif={setJustificatifPreview}
              />
              
              {/* Vue mobile : cartes */}
              <AbsenceCardList 
                absences={absences}
                user={user}
                onValidate={handleValidate}
                onRefuse={handleRefuse}
                onModify={handleOpenModifier}
                onDelete={setConfirmDeleteId}
                onShowJustificatif={setJustificatifPreview}
              />
            </>
          )}
          
          {/* Modals */}
          <RemplacantModal 
            absence={selectedAbsence}
            employees={employees}
            remplacantId={remplacantId}
            actionLoading={actionLoading}
            onChangeRemplacant={handleChangeRemplacant}
            onSetRemplacantId={setRemplacantId}
            onClose={() => setSelectedAbsence(null)}
          />
          
          <JustificatifModal 
            url={justificatifPreview}
            onClose={() => setJustificatifPreview(null)}
          />
          
          {confirmDeleteId && (
            <ConfirmModal
              open={!!confirmDeleteId}
              title="Confirmation de suppression"
              message="Voulez-vous vraiment supprimer cette absence ? Cette action est irréversible."
              onConfirm={() => handleDeleteAbsence(confirmDeleteId)}
              onCancel={() => setConfirmDeleteId(null)}
              confirmText={deleteLoading ? "Suppression..." : "Supprimer"}
              cancelText="Annuler"
            />
          )}
        </div>
      </div>
    </div>
  );
}
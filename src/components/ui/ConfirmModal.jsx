import React from "react";

export default function ConfirmModal({ open, title, message, onConfirm, onCancel, confirmText = "Confirmer", cancelText = "Annuler" }) {
  // TOUS les hooks seraient ici (aucun dans ce composant, donc c'est OK)
  // Toujours rendre le composant, masquer visuellement si open === false
  return (
    <div style={{ display: open ? 'flex' : 'none' }} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full animate-fade-in">
        <h3 className="text-xl font-bold mb-2 text-primary">{title}</h3>
        <div className="mb-6 text-gray-700">{message}</div>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 font-semibold"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className="px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 font-semibold"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

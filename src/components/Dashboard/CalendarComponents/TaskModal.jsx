import ReactDOM from 'react-dom';

export default function TaskModal({
  modalOpen,
  modalSlot,
  DAYS,
  taskLabel,
  setTaskLabel,
  setModalOpen,
  handleDeleteTask,
  handleSaveTask,
  handleSaveTaskRange,
  confirmDeleteTask
}) {
  if (!modalOpen || !modalSlot) return null;
  
  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center" style={{ zIndex: 9999 }}>
      <div className="bg-white rounded-xl p-6 w-full max-w-xs shadow-lg mx-2">
        <h3 className="text-lg font-semibold mb-4">Assigner ou supprimer une tâche</h3>
        {modalSlot.start !== undefined && modalSlot.end !== undefined ? (
          <div className="mb-2 text-sm">Jour : <b>{DAYS[modalSlot.dayIdx]}</b> de <b>{modalSlot.start}:00</b> à <b>{modalSlot.end}:00</b></div>
        ) : (
          <div className="mb-2 text-sm">Jour : <b>{DAYS[modalSlot.dayIdx]}</b> à <b>{modalSlot.hour}:00</b></div>
        )}
        <input
          type="text"
          className="w-full border rounded px-3 py-2 mb-4"
          placeholder="Tâche à assigner..."
          value={taskLabel}
          onChange={e => setTaskLabel(e.target.value)}
          autoFocus
        />
        <div className="flex flex-col gap-2 mt-4">
          <button className="px-4 py-2 rounded bg-gray-200 w-full" onClick={() => setModalOpen(false)}>Annuler</button>
          <button className="px-4 py-2 rounded bg-red-500 text-white font-semibold w-full" onClick={handleDeleteTask} onTouchEnd={confirmDeleteTask}>Supprimer</button>
          {modalSlot.start !== undefined && modalSlot.end !== undefined ? (
            <button className="px-4 py-2 rounded bg-primary text-white font-semibold w-full" onClick={handleSaveTaskRange} disabled={!taskLabel.trim()}>Enregistrer</button>
          ) : (
            <button className="px-4 py-2 rounded bg-primary text-white font-semibold w-full" onClick={handleSaveTask} disabled={!taskLabel.trim()}>Enregistrer</button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

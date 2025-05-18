import TaskForm from "./TaskForm";

export default function AddTaskModal({ open, onClose, onAdd, employees = [], isManager }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[998] flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-primary text-xl"
          onClick={onClose}
        >
          ×
        </button>
        <div className="font-semibold text-secondary mb-4">Créer une tâche</div>
        <TaskForm
          onAdd={onAdd}
          onClose={onClose}
          employees={employees}
          isManager={isManager}
        />
      </div>
    </div>
  );
}

import React from "react";
import TaskItem from "./TaskItem";
import { Plus } from "react-feather";

/**
 * Composant affichant la liste des tâches de l'utilisateur
 */
export default function MyTaskList({ 
  tasks, 
  loading, 
  error, 
  editingId, 
  editValue,
  onSetEditValue, 
  onEdit, 
  onSave, 
  onCancel, 
  onDelete, 
  onToggleComplete,
  onAddClick
}) {
  return (
    <div className="flex-1 bg-white rounded-xl shadow p-4 mb-6 md:mb-0 relative">
      <div className="flex items-center justify-between mb-4">
        <div className="font-semibold text-secondary">Mes tâches à faire</div>
        <button
          className="rounded-full bg-primary text-secondary w-9 h-9 flex items-center justify-center shadow hover:bg-primary/80 transition"
          onClick={onAddClick}
          aria-label="Ajouter une tâche"
        >
          <Plus size={22} />
        </button>
      </div>
      
      {loading ? (
        <div className="text-secondary text-sm">Chargement...</div>
      ) : error ? (
        <div className="text-red-500 text-sm">{error}</div>
      ) : (
        <ul className="flex-1 space-y-3 overflow-y-auto">
          {tasks.length === 0 ? (
            <li className="text-secondary text-sm">Aucune tâche</li>
          ) : (
            tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                editing={editingId === task.id}
                editValue={editValue}
                onEditChange={onSetEditValue}
                onSave={onSave}
                onCancel={onCancel}
                onToggleComplete={onToggleComplete}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </ul>
      )}
    </div>
  );
}

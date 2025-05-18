import React from "react";

/**
 * Composant représentant une tâche individuelle
 */
export default function TaskItem({ 
  task, 
  editing, 
  editValue, 
  onEditChange, 
  onSave, 
  onCancel,
  onToggleComplete, 
  onEdit, 
  onDelete 
}) {
  if (editing) {
    return (
      <li className="flex items-center group">
        <input
          type="checkbox"
          className="mr-3"
          checked={task.completed}
          onChange={() => onToggleComplete(task.id, task.completed)}
        />
        <input
          className="rounded border px-2 py-1 text-sm mr-2"
          value={editValue}
          onChange={(e) => onEditChange(e.target.value)}
          autoFocus
        />
        <button 
          type="button" 
          className="text-primary mr-2" 
          onClick={() => onSave(task.id)}
        >
          Sauver
        </button>
        <button 
          type="button" 
          className="text-secondary" 
          onClick={onCancel}
        >
          Annuler
        </button>
      </li>
    );
  }

  return (
    <li className="flex items-center group">
      <input
        type="checkbox"
        className="mr-3"
        checked={task.completed}
        onChange={() => onToggleComplete(task.id, task.completed)}
      />
      <span className={`text-secondary text-sm flex-1 ${task.completed ? 'line-through' : ''}`}>
        {task.title}
      </span>
      <button
        type="button"
        className="ml-2 text-xs text-primary opacity-0 group-hover:opacity-100"
        onClick={() => onEdit(task.id, task.title)}
      >
        Modifier
      </button>
      <button
        type="button"
        className="ml-2 text-xs text-red-500 opacity-0 group-hover:opacity-100"
        onClick={() => onDelete(task)}
      >
        Supprimer
      </button>
    </li>
  );
}

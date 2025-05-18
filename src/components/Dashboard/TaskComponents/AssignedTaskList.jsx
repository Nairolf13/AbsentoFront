import React from "react";

/**
 * Composant affichant les tâches assignées aux employés
 * (visible uniquement par les managers)
 */
export default function AssignedTaskList({ tasks = [] }) {
  return (
    <div className="flex-1 bg-white rounded-xl shadow p-4">
      <div className="font-semibold text-secondary mb-4">Tâches assignées</div>
      
      {tasks.length === 0 ? (
        <div className="text-secondary text-sm">Aucune tâche assignée à un employé.</div>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li key={task.id} className="flex items-center group bg-gray-50 rounded px-2 py-1">
              <span className="flex-1 text-sm text-secondary">
                {task.title} 
                <span className="text-xs text-primary ml-2">
                  {task.user?.prenom} {task.user?.nom}
                </span>
              </span>
              <span className={`ml-4 text-xs font-bold ${task.completed ? 'text-green-600' : 'text-orange-500'}`}>
                {task.completed ? 'FAIT' : 'À FAIRE'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

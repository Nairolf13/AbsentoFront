import React from "react";
import { useAuth } from "../../context/AuthProvider";
import ConfirmModal from "../ui/ConfirmModal";
import AddTaskModal from "./TaskComponents/AddTaskModal";
import { useTaskManager, MyTaskList, AssignedTaskList } from "./TaskComponents";
import "../ui/animations.css";

/**
 * Composant principal pour la gestion des tâches
 * Utilise des sous-composants pour une meilleure séparation des préoccupations
 */
export default function TaskList() {
  const { user } = useAuth();
  
  // Utilisation du hook personnalisé pour gérer les tâches
  const {
    tasks,
    loading,
    error,
    editingId,
    editValue,
    modalDelete,
    employees,
    assignedTasks,
    showAddModal,
    isManager,
    handleDelete,
    confirmDelete,
    startEdit,
    handleEdit,
    toggleCompleted,
    addTask,
    cancelEdit,
    setModalDelete,
    setShowAddModal,
    setEditValue: handleEditValueChange
  } = useTaskManager(user);

  return (
    <div className={`h-full ${isManager ? 'flex flex-col md:flex-row gap-8' : 'flex flex-col'}`}>
      {/* Liste des tâches de l'utilisateur */}
      <MyTaskList 
        tasks={tasks}
        loading={loading}
        error={error}
        editingId={editingId}
        editValue={editValue}
        onSetEditValue={handleEditValueChange}
        onEdit={startEdit}
        onSave={handleEdit}
        onCancel={cancelEdit}
        onDelete={handleDelete}
        onToggleComplete={toggleCompleted}
        onAddClick={() => setShowAddModal(true)}
      />

      {/* Liste des tâches assignées (uniquement pour les managers) */}
      {isManager && (
        <AssignedTaskList tasks={assignedTasks} />
      )}

      {/* Modales */}
      <ConfirmModal
        open={modalDelete.open}
        title="Supprimer la tâche ?"
        message={`Voulez-vous vraiment supprimer la tâche « ${modalDelete.task ? modalDelete.task.title : ''} » ? Cette action est irréversible.`}
        onConfirm={confirmDelete}
        onCancel={() => setModalDelete({ open: false, task: null })}
        confirmText="Supprimer"
        cancelText="Annuler"
      />

      <AddTaskModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={addTask}
        employees={employees}
        isManager={isManager}
      />
    </div>
  );
}

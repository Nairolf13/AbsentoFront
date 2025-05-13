import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import ConfirmModal from "../ui/ConfirmModal";
import AddTaskModal from "./AddTaskModal";
import { Plus } from "react-feather";
import "../ui/animations.css";
import { API_URL } from '../../api/config';
import { fetchEmployees } from '../../api/employees';
import useSocket from "../../hooks/useSocket";
import axios from 'axios';

export default function TaskList() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [modalDelete, setModalDelete] = useState({ open: false, task: null });
  const [employees, setEmployees] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const isManager = user && ["RH", "MANAGER", "RESPONSABLE", "ADMIN"].includes(user.role);

  useSocket((event, payload) => {
    if (event === "notification" && payload && payload.message && payload.message.includes("tâche")) {
      axios.get(`${API_URL}/tasks`)
        .then((res) => {
          setTasks(Array.isArray(res.data) ? res.data : []);
        });
      if (isManager) {
        axios.get(`${API_URL}/tasks/assigned-by-me`)
          .then((res) => setAssignedTasks(Array.isArray(res.data) ? res.data : []));
      }
    }
  });

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    axios.get(`${API_URL}/tasks`)
      .then((res) => {
        setTasks(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur de chargement des tâches:", err);
        setError("Erreur lors du chargement des tâches");
        setLoading(false);
      });
    if (isManager) {
      fetchEmployees().then(setEmployees).catch(() => setEmployees([]));
      axios.get(`${API_URL}/tasks/assigned-by-me`)
        .then((res) => setAssignedTasks(Array.isArray(res.data) ? res.data : []));
    }
  }, [user]);

  const handleDelete = (task) => setModalDelete({ open: true, task });
  const confirmDelete = async () => {
    if (!modalDelete.task) return;
    try {
      await axios.delete(`${API_URL}/tasks/${modalDelete.task.id}`);
      setTasks((ts) => ts.filter((t) => t.id !== modalDelete.task.id));
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
    }
    setModalDelete({ open: false, task: null });
  };

  const startEdit = (id, title) => {
    setEditingId(id);
    setEditValue(title);
  };
  const handleEdit = async (id) => {
    try {
      await axios.put(`${API_URL}/tasks/${id}`, { title: editValue });
      setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, title: editValue } : t)));
      setEditingId(null);
      setEditValue("");
    } catch (err) {
      console.error("Erreur lors de la mise à jour:", err);
    }
  };

  const toggleCompleted = async (id, completed) => {
    try {
      await axios.put(`${API_URL}/tasks/${id}`, { completed: !completed });
      setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, completed: !completed } : t)));
      window.dispatchEvent(new CustomEvent("refreshTaskCounter"));
    } catch (err) {
      console.error("Erreur lors de la mise à jour du statut:", err);
    }
  };

  return (
    <div className={`h-full ${isManager ? 'flex flex-col md:flex-row gap-8' : 'flex flex-col'}`}>
      {/* Conteneur MES TÂCHES */}
      <div className={`flex-1 bg-white rounded-xl shadow p-4 mb-6 md:mb-0 relative`}>
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold text-secondary">Mes tâches à faire</div>
          <button
            className="rounded-full bg-primary text-secondary w-9 h-9 flex items-center justify-center shadow hover:bg-primary/80 transition"
            onClick={() => setShowAddModal(true)}
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
            {tasks.map((task) => (
              <li key={task.id} className="flex items-center group">
                <input
                  type="checkbox"
                  className="mr-3"
                  checked={task.completed}
                  onChange={() => toggleCompleted(task.id, task.completed)}
                />
                {editingId === task.id ? (
                  <>
                    <input
                      className="rounded border px-2 py-1 text-sm mr-2"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                    />
                    <button type="button" className="text-primary mr-2" onClick={() => handleEdit(task.id)}>
                      Sauver
                    </button>
                    <button type="button" className="text-secondary" onClick={() => setEditingId(null)}>
                      Annuler
                    </button>
                  </>
                ) : (
                  <>
                    <span className={`text-secondary text-sm flex-1 ${task.completed ? 'line-through' : ''}`}>{task.title}</span>
                    <button
                      type="button"
                      className="ml-2 text-xs text-primary opacity-0 group-hover:opacity-100"
                      onClick={() => startEdit(task.id, task.title)}
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      className="ml-2 text-xs text-red-500 opacity-0 group-hover:opacity-100"
                      onClick={() => handleDelete(task)}
                    >
                      Supprimer
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Conteneur TÂCHES ASSIGNÉES */}
      {isManager && (
        <div className="flex-1 bg-white rounded-xl shadow p-4">
          <div className="font-semibold text-secondary mb-4">Tâches assignées</div>
          {assignedTasks.length === 0 ? (
            <div className="text-secondary text-sm">Aucune tâche assignée à un employé.</div>
          ) : (
            <ul className="space-y-3">
              {assignedTasks.map((task) => (
                <li key={task.id} className="flex items-center group bg-gray-50 rounded px-2 py-1">
                  <span className="flex-1 text-sm text-secondary">
                    {task.title} <span className="text-xs text-primary ml-2">{task.user?.prenom} {task.user?.nom}</span>
                  </span>
                  <span className={`ml-4 text-xs font-bold ${task.completed ? 'text-green-600' : 'text-orange-500'}`}>{task.completed ? 'FAIT' : 'À FAIRE'}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {/* Modal de confirmation suppression tâche */}
      <ConfirmModal
        open={modalDelete.open}
        title="Supprimer la tâche ?"
        message={`Voulez-vous vraiment supprimer la tâche « ${modalDelete.task ? modalDelete.task.title : ''} » ? Cette action est irréversible.`}
        onConfirm={confirmDelete}
        onCancel={() => setModalDelete({ open: false, task: null })}
        confirmText="Supprimer"
        cancelText="Annuler"
      />
      {/* Modal d'ajout de tâche */}
      <AddTaskModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={async ({ title, userId }) => {
          try {
            const body = { title };
            if (isManager && userId) body.userId = Number(userId);
            
            const res = await axios.post(`${API_URL}/tasks`, body);
            setTasks((ts) => [...ts, res.data]);
            
            if (isManager && userId && userId !== user.id) {
              axios.get(`${API_URL}/tasks/assigned-by-me`)
                .then((res) => setAssignedTasks(Array.isArray(res.data) ? res.data : []));
            }
            
            setShowAddModal(false);
          } catch (err) {
            console.error("Erreur lors de la création de la tâche:", err);
          }
        }}
        employees={employees}
        isManager={isManager}
      />
    </div>
  );
}

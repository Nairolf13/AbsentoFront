import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import ConfirmModal from "../ui/ConfirmModal";
import "../ui/animations.css";
import { API_URL } from '../../api/config';

export default function TaskList() {
  const { user, token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [modalDelete, setModalDelete] = useState({ open: false, task: null });

  // Fetch tasks on mount
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch(`${API_URL}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setTasks(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError("Erreur lors du chargement des tâches");
        setLoading(false);
      });
  }, [token]);

  // Add a new task
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    const res = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: newTask }),
    });
    if (res.ok) {
      const task = await res.json();
      setTasks((ts) => [...ts, task]);
      setNewTask("");
    }
  };

  // Suppression tâche avec confirmation
  const handleDelete = (task) => setModalDelete({ open: true, task });
  const confirmDelete = async () => {
    if (!modalDelete.task) return;
    const res = await fetch(`${API_URL}/tasks/${modalDelete.task.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setTasks((ts) => ts.filter((t) => t.id !== modalDelete.task.id));
    setModalDelete({ open: false, task: null });
  };

  // Edit a task
  const startEdit = (id, title) => {
    setEditingId(id);
    setEditValue(title);
  };
  const handleEdit = async (id) => {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: editValue }),
    });
    if (res.ok) {
      setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, title: editValue } : t)));
      setEditingId(null);
      setEditValue("");
    }
  };

  // Toggle completed
  const toggleCompleted = async (id, completed) => {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ completed: !completed }),
    });
    if (res.ok) {
      setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, completed: !completed } : t)));
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="font-semibold text-secondary mb-4">Mes tâches à faire</div>
      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input
          type="text"
          className="flex-1 rounded-xl border border-primary/30 px-3 py-2 text-sm"
          placeholder="Ajouter une tâche..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button type="submit" className="bg-primary text-secondary rounded-xl px-4 py-2 font-semibold">
          +
        </button>
      </form>
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
    </div>
  );
}

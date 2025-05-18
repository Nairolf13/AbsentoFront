import { useState, useEffect } from "react";
import axios from 'axios';
import { API_URL } from '../../../api/config';
import { fetchEmployees } from '../../../api/employees';
import useSocket from "../../../hooks/useSocket";

/**
 * Hook personnalisé pour gérer les tâches 
 * @param {Object} user - Utilisateur connecté
 * @returns {Object} État et méthodes pour gérer les tâches
 */
export function useTaskManager(user) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [modalDelete, setModalDelete] = useState({ open: false, task: null });
  const [employees, setEmployees] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Vérifier si l'utilisateur est manager
  const isManager = user && ["RH", "MANAGER", "RESPONSABLE", "ADMIN"].includes(user.role);

  // Écouter les modifications des tâches via websocket
  useSocket((event, payload) => {
    if (event === "notification" && payload && payload.message && payload.message.includes("tâche")) {
      fetchTasks();
      if (isManager) {
        fetchAssignedTasks();
      }
    }
  });

  // Charger les données initiales
  useEffect(() => {
    if (!user) return;
    loadInitialData();
  }, [user]);

  /**
   * Charge toutes les données initiales
   */
  const loadInitialData = async () => {
    setLoading(true);
    try {
      await fetchTasks();
      
      if (isManager) {
        try {
          const empData = await fetchEmployees();
          setEmployees(empData || []);
        } catch (err) {
          console.error("Erreur lors du chargement des employés:", err);
          setEmployees([]);
        }
        
        await fetchAssignedTasks();
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Récupère les tâches de l'utilisateur
   */
  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/tasks`);
      setTasks(Array.isArray(res.data) ? res.data : []);
      setError("");
    } catch (err) {
      console.error("Erreur de chargement des tâches:", err);
      setError("Erreur lors du chargement des tâches");
    }
  };

  /**
   * Récupère les tâches assignées par le manager
   */
  const fetchAssignedTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/tasks/assigned-by-me`);
      setAssignedTasks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Erreur lors du chargement des tâches assignées:", err);
    }
  };

  /**
   * Prépare la suppression d'une tâche
   */
  const handleDelete = (task) => {
    setModalDelete({ open: true, task });
  };

  /**
   * Confirme la suppression d'une tâche
   */
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

  /**
   * Commence l'édition d'une tâche
   */
  const startEdit = (id, title) => {
    setEditingId(id);
    setEditValue(title);
  };

  /**
   * Sauvegarde les modifications d'une tâche
   */
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

  /**
   * Change le statut (complété/non complété) d'une tâche
   */
  const toggleCompleted = async (id, completed) => {
    try {
      await axios.put(`${API_URL}/tasks/${id}`, { completed: !completed });
      setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, completed: !completed } : t)));
      window.dispatchEvent(new CustomEvent("refreshTaskCounter"));
    } catch (err) {
      console.error("Erreur lors de la mise à jour du statut:", err);
    }
  };

  /**
   * Ajoute une nouvelle tâche
   */
  const addTask = async ({ title, userId }) => {
    try {
      const body = { title };
      if (isManager && userId) body.userId = Number(userId);
      
      const res = await axios.post(`${API_URL}/tasks`, body);
      setTasks((ts) => [...ts, res.data]);
      
      if (isManager && userId && userId !== user.id) {
        fetchAssignedTasks();
      }
      
      setShowAddModal(false);
      return { success: true };
    } catch (err) {
      console.error("Erreur lors de la création de la tâche:", err);
      return { success: false, error: err.message };
    }
  };

  /**
   * Annule l'édition d'une tâche
   */
  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };
  
  return {
    // État
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
    
    // Actions
    handleDelete,
    confirmDelete,
    startEdit,
    handleEdit,
    toggleCompleted,
    addTask,
    cancelEdit,
    setModalDelete,
    setShowAddModal
  };
}

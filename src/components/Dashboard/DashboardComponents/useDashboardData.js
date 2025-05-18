import { useState, useEffect } from "react";
import { getAllAbsences } from "../../../api/absento";
import { API_URL } from "../../../api/config";
import axios from 'axios';
import useSocket from '../../../hooks/useSocket';
import { toast } from 'react-toastify';

export default function useDashboardData(user) {
  const [absencesEnCours, setAbsencesEnCours] = useState(0);
  const [tasksEnCours, setTasksEnCours] = useState(0);
  const [tasks, setTasks] = useState([]);
  const { socket } = useSocket();
  
  // Ajouter un système de debounce pour éviter les appels API trop fréquents
  const fetchWithDebounce = (fn) => {
    let timeout;
    return () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        fn();
      }, 300);
    };
  };

  useEffect(() => {
    if (!user) return;
    
    async function fetchAbsences() {
      try {
        const absences = await getAllAbsences();
        const enCours = absences.filter(a => 
          a.status === "En attente" || 
          a.status === "en attente" || 
          a.status === "EN_ATTENTE" || 
          a.statut === "En attente" || 
          a.statut === "en attente" || 
          a.statut === "EN_ATTENTE"
        ).length;
        setAbsencesEnCours(enCours);
      } catch (e) {
        console.error("Erreur lors du chargement des absences:", e);
        setAbsencesEnCours(0);
      }
    }
    
    async function fetchTasks() {
      try {
        const res = await axios.get(`${API_URL}/tasks`);
        const tasks = res.data;
        const enCours = Array.isArray(tasks) ? tasks.filter(t => !t.completed).length : 0;
        setTasksEnCours(enCours);
        setTasks(tasks || []);
      } catch (e) {
        console.error("Erreur lors du chargement des tâches:", e);
        setTasksEnCours(0);
      }
    }
    
    fetchAbsences();
    fetchTasks();
    
    // Utilisation du debounce pour éviter les appels trop fréquents
    const debouncedFetchAbsences = fetchWithDebounce(fetchAbsences);
    const debouncedFetchTasks = fetchWithDebounce(fetchTasks);
    
    window.addEventListener("refreshAbsenceCounter", debouncedFetchAbsences);
    window.addEventListener("refreshTaskCounter", debouncedFetchTasks);
    
    return () => {
      window.removeEventListener("refreshAbsenceCounter", debouncedFetchAbsences);
      window.removeEventListener("refreshTaskCounter", debouncedFetchTasks);
    };
  }, [user]);

  useEffect(() => {
    if (socket) {
      const handleTaskUpdate = (data) => {
        if (data.type === 'delete') {
          setTasks(currentTasks => 
            currentTasks.filter(task => task.id !== data.task.id)
          );
          toast.info("Une tâche a été supprimée");
        }
      };
      
      socket.on('task-update', handleTaskUpdate);
      
      return () => {
        socket.off('task-update', handleTaskUpdate);
      };
    }
  }, [socket]);

  useSocket((event) => {
    if (["absence:created", "absence:updated", "absence:deleted"].includes(event)) {
      window.dispatchEvent(new CustomEvent("refreshAbsenceCounter"));
    }
  });

  return {
    absencesEnCours,
    tasksEnCours,
    tasks
  };
}

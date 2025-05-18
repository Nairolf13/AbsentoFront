import { useState, useEffect, useRef } from 'react';
import { format, addDays } from 'date-fns';
import { fetchEmployeePlanning } from '../../../api/planning';
import useSocket from '../../../hooks/useSocket';

export default function usePlanningData(selectedEmployeeId, weekStart) {
  const [events, setEvents] = useState([]);
  const [loadingPlanning, setLoadingPlanning] = useState(false);

  const transformPlanningToEvents = (planning) => {
    return planning
      .filter(ev => ev.label && ev.label.trim() !== "")
      .map(ev => {
        const d = new Date(ev.date);
        return {
          id: ev.id,
          day: d.getDay() === 0 ? 6 : d.getDay() - 1, 
          hour: d.getHours(),
          label: ev.label,
          color: "bg-primary"
        };
      });
  };

  useEffect(() => {
    async function loadPlanning() {
      if (!selectedEmployeeId) return;
      setLoadingPlanning(true);
      try {
        const from = format(weekStart, 'yyyy-MM-dd');
        const to = format(addDays(weekStart, 6), 'yyyy-MM-dd');
        const planning = await fetchEmployeePlanning(selectedEmployeeId, from, to);
        setEvents(transformPlanningToEvents(planning));
      } catch (error) {
        console.error("Erreur lors du chargement du planning:", error);
        setEvents([]);
      }
      setLoadingPlanning(false);
    }
    loadPlanning();
  }, [selectedEmployeeId, weekStart]);

  // On utilise une référence pour suivre la dernière mise à jour et éviter les requêtes trop fréquentes
  const lastUpdateRef = useRef(0);
  
  useSocket((event) => {
    if (event === 'absence:created' || event === 'absence:updated' || event === 'absence:deleted') {
      // Vérifier si au moins 500ms se sont écoulées depuis la dernière mise à jour
      const now = Date.now();
      if (now - lastUpdateRef.current > 500 && selectedEmployeeId) {
        lastUpdateRef.current = now;
        
        const from = format(weekStart, 'yyyy-MM-dd');
        const to = format(addDays(weekStart, 6), 'yyyy-MM-dd');
        fetchEmployeePlanning(selectedEmployeeId, from, to)
          .then(planning => {
            setEvents(transformPlanningToEvents(planning));
          })
          .catch(error => {
            console.error("Erreur lors de la mise à jour du planning:", error);
          });
      }
    }
  });

  const refreshPlanning = async () => {
    if (!selectedEmployeeId) return;
    setLoadingPlanning(true);
    try {
      const from = format(weekStart, 'yyyy-MM-dd');
      const to = format(addDays(weekStart, 6), 'yyyy-MM-dd');
      const planning = await fetchEmployeePlanning(selectedEmployeeId, from, to);
      setEvents(transformPlanningToEvents(planning));
    } catch (error) {
      console.error("Erreur lors du rafraîchissement du planning:", error);
    }
    setLoadingPlanning(false);
  };

  return { 
    events, 
    setEvents, 
    loadingPlanning, 
    refreshPlanning,
    transformPlanningToEvents
  };
}

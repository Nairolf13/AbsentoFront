import { setEmployeePlanning, deleteEmployeePlanning } from '../../../api/planning';

export default function useTaskActions(
  modalSlot, 
  taskLabel, 
  selectedEmployeeId, 
  days, 
  setModalOpen, 
  setModalDeleteOpen,
  refreshPlanning
) {
  const handleSaveTask = async () => {
    if (modalSlot && taskLabel.trim()) {
      const date = new Date(days[modalSlot.dayIdx]);
      date.setHours(modalSlot.hour, 0, 0, 0);
      
      try {
        await setEmployeePlanning([
          { employeeId: selectedEmployeeId, date: date.toISOString(), label: taskLabel, moment: date.getHours() < 12 ? 'AM' : 'PM' }
        ]);
        setModalOpen(false);
        await refreshPlanning();
      } catch (error) {
        console.error("Erreur lors de l'enregistrement de la tâche:", error);
      }
    }
  };

  const handleSaveTaskRange = async () => {
    if (modalSlot && taskLabel.trim()) {
      const slots = [];
      for (let h = modalSlot.start; h <= modalSlot.end; h++) {
        const date = new Date(days[modalSlot.dayIdx]);
        date.setHours(h, 0, 0, 0);
        slots.push({ employeeId: selectedEmployeeId, date: date.toISOString(), label: taskLabel, moment: h < 12 ? 'AM' : 'PM' });
      }
      
      try {
        await setEmployeePlanning(slots);
        setModalOpen(false);
        await refreshPlanning();
      } catch (error) {
        console.error("Erreur lors de l'enregistrement de la plage de tâches:", error);
      }
    }
  };

  const handleDeleteTask = async () => {
    setModalDeleteOpen(true); 
  };

  const confirmDeleteTask = async () => {
    if (modalSlot) {
      let dates = [];
      if (modalSlot.start !== undefined && modalSlot.end !== undefined) {
        for (let h = modalSlot.start; h <= modalSlot.end; h++) {
          const date = new Date(days[modalSlot.dayIdx]);
          date.setHours(h, 0, 0, 0);
          dates.push(date.toISOString());
        }
      } else {
        const date = new Date(days[modalSlot.dayIdx]);
        date.setHours(modalSlot.hour, 0, 0, 0);
        dates = [date.toISOString()];
      }
      
      try {
        await deleteEmployeePlanning(Number(selectedEmployeeId), dates);
        setModalOpen(false);
        setModalDeleteOpen(false);
        await refreshPlanning();
      } catch (error) {
        console.error("Erreur lors de la suppression de la tâche:", error);
      }
    }
  };

  const cancelDeleteTask = () => setModalDeleteOpen(false);

  return {
    handleSaveTask,
    handleSaveTaskRange,
    handleDeleteTask,
    confirmDeleteTask,
    cancelDeleteTask
  };
}

import { useState, useEffect, useMemo } from "react";
import 'react-calendar/dist/Calendar.css';
import { addDays, startOfWeek, format } from 'date-fns';
import { fetchEmployees } from '../../api/employees';
import { useAuth } from '../../context/AuthProvider';
import ConfirmModal from '../ui/ConfirmModal';
import TaskList from "./TaskList";
import ReactDOM from "react-dom";
import CalendarHeader from './CalendarComponents/CalendarHeader';
import EmployeeSelector from './CalendarComponents/EmployeeSelector';
import MobileCalendarGrid from './CalendarComponents/MobileCalendarGrid';
import DesktopCalendarGrid from './CalendarComponents/DesktopCalendarGrid';
import CalendarSidebar from './CalendarComponents/CalendarSidebar';
import TaskModal from './CalendarComponents/TaskModal';
import usePlanningData from './CalendarComponents/usePlanningData';
import useTouchHandlers from './CalendarComponents/useTouchHandlers';
import useTaskActions from './CalendarComponents/useTaskActions';

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAYS = ["Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam.", "Dim."];

export default function AbsenceCalendar() {
  const { user } = useAuth();
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [weekOffset, setWeekOffset] = useState(0);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [modalSlot, setModalSlot] = useState(null);
  const [taskLabel, setTaskLabel] = useState("");

  useEffect(() => {
    if (user && ["ADMIN", "MANAGER", "RH"].includes(user.role)) {
      setLoadingEmployees(true);
      fetchEmployees()
        .then((emps) => {
          setEmployees(emps);
          setLoadingEmployees(false);
        })
        .catch(() => setLoadingEmployees(false));
    }
  }, [user]);

  useEffect(() => {
    if (user && !selectedEmployeeId) setSelectedEmployeeId(user.id);
  }, [user, selectedEmployeeId]);

  const weekStart = useMemo(
    () => addDays(startOfWeek(calendarDate, { weekStartsOn: 1 }), weekOffset * 7), 
    [calendarDate, weekOffset]
  );
  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), 
    [weekStart]
  );

  const filteredEmployees = employees.filter(e =>
    (e.nom + ' ' + e.prenom).toLowerCase().includes(search.toLowerCase())
  );

  const { 
    events, 
    loadingPlanning, 
    refreshPlanning 
  } = usePlanningData(selectedEmployeeId, weekStart);

  const {
    mobileGridRef,
    handleTouchStart,
    handleTouchEnd,
    handleTouchCancel,
    handleSlotClick,
    handleSlotMouseDown,
    handleSlotMouseEnter,
    handleSlotMouseUp,
    isSlotSelected
  } = useTouchHandlers(setModalOpen, setModalSlot, setTaskLabel);

  const {
    handleSaveTask,
    handleSaveTaskRange,
    handleDeleteTask,
    confirmDeleteTask,
    cancelDeleteTask
  } = useTaskActions(
    modalSlot, 
    taskLabel, 
    selectedEmployeeId, 
    days, 
    setModalOpen, 
    setModalDeleteOpen,
    refreshPlanning
  );

  return (
    <div className="w-full">
      <div className="block lg:hidden">
        <div className="bg-white rounded-2xl shadow-md p-3 mt-2">
          <CalendarHeader 
            weekStart={weekStart} 
            weekOffset={weekOffset} 
            setWeekOffset={setWeekOffset}
            isMobile={true}
          />

          <EmployeeSelector 
            user={user}
            search={search}
            setSearch={setSearch}
            selectedEmployeeId={selectedEmployeeId}
            setSelectedEmployeeId={setSelectedEmployeeId}
            filteredEmployees={filteredEmployees}
            loadingEmployees={loadingEmployees}
            isMobile={true}
          />
          
          <MobileCalendarGrid 
            mobileGridRef={mobileGridRef}
            days={days}
            HOURS={HOURS}
            DAYS={DAYS}
            events={events}
            isSlotSelected={isSlotSelected}
            handleTouchStart={handleTouchStart}
            handleTouchEnd={handleTouchEnd}
            handleTouchCancel={handleTouchCancel}
            handleSlotMouseDown={handleSlotMouseDown}
            handleSlotMouseEnter={handleSlotMouseEnter}
            handleSlotMouseUp={handleSlotMouseUp}
            handleSlotClick={handleSlotClick}
          />
          
          {/* Nous retirons le composant TaskList intégré pour éviter des requêtes API redondantes
              lors du chargement du calendrier. L'utilisateur peut accéder à ses tâches
              depuis l'onglet dédié "Tâches" du dashboard */}
        </div>
      </div>

      <div className="hidden lg:flex flex-col lg:flex-row h-full w-full">
        <CalendarSidebar 
          user={user}
          search={search}
          setSearch={setSearch}
          selectedEmployeeId={selectedEmployeeId}
          setSelectedEmployeeId={setSelectedEmployeeId}
          filteredEmployees={filteredEmployees}
          loadingEmployees={loadingEmployees}
          calendarDate={calendarDate}
          setCalendarDate={setCalendarDate}
          weekStart={weekStart}
          weekOffset={weekOffset}
          setWeekOffset={setWeekOffset}
        />
        
        <main className="w-full lg:flex-1 flex flex-col bg-accent mt-6 lg:mt-0" style={{maxWidth: '100vw', overflowX: 'auto'}}>
          <DesktopCalendarGrid
            days={days}
            HOURS={HOURS}
            DAYS={DAYS}
            events={events}
            isSlotSelected={isSlotSelected}
            handleSlotMouseDown={handleSlotMouseDown}
            handleSlotMouseEnter={handleSlotMouseEnter}
            handleSlotMouseUp={handleSlotMouseUp}
            handleSlotClick={handleSlotClick}
          />
        </main>
      </div>

      <TaskModal 
        modalOpen={modalOpen}
        modalSlot={modalSlot}
        DAYS={DAYS}
        taskLabel={taskLabel}
        setTaskLabel={setTaskLabel}
        setModalOpen={setModalOpen}
        handleDeleteTask={handleDeleteTask}
        handleSaveTask={handleSaveTask}
        handleSaveTaskRange={handleSaveTaskRange}
        confirmDeleteTask={confirmDeleteTask}
      />

      {ReactDOM.createPortal(
        <ConfirmModal
          open={modalDeleteOpen}
          title="Supprimer la tâche ?"
          message="Cette action est irréversible. Voulez-vous vraiment supprimer cette tâche du planning ?"
          onConfirm={confirmDeleteTask}
          onCancel={cancelDeleteTask}
          confirmText="Supprimer"
          cancelText="Annuler"
        />, document.body
      )}
    </div>
  );
}

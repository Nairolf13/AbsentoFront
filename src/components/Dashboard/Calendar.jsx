import React, { useState, useEffect, useMemo } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { addDays, startOfWeek, format, isSameDay } from 'date-fns';
import { fetchEmployees } from '../../api/employees';
import { fetchEmployeePlanning, setEmployeePlanning, deleteEmployeePlanning } from '../../api/planning';
import { useAuth } from '../../context/AuthProvider';
import ConfirmModal from '../ui/ConfirmModal'; // Importez votre composant ConfirmModal
import TaskList from "./TaskList";
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from '@heroicons/react/24/outline';
import ReactDOM from "react-dom";

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAYS = ["Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam.", "Dim."];

export default function AbsenceCalendar() {
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [weekOffset, setWeekOffset] = useState(0);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [search, setSearch] = useState("");
  const { user } = useAuth();

  const [modalOpen, setModalOpen] = useState(false);
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

  const weekStart = useMemo(() => addDays(startOfWeek(calendarDate, { weekStartsOn: 1 }), weekOffset * 7), [calendarDate, weekOffset]);
  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  const filteredEmployees = employees.filter(e =>
    (e.nom + ' ' + e.prenom).toLowerCase().includes(search.toLowerCase())
  );

  const handleSlotClick = (dayIdx, hour) => {
    setModalSlot({ dayIdx, hour });
    setTaskLabel("");
    setModalOpen(true);
  };

  const [events, setEvents] = useState([]);
  const [loadingPlanning, setLoadingPlanning] = useState(false);

  useEffect(() => {
    async function loadPlanning() {
      if (!selectedEmployeeId) return;
      setLoadingPlanning(true);
      try {
        const from = format(weekStart, 'yyyy-MM-dd');
        const to = format(addDays(weekStart, 6), 'yyyy-MM-dd');
        const planning = await fetchEmployeePlanning(selectedEmployeeId, from, to);
        setEvents(
          planning
            .filter(ev => ev.label && ev.label.trim() !== "")
            .map(ev => {
              const d = new Date(ev.date);
              return {
                id: ev.id,
                day: d.getDay() === 0 ? 6 : d.getDay() - 1, 
                hour: d.getHours(),
                label: ev.label,
                color: "bg-primary"
              }
            })
        );
      } catch {
        setEvents([]);
      }
      setLoadingPlanning(false);
    }
    loadPlanning();
  }, [selectedEmployeeId, weekStart]);

  const handleSaveTask = async () => {
    if (modalSlot && taskLabel.trim()) {
      const date = new Date(days[modalSlot.dayIdx]);
      date.setHours(modalSlot.hour, 0, 0, 0);
      await setEmployeePlanning([
        { employeeId: selectedEmployeeId, date: date.toISOString(), label: taskLabel, moment: date.getHours() < 12 ? 'AM' : 'PM' }
      ]);
      setModalOpen(false);
      const from = format(weekStart, 'yyyy-MM-dd');
      const to = format(addDays(weekStart, 6), 'yyyy-MM-dd');
      const planning = await fetchEmployeePlanning(selectedEmployeeId, from, to);
      setEvents(
        planning
          .filter(ev => ev.label && ev.label.trim() !== "")
          .map(ev => {
            const d = new Date(ev.date);
            return {
              id: ev.id,
              day: d.getDay() === 0 ? 6 : d.getDay() - 1,
              hour: d.getHours(),
              label: ev.label,
              color: "bg-primary"
            }
          })
      );
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
      await setEmployeePlanning(slots);
      setModalOpen(false);
      const from = format(weekStart, 'yyyy-MM-dd');
      const to = format(addDays(weekStart, 6), 'yyyy-MM-dd');
      const planning = await fetchEmployeePlanning(selectedEmployeeId, from, to);
      setEvents(
        planning
          .filter(ev => ev.label && ev.label.trim() !== "")
          .map(ev => {
            const d = new Date(ev.date);
            return {
              id: ev.id,
              day: d.getDay() === 0 ? 6 : d.getDay() - 1,
              hour: d.getHours(),
              label: ev.label,
              color: "bg-primary"
            }
          })
      );
    }
  };

  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);

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
      await deleteEmployeePlanning(Number(selectedEmployeeId), dates);
      setModalOpen(false);
      setModalDeleteOpen(false);
      const from = format(weekStart, 'yyyy-MM-dd');
      const to = format(addDays(weekStart, 6), 'yyyy-MM-dd');
      const planning = await fetchEmployeePlanning(selectedEmployeeId, from, to);
      setEvents(
        planning
          .filter(ev => ev.label && ev.label.trim() !== "")
          .map(ev => {
            const d = new Date(ev.date);
            return {
              id: ev.id,
              day: d.getDay() === 0 ? 6 : d.getDay() - 1,
              hour: d.getHours(),
              label: ev.label,
              color: "bg-primary"
            }
          })
      );
    }
  };

  const cancelDeleteTask = () => setModalDeleteOpen(false);

  const [selecting, setSelecting] = useState(false);
  const [rangeStart, setRangeStart] = useState(null); 
  const [rangeEnd, setRangeEnd] = useState(null);

  const touchState = React.useRef({
    selecting: false,
    start: null,
    end: null,
    dayIdx: null,
    startX: 0,
    startY: 0,
  });

  // Gestion appui long pour sélection mobile, compatible multi-heures
  const longPressTimeout = React.useRef(null);
  const longPressTriggered = React.useRef(false);

  const handleTouchStart = (dayIdx, hour) => (e) => {
    if (e.touches.length > 1) return;
    longPressTriggered.current = false;
    longPressTimeout.current = setTimeout(() => {
      longPressTriggered.current = true;
      const touch = e.touches[0];
      document.body.style.overflow = 'hidden';
      touchState.current = {
        selecting: true,
        start: { dayIdx, hour },
        end: { dayIdx, hour },
        dayIdx,
        startX: touch.clientX,
        startY: touch.clientY,
      };
      setSelecting(true);
      setRangeStart({ dayIdx, hour });
      setRangeEnd({ dayIdx, hour });
    }, 400); // 600ms : appui long plus réactif
  };

  const handleTouchMove = (e) => {
    if (e.touches.length > 1) return;
    if (!longPressTriggered.current) {
      // Si on bouge avant 1s, annule la sélection et laisse le scroll natif
      clearTimeout(longPressTimeout.current);
      longPressTimeout.current = null;
      return;
    }
    // Après appui long validé, comportement de sélection multi-heures
    const touch = e.touches[0];
    let el = document.elementFromPoint(touch.clientX, touch.clientY);
    while (el && (!el.getAttribute('data-day') || !el.getAttribute('data-hour')) && el.parentElement) {
      el = el.parentElement;
    }
    if (el && el.getAttribute('data-day') && el.getAttribute('data-hour')) {
      const dayIdx = parseInt(el.getAttribute('data-day'));
      const hour = parseInt(el.getAttribute('data-hour'));
      if (touchState.current.selecting && dayIdx === touchState.current.dayIdx) {
        setRangeEnd({ dayIdx, hour });
        touchState.current.end = { dayIdx, hour };
        e.preventDefault(); // Bloque le scroll dès qu'on glisse dans la colonne
      }
    }
  };

  const handleTouchEnd = (e) => {
    clearTimeout(longPressTimeout.current);
    document.body.style.overflow = '';
    if (touchState.current.selecting && touchState.current.start && touchState.current.end) {
      setSelecting(false);
      const { start, end } = touchState.current;
      if (start.hour === end.hour) {
        setModalSlot({ dayIdx: start.dayIdx, hour: start.hour });
      } else {
        setModalSlot({ dayIdx: start.dayIdx, start: Math.min(start.hour, end.hour), end: Math.max(start.hour, end.hour) });
      }
      setTaskLabel("");
      setTimeout(() => setModalOpen(true), 0);
    }
    setSelecting(false);
    setRangeStart(null);
    setRangeEnd(null);
    touchState.current = { selecting: false, start: null, end: null, dayIdx: null, startX: 0, startY: 0 };
  };

  const handleTouchCancel = (e) => {
    clearTimeout(longPressTimeout.current);
    document.body.style.overflow = '';
    setSelecting(false);
    setRangeStart(null);
    setRangeEnd(null);
    touchState.current = { selecting: false, start: null, end: null, dayIdx: null, startX: 0, startY: 0 };
  };

  // Gestion tactile pour mobile
  const getSlotFromTouch = (e) => {
    // Trouve l'élément cible de la touche (div[data-day][data-hour])
    const touch = e.touches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!el) return null;
    const dayIdx = el.getAttribute('data-day');
    const hour = el.getAttribute('data-hour');
    if (dayIdx !== null && hour !== null) {
      return { dayIdx: parseInt(dayIdx), hour: parseInt(hour) };
    }
    return null;
  };

  // Correction gestion tactile mobile : empêche le scroll et garantit la sélection
  const handleSlotMouseDown = (dayIdx, hour) => {
    setSelecting(true);
    setRangeStart({ dayIdx, hour });
    setRangeEnd({ dayIdx, hour });
  };

  const handleSlotMouseEnter = (dayIdx, hour) => {
    if (selecting && rangeStart && dayIdx === rangeStart.dayIdx) {
      setRangeEnd({ dayIdx, hour });
    }
  };

  const handleSlotMouseUp = () => {
    setSelecting(false);
    if (rangeStart && rangeEnd) {
      setModalSlot({ dayIdx: rangeStart.dayIdx, start: Math.min(rangeStart.hour, rangeEnd.hour), end: Math.max(rangeStart.hour, rangeEnd.hour) });
      setTaskLabel("");
      setTimeout(() => setModalOpen(true), 0); // Force l'ouverture après le render
    } else {
      setModalSlot(null);
      setTaskLabel("");
    }
    setRangeStart(null);
    setRangeEnd(null);
  };

  const isSlotSelected = (dayIdx, hour) => {
    if (!(selecting || touchState.current.selecting) || !(rangeStart || touchState.current.start) || !(rangeEnd || touchState.current.end)) return false;
    const s = selecting ? rangeStart : touchState.current.start;
    const e = selecting ? rangeEnd : touchState.current.end;
    if (!s || !e) return false;
    if (dayIdx !== s.dayIdx) return false;
    const minH = Math.min(s.hour, e.hour);
    const maxH = Math.max(s.hour, e.hour);
    return hour >= minH && hour <= maxH;
  };

  // 1. Ref pour le conteneur de grille mobile
  const mobileGridRef = React.useRef(null);

  // 2. useEffect pour attacher le listener touchmove non passif
  useEffect(() => {
    const grid = mobileGridRef.current;
    if (!grid) return;
    const handleMove = (e) => handleTouchMove(e);
    grid.addEventListener('touchmove', handleMove, { passive: false });
    return () => grid.removeEventListener('touchmove', handleMove);
  }, []);

  return (
    <div className="w-full">
      {/* MOBILE : planning compact, UX++ */}
      <div className="block lg:hidden">
        <div className="bg-white rounded-2xl shadow-md p-3 mt-2">
          {/* Header semaine mobile */}
          <div className="flex items-center justify-between mb-2">
            <button onClick={() => setWeekOffset(weekOffset - 1)} className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary">
              <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <div className="font-semibold text-primary text-base text-center flex-1">
              Semaine du {format(weekStart, 'dd MMM yyyy')}
            </div>
            <button onClick={() => setWeekOffset(weekOffset + 1)} className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary">
              <ChevronRightIcon className="w-6 h-6" />
            </button>
          </div>
          {/* Jours de la semaine (compact, horizontal) */}
          <div className="flex w-full border-b border-accent mb-2">
            {days.map((date, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center py-1 px-0">
                <span className="text-xs font-bold text-secondary">{DAYS[idx]}</span>
                <span className="text-xs text-primary">{format(date, 'dd/MM')}</span>
              </div>
            ))}
          </div>
          {/* Grille planning : une ligne par heure, colonnes jours */}
          <div className="overflow-x-auto" ref={mobileGridRef}>
            <div className="flex flex-col">
              {HOURS.map((h) => (
                <div key={h} className="flex border-b border-accent last:border-0 min-h-[36px]">
                  <div className="w-11 flex items-center justify-center text-xs text-secondary bg-accent/70 font-semibold border-r border-accent">{h}:00</div>
                  {days.map((date, dayIdx) => {
                    const event = events.find(ev => ev.day === dayIdx && ev.hour === h);
                    const selected = isSlotSelected(dayIdx, h);
                    const isAbsence = event && ["MALADIE", "CONGE", "RTT", "AUTRE"].includes(event.label);
                    return (
                      <div
                        key={dayIdx}
                        className={`flex-1 relative cursor-pointer group min-w-[36px] max-w-[48px] flex items-center justify-center ${selected ? 'bg-primary/20' : 'bg-white'} border-r border-accent last:border-0`}
                        data-day={dayIdx}
                        data-hour={h}
                        onTouchStart={handleTouchStart(dayIdx, h)}
                        onTouchEnd={handleTouchEnd}
                        onTouchCancel={handleTouchCancel}
                        onMouseDown={() => handleSlotMouseDown(dayIdx, h)}
                        onMouseEnter={() => handleSlotMouseEnter(dayIdx, h)}
                        onMouseUp={handleSlotMouseUp}
                        onClick={() => handleSlotClick(dayIdx, h)}
                        style={{ minHeight: 36, userSelect: 'none', WebkitUserSelect: 'none' }}
                      >
                        {event ? (
                          isAbsence ? (
                            <span className="block w-full h-full rounded-lg bg-red-400 text-white text-xs font-bold flex items-center justify-center px-1">
                              {event.label}
                            </span>
                          ) : (
                            <span className="block w-full h-full rounded-lg bg-primary text-white text-xs font-semibold flex items-center justify-center px-1">
                              {event.label}
                            </span>
                          )
                        ) : (
                          <button
                            className="opacity-0 group-hover:opacity-100 absolute inset-0 flex items-center justify-center w-full h-full text-primary"
                            style={{ transition: 'opacity 0.2s', userSelect: 'none', WebkitUserSelect: 'none' }}
                            onClick={e => { e.stopPropagation(); handleSlotClick(dayIdx, h); }}
                            tabIndex={-1}
                          >
                            <PlusIcon className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          {/* Bloc tâches sous le planning */}
          <div className="hidden lg:block bg-white rounded-2xl shadow p-4 mt-4">
            <h4 className="text-lg font-semibold text-primary mb-2">Mes tâches</h4>
            <TaskList />
          </div>
        </div>
      </div>
      {/* Desktop : affichage classique en flex-row */}
      <div className="hidden lg:flex flex-col lg:flex-row h-full w-full">
        {/* Sidebar calendrier */}
        <aside className="w-full lg:w-64 bg-white border-r border-secondary flex flex-col items-center py-6">
          <div className="w-full px-2">
            {/* Sélecteur d'employé pour manager/rh/admin */}
            {user && ["ADMIN", "MANAGER", "RH"].includes(user.role) && (
              <div className="mb-4">
                <input
                  type="text"
                  className="w-full mb-2 rounded border px-2 py-1 text-xs"
                  placeholder="Rechercher un employé..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <select
                  className="w-full rounded border px-2 py-1 text-xs"
                  value={selectedEmployeeId || ''}
                  onChange={e => setSelectedEmployeeId(e.target.value)}
                  disabled={loadingEmployees}
                >
                  {filteredEmployees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.nom} {emp.prenom}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {/* Correction : calendarType="iso8601" fonctionne */}
            <div className="w-full">
              <Calendar
                locale="fr-FR"
                value={calendarDate}
                onChange={setCalendarDate}
                calendarType="iso8601"
                className="rounded-xl border-none shadow w-full"
                tileClassName={({ date }) => isSameDay(date, calendarDate) ? "!bg-primary !text-white rounded-full" : ""}
              />
            </div>
          </div>
          <div className="mt-6 w-full px-4">
            <button className="bg-primary text-secondary rounded-xl px-4 py-2 w-full font-semibold mb-2">Aujourd'hui</button>
            <div className="flex justify-between items-center">
              <button onClick={() => setWeekOffset(weekOffset - 1)} className="text-secondary">←</button>
              <span className="font-semibold text-secondary">Semaine du {format(weekStart, 'dd MMM yyyy')}</span>
              <button onClick={() => setWeekOffset(weekOffset + 1)} className="text-secondary">→</button>
            </div>
          </div>
        </aside>
        {/* Vue planning semaine */}
        <main className="w-full lg:flex-1 flex flex-col bg-accent mt-6 lg:mt-0" style={{maxWidth: '100vw', overflowX: 'auto'}}>
          {/* En-têtes jours */}
          <div className="flex border-b border-secondary bg-white min-w-[350px] md:min-w-[600px] lg:min-w-[800px]">
            <div className="w-12 md:w-14 lg:w-16" />
            {days.map((date, idx) => (
              <div key={idx} className="flex-1 py-3 px-2 text-center font-semibold text-secondary border-l border-secondary">
                {DAYS[idx]}<br />{format(date, 'dd/MM')}
              </div>
            ))}
          </div>
          {/* Grille horaires */}
          <div className="flex-1 flex overflow-x-auto select-none min-w-[350px] md:min-w-[600px] lg:min-w-[800px]" onMouseUp={handleSlotMouseUp}>
            {/* Colonne heures */}
            <div className="w-12 md:w-14 lg:w-16 flex flex-col">
              {HOURS.map((h) => (
                <div key={h} className="h-16 flex items-center justify-center text-xs text-secondary border-b border-accent">
                  {h}:00
                </div>
              ))}
            </div>
            {/* Colonnes jours */}
            {days.map((date, dayIdx) => (
              <div key={dayIdx} className="flex-1 flex flex-col border-l border-secondary">
                {HOURS.map((h) => {
                  const event = events.find(ev => ev.day === dayIdx && ev.hour === h);
                  const selected = isSlotSelected(dayIdx, h);
                  const isAbsence = event && ["MALADIE", "CONGE", "RTT", "AUTRE"].includes(event.label);
                  return (
                    <div
                      key={h}
                      data-day={dayIdx}
                      data-hour={h}
                      className={`h-16 relative border-b border-accent cursor-pointer group ${selected ? 'bg-primary/20' : ''}`}
                      onMouseDown={() => handleSlotMouseDown(dayIdx, h)}
                      onMouseEnter={() => handleSlotMouseEnter(dayIdx, h)}
                      onMouseUp={handleSlotMouseUp}
                      onClick={() => handleSlotClick(dayIdx, h)}
                      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                    >
                      {event ? (
                        isAbsence ? (
                          <div className={`absolute inset-1 rounded-lg shadow flex items-center px-2 text-xs font-bold text-white ${"bg-red-400"}`}>
                            {event.label}
                          </div>
                        ) : (
                          <div className={`absolute inset-1 rounded-lg shadow flex items-center px-2 text-xs font-semibold text-white ${event.color}`}>
                            {event.label}
                          </div>
                        )
                      ) : (
                        <div className="absolute inset-1 flex items-center justify-center text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition pointer-events-none select-none">
                          + Ajouter tâche
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          {/* Modal d'édition avec bouton supprimer */}
          {modalOpen && modalSlot && ReactDOM.createPortal(
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center" style={{ zIndex: 9999 }}>
              <div className="bg-white rounded-xl p-6 w-full max-w-xs shadow-lg mx-2">
                <h3 className="text-lg font-semibold mb-4">Assigner ou supprimer une tâche</h3>
                {modalSlot.start !== undefined && modalSlot.end !== undefined ? (
                  <div className="mb-2 text-sm">Jour : <b>{DAYS[modalSlot.dayIdx]}</b> de <b>{modalSlot.start}:00</b> à <b>{modalSlot.end}:00</b></div>
                ) : (
                  <div className="mb-2 text-sm">Jour : <b>{DAYS[modalSlot.dayIdx]}</b> à <b>{modalSlot.hour}:00</b></div>
                )}
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 mb-4"
                  placeholder="Tâche à assigner..."
                  value={taskLabel}
                  onChange={e => setTaskLabel(e.target.value)}
                  autoFocus
                />
                <div className="flex flex-col gap-2 mt-4">
                  <button className="px-4 py-2 rounded bg-gray-200 w-full" onClick={() => setModalOpen(false)}>Annuler</button>
                  <button className="px-4 py-2 rounded bg-red-500 text-white font-semibold w-full" onClick={handleDeleteTask} onTouchEnd={confirmDeleteTask}>Supprimer</button>
                  {modalSlot.start !== undefined && modalSlot.end !== undefined ? (
                    <button className="px-4 py-2 rounded bg-primary text-white font-semibold w-full" onClick={handleSaveTaskRange} disabled={!taskLabel.trim()}>Enregistrer</button>
                  ) : (
                    <button className="px-4 py-2 rounded bg-primary text-white font-semibold w-full" onClick={handleSaveTask} disabled={!taskLabel.trim()}>Enregistrer</button>
                  )}
                </div>
              </div>
            </div>,
            document.body
          )}
          {/* Modal de confirmation suppression */}
          <ConfirmModal
            open={modalDeleteOpen}
            title="Supprimer la tâche ?"
            message="Cette action est irréversible. Voulez-vous vraiment supprimer cette tâche du planning ?"
            onConfirm={confirmDeleteTask}
            onCancel={cancelDeleteTask}
            confirmText="Supprimer"
            cancelText="Annuler"
          />
        </main>
      </div>
    </div>
  );
}

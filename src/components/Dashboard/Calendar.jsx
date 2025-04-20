import React, { useState, useEffect, useMemo } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { addDays, startOfWeek, format, isSameDay } from 'date-fns';
import { fetchEmployees } from '../../api/employees';
import { fetchEmployeePlanning, setEmployeePlanning, deleteEmployeePlanning } from '../../api/planning';
import useAuth from '../../hooks/useAuth';

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAYS = ["Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam.", "Dim."];

export default function AbsenceCalendar() {
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [weekOffset, setWeekOffset] = useState(0);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [search, setSearch] = useState("");
  const { user, token } = useAuth();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalSlot, setModalSlot] = useState(null); // { dayIdx, hour }
  const [taskLabel, setTaskLabel] = useState("");

  // Charger la liste des employés si manager/rh/admin
  useEffect(() => {
    if (user && ["ADMIN", "MANAGER", "RH"].includes(user.role)) {
      setLoadingEmployees(true);
      fetchEmployees(token)
        .then((emps) => {
          setEmployees(emps);
          setLoadingEmployees(false);
        })
        .catch(() => setLoadingEmployees(false));
    }
  }, [user, token]);

  // Sélectionner par défaut l'utilisateur connecté
  useEffect(() => {
    if (user && !selectedEmployeeId) setSelectedEmployeeId(user.id);
  }, [user, selectedEmployeeId]);

  // Calcule le début de la semaine affichée
  const weekStart = useMemo(() => addDays(startOfWeek(calendarDate, { weekStartsOn: 1 }), weekOffset * 7), [calendarDate, weekOffset]);
  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  // Filtrer les employés selon la recherche
  const filteredEmployees = employees.filter(e =>
    (e.nom + ' ' + e.prenom).toLowerCase().includes(search.toLowerCase())
  );

  // Gérer le click sur une case horaire
  const handleSlotClick = (dayIdx, hour) => {
    setModalSlot({ dayIdx, hour });
    setTaskLabel("");
    setModalOpen(true);
  };

  // --- NOUVEAU : Planning persistant ---
  const [events, setEvents] = useState([]);
  const [loadingPlanning, setLoadingPlanning] = useState(false);

  // Charger le planning de l'employé sélectionné à chaque changement
  useEffect(() => {
    async function loadPlanning() {
      if (!selectedEmployeeId) return;
      setLoadingPlanning(true);
      try {
        // On charge la semaine affichée
        const from = format(weekStart, 'yyyy-MM-dd');
        const to = format(addDays(weekStart, 6), 'yyyy-MM-dd');
        const planning = await fetchEmployeePlanning(selectedEmployeeId, from, to, token);
        // Mapping pour affichage
        setEvents(
          planning.map(ev => {
            const d = new Date(ev.date);
            return {
              id: ev.id,
              day: d.getDay() === 0 ? 6 : d.getDay() - 1, // Lundi=0 ...
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
  }, [selectedEmployeeId, weekStart, token]);

  // --- Enregistrer une tâche sur un créneau ---
  const handleSaveTask = async () => {
    if (modalSlot && taskLabel.trim()) {
      const date = new Date(days[modalSlot.dayIdx]);
      date.setHours(modalSlot.hour, 0, 0, 0);
      await setEmployeePlanning([
        { employeeId: selectedEmployeeId, date: date.toISOString(), label: taskLabel, moment: date.getHours() < 12 ? 'AM' : 'PM' }
      ], token);
      setModalOpen(false);
      // Recharge le planning
      const from = format(weekStart, 'yyyy-MM-dd');
      const to = format(addDays(weekStart, 6), 'yyyy-MM-dd');
      const planning = await fetchEmployeePlanning(selectedEmployeeId, from, to, token);
      setEvents(planning.map(ev => {
        const d = new Date(ev.date);
        return {
          id: ev.id,
          day: d.getDay() === 0 ? 6 : d.getDay() - 1,
          hour: d.getHours(),
          label: ev.label,
          color: "bg-primary"
        }
      }));
    }
  };

  // --- Enregistrer une tâche sur une plage ---
  const handleSaveTaskRange = async () => {
    if (modalSlot && taskLabel.trim()) {
      const slots = [];
      for (let h = modalSlot.start; h <= modalSlot.end; h++) {
        const date = new Date(days[modalSlot.dayIdx]);
        date.setHours(h, 0, 0, 0);
        slots.push({ employeeId: selectedEmployeeId, date: date.toISOString(), label: taskLabel, moment: h < 12 ? 'AM' : 'PM' });
      }
      await setEmployeePlanning(slots, token);
      setModalOpen(false);
      const from = format(weekStart, 'yyyy-MM-dd');
      const to = format(addDays(weekStart, 6), 'yyyy-MM-dd');
      const planning = await fetchEmployeePlanning(selectedEmployeeId, from, to, token);
      setEvents(planning.map(ev => {
        const d = new Date(ev.date);
        return {
          id: ev.id,
          day: d.getDay() === 0 ? 6 : d.getDay() - 1,
          hour: d.getHours(),
          label: ev.label,
          color: "bg-primary"
        }
      }));
    }
  };

  // --- Supprimer une tâche sur un créneau ou une plage ---
  const handleDeleteTask = async () => {
    if (modalSlot) {
      let dates = [];
      if (modalSlot.start !== undefined && modalSlot.end !== undefined) {
        // Plage
        for (let h = modalSlot.start; h <= modalSlot.end; h++) {
          const date = new Date(days[modalSlot.dayIdx]);
          date.setHours(h, 0, 0, 0);
          dates.push(date.toISOString());
        }
      } else {
        // Simple créneau
        const date = new Date(days[modalSlot.dayIdx]);
        date.setHours(modalSlot.hour, 0, 0, 0);
        dates = [date.toISOString()];
      }
      await deleteEmployeePlanning(selectedEmployeeId, dates, token);
      setModalOpen(false);
      const from = format(weekStart, 'yyyy-MM-dd');
      const to = format(addDays(weekStart, 6), 'yyyy-MM-dd');
      const planning = await fetchEmployeePlanning(selectedEmployeeId, from, to, token);
      setEvents(planning.map(ev => {
        const d = new Date(ev.date);
        return {
          id: ev.id,
          day: d.getDay() === 0 ? 6 : d.getDay() - 1,
          hour: d.getHours(),
          label: ev.label,
          color: "bg-primary"
        }
      }));
    }
  };

  // Ajout pour sélection de plage horaire
  const [selecting, setSelecting] = useState(false);
  const [rangeStart, setRangeStart] = useState(null); // { dayIdx, hour }
  const [rangeEnd, setRangeEnd] = useState(null);

  // Début sélection
  const handleSlotMouseDown = (dayIdx, hour) => {
    setSelecting(true);
    setRangeStart({ dayIdx, hour });
    setRangeEnd({ dayIdx, hour });
  };
  // Étend la sélection
  const handleSlotMouseEnter = (dayIdx, hour) => {
    if (selecting && rangeStart && dayIdx === rangeStart.dayIdx) {
      setRangeEnd({ dayIdx, hour });
    }
  };
  // Fin sélection
  const handleSlotMouseUp = () => {
    setSelecting(false);
    // Correction : retirer le +1 sur end pour ne pas décaler la sélection
    setModalSlot(
      rangeStart && rangeEnd
        ? { dayIdx: rangeStart.dayIdx, start: Math.min(rangeStart.hour, rangeEnd.hour), end: Math.max(rangeStart.hour, rangeEnd.hour) }
        : null
    );
    setTaskLabel("");
    if (rangeStart && rangeEnd) setModalOpen(true);
    setRangeStart(null);
    setRangeEnd(null);
  };

  // Helper pour savoir si une case est sélectionnée
  const isSlotSelected = (dayIdx, hour) => {
    if (!selecting || !rangeStart || !rangeEnd) return false;
    if (dayIdx !== rangeStart.dayIdx) return false;
    const minH = Math.min(rangeStart.hour, rangeEnd.hour);
    const maxH = Math.max(rangeStart.hour, rangeEnd.hour);
    return hour >= minH && hour <= maxH;
  };

  return (
    <div className="flex h-full w-full">
      {/* Sidebar calendrier */}
      <aside className="w-64 bg-white border-r border-secondary flex flex-col items-center py-6">
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
          <Calendar
            locale="fr-FR"
            value={calendarDate}
            onChange={setCalendarDate}
            calendarType="iso8601"
            className="rounded-xl border-none shadow"
            tileClassName={({ date }) => isSameDay(date, calendarDate) ? "!bg-primary !text-white rounded-full" : ""}
          />
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
      <main className="flex-1 flex flex-col bg-accent">
        {/* En-têtes jours */}
        <div className="flex border-b border-secondary bg-white">
          <div className="w-16" />
          {days.map((date, idx) => (
            <div key={idx} className="flex-1 py-3 px-2 text-center font-semibold text-secondary border-l border-secondary">
              {DAYS[idx]}<br />{format(date, 'dd/MM')}
            </div>
          ))}
        </div>
        {/* Grille horaires */}
        <div className="flex-1 flex overflow-x-auto select-none" onMouseUp={handleSlotMouseUp}>
          {/* Colonne heures */}
          <div className="w-16 flex flex-col">
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
                return (
                  <div
                    key={h}
                    className={`h-16 relative border-b border-accent cursor-pointer group ${selected ? 'bg-primary/20' : ''}`}
                    onMouseDown={() => handleSlotMouseDown(dayIdx, h)}
                    onMouseEnter={() => handleSlotMouseEnter(dayIdx, h)}
                  >
                    {event && (
                      <div className={`absolute inset-1 rounded-lg shadow flex items-center px-2 text-xs font-semibold text-white ${event.color}`}>
                        {event.label}
                      </div>
                    )}
                    {!event && (
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
        {modalOpen && modalSlot && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-80 shadow-lg">
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
                <button className="px-4 py-2 rounded bg-red-500 text-white font-semibold w-full" onClick={handleDeleteTask}>Supprimer</button>
                {modalSlot.start !== undefined && modalSlot.end !== undefined ? (
                  <button className="px-4 py-2 rounded bg-primary text-white font-semibold w-full" onClick={handleSaveTaskRange} disabled={!taskLabel.trim()}>Enregistrer</button>
                ) : (
                  <button className="px-4 py-2 rounded bg-primary text-white font-semibold w-full" onClick={handleSaveTask} disabled={!taskLabel.trim()}>Enregistrer</button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

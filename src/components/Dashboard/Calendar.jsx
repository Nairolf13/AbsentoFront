import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import 'react-calendar/dist/Calendar.css';
import { addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameDay, isSameWeek, isSameMonth, format } from 'date-fns';

const API_URL = import.meta.env.VITE_API_URL;

export default function AbsenceCalendar() {
  const [absences, setAbsences] = useState([]);
  const [replacements, setReplacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [viewMode, setViewMode] = useState('monthly'); // 'daily' | 'weekly' | 'monthly'
  const [calendarDate, setCalendarDate] = useState(new Date());
  const { token } = useAuth();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [a, r] = await Promise.all([
          axios.get(`${API_URL}/absences/mes-absences`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/absences/mes-remplacements`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setAbsences(a.data.absences || []);
        setReplacements(r.data.remplacements || []);
      } catch {
        setAbsences([]); setReplacements([]);
      }
      setLoading(false);
    }
    if (token) fetchData();
  }, [token]);

  const tileClassName = ({ date }) => {
    const isAbsence = absences.find(a => {
      const d = new Date(a.date);
      return d.toDateString() === date.toDateString();
    });
    const isReplacement = replacements.find(r => {
      const d = new Date(r.date);
      return d.toDateString() === date.toDateString();
    });
    if (isAbsence) return "!bg-primary !text-white rounded-full";
    if (isReplacement) return "!bg-accent rounded-full";
    return "";
  };

  const handleDayClick = (date) => {
    setCalendarDate(date);
    setViewMode(viewMode === 'daily' ? 'daily' : viewMode); // force maj date
    const abs = absences.find(a => new Date(a.date).toDateString() === date.toDateString());
    const rep = replacements.find(r => new Date(r.date).toDateString() === date.toDateString());
    if (abs) setSelected({ type: "absence", ...abs });
    else if (rep) setSelected({ type: "replacement", ...rep });
    else setSelected(null);
  };

  // Génère la liste des jours à afficher selon le mode
  let daysToShow = [];
  if (viewMode === 'daily') {
    daysToShow = [calendarDate];
  } else if (viewMode === 'weekly') {
    let start = startOfWeek(calendarDate, { weekStartsOn: 1 });
    for (let i = 0; i < 7; i++) daysToShow.push(addDays(start, i));
  } else if (viewMode === 'monthly') {
    let start = startOfMonth(calendarDate);
    let end = endOfMonth(calendarDate);
    for (let d = start; d <= end; d = addDays(d, 1)) daysToShow.push(new Date(d));
  }

  // Gestion clic sur matin/après-midi
  const handleSlotClick = (date, slot) => {
    // TODO: ouvrir une modal/formulaire pour ajouter une tâche à ce créneau
    alert(`Ajouter une tâche pour le ${format(date, 'EEEE dd/MM/yyyy')} - ${slot === 'am' ? 'Matin' : 'Après-midi'}`);
  };

  return (
    <div className="flex gap-8">
      {/* Colonne calendrier classique */}
      <div className="bg-white rounded-2xl shadow-lg px-6 py-8 w-fit">
        <h3 className="font-semibold text-xl mb-4 text-primary text-center">Mes absences & remplacements</h3>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <span className="loader"></span>
            <span className="ml-2 text-secondary">Chargement…</span>
          </div>
        ) : (
          <Calendar tileClassName={tileClassName} onClickDay={handleDayClick} value={calendarDate} />
        )}
        <div className="flex gap-4 text-xs mt-4 justify-center">
          <span className="inline-block h-2 w-2 bg-primary rounded-full mr-1"></span> Absence
          <span className="inline-block h-2 w-2 bg-accent rounded-full mx-1 border border-primary"></span> Remplacement
        </div>
        <div className="flex gap-2 mt-4 justify-center">
          <button className={`px-3 py-1 rounded ${viewMode === 'daily' ? 'bg-primary text-white' : 'bg-gray-200'}`} onClick={() => setViewMode('daily')}>Jour</button>
          <button className={`px-3 py-1 rounded ${viewMode === 'weekly' ? 'bg-primary text-white' : 'bg-gray-200'}`} onClick={() => setViewMode('weekly')}>Semaine</button>
          <button className={`px-3 py-1 rounded ${viewMode === 'monthly' ? 'bg-primary text-white' : 'bg-gray-200'}`} onClick={() => setViewMode('monthly')}>Mois</button>
        </div>
      </div>
      {/* Colonne vue détaillée */}
      <div className="flex-1 bg-white rounded-2xl shadow-lg px-6 py-8 overflow-auto max-h-[80vh] min-w-[350px]">
        <h3 className="font-semibold text-xl mb-4 text-primary text-center">
          {viewMode === 'daily' && `Détail du ${format(calendarDate, 'EEEE dd/MM/yyyy')}`}
          {viewMode === 'weekly' && `Semaine du ${format(startOfWeek(calendarDate, { weekStartsOn: 1 }), 'dd/MM/yyyy')}`}
          {viewMode === 'monthly' && `Mois de ${format(calendarDate, 'MMMM yyyy')}`}
        </h3>
        {/* Harmonisation de l'affichage pour tous les modes */}
        <div className="overflow-x-auto flex items-stretch gap-4 pb-2" style={{ minHeight: '350px' }}>
          {/* Boutons navigation semaine uniquement pour weekly */}
          {viewMode === 'weekly' && (
            <button
              className="self-center px-2 py-1 bg-gray-200 rounded hover:bg-primary/60 hover:text-white font-bold text-xl"
              onClick={() => setCalendarDate(addDays(startOfWeek(calendarDate, { weekStartsOn: 1 }), -7))}
              title="Semaine précédente"
            >&lt;</button>
          )}
          {daysToShow.map((date, idx) => (
            <div key={idx} className="flex flex-col justify-stretch bg-accent/30 rounded-xl shadow min-w-[260px] max-w-[320px] min-h-[400px] h-full flex-1 border border-primary/20">
              <div className="text-center font-semibold py-2 px-1 bg-accent/60 rounded-t-xl border-b border-primary/10">
                {format(date, 'EEEE dd/MM')}
              </div>
              <div className="flex-1 flex flex-col divide-y divide-primary/20 h-full">
                {/* Matin */}
                <div className="flex-1 flex flex-col items-center justify-center p-2">
                  <div className="font-bold text-xs mb-1">Matin</div>
                  {/* Affichage des tâches/événements du matin ici */}
                  <button className="bg-accent px-2 py-1 rounded hover:bg-primary/70 hover:text-white transition text-xs" onClick={() => handleSlotClick(date, 'am')}>Ajouter</button>
                </div>
                {/* Après-midi */}
                <div className="flex-1 flex flex-col items-center justify-center p-2">
                  <div className="font-bold text-xs mb-1">Après-midi</div>
                  {/* Affichage des tâches/événements de l'après-midi ici */}
                  <button className="bg-accent px-2 py-1 rounded hover:bg-primary/70 hover:text-white transition text-xs" onClick={() => handleSlotClick(date, 'pm')}>Ajouter</button>
                </div>
              </div>
            </div>
          ))}
          {/* Navigation suivante uniquement pour weekly */}
          {viewMode === 'weekly' && (
            <button
              className="self-center px-2 py-1 bg-gray-200 rounded hover:bg-primary/60 hover:text-white font-bold text-xl"
              onClick={() => setCalendarDate(addDays(startOfWeek(calendarDate, { weekStartsOn: 1 }), 7))}
              title="Semaine suivante"
            >&gt;</button>
          )}
        </div>
      </div>
    </div>
  );
}

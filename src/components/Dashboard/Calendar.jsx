import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import 'react-calendar/dist/Calendar.css';

const API_URL = import.meta.env.VITE_API_URL;

export default function AbsenceCalendar() {
  const [absences, setAbsences] = useState([]);
  const [replacements, setReplacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
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
    if (isAbsence) return "bg-primary text-white rounded-full";
    if (isReplacement) return "bg-accent rounded-full";
    return "";
  };

  const handleDayClick = (date) => {
    const abs = absences.find(a => new Date(a.date).toDateString() === date.toDateString());
    const rep = replacements.find(r => new Date(r.date).toDateString() === date.toDateString());
    if (abs) setSelected({ type: "absence", ...abs });
    else if (rep) setSelected({ type: "replacement", ...rep });
    else setSelected(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6 max-w-md mx-auto mt-10">
      <h3 className="font-semibold text-xl mb-4">My Absences & Replacements</h3>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <span className="loader"></span>
          <span className="ml-2 text-secondary">Loading...</span>
        </div>
      ) : (
        <Calendar tileClassName={tileClassName} onClickDay={handleDayClick} />
      )}
      <div className="flex gap-4 text-xs mt-4">
        <span className="inline-block h-2 w-2 bg-primary rounded-full mr-1"></span> Absence
        <span className="inline-block h-2 w-2 bg-accent rounded-full mx-1"></span> Replacement
      </div>
      {selected && (
        <div className="mt-6 p-4 rounded-xl bg-accent/50">
          {selected.type === "absence" ? (
            <>
              <div className="font-semibold mb-1">Absence</div>
              <div>Date: {new Date(selected.date).toLocaleDateString()}</div>
              <div>Type: {selected.typeAbsence || selected.type}</div>
              <div>Reason: {selected.reason}</div>
            </>
          ) : (
            <>
              <div className="font-semibold mb-1">Replacement</div>
              <div>Date: {new Date(selected.date).toLocaleDateString()}</div>
              <div>For: {selected.absentName || selected.for}</div>
            </>
          )}
        </div>
      )}
      <style>{`
        .loader { border: 4px solid #e5e7eb; border-top: 4px solid #2563eb; border-radius: 50%; width: 28px; height: 28px; animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

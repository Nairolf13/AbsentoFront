import React, { useState } from "react";
import Calendar from "./Calendar";
import HistoriqueAbsences from "./HistoriqueAbsences";
import RequestAbsenceForm from "../Absence/RequestAbsenceForm";
import RemplacementSuggestPage from "../../pages/RemplacementSuggest";
import EmployeeDashboardTab from "../Employee/EmployeeDashboardTab";
import TaskList from "./TaskList";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

// Heroicons SVG (outline)
const icons = {
  calendar: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="8" width="18" height="13" rx="2" stroke="currentColor"/><path d="M16 3v4M8 3v4M3 12h18" stroke="currentColor"/></svg>
  ),
  absence: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3" stroke="currentColor"/><circle cx="12" cy="12" r="10" stroke="currentColor"/></svg>
  ),
  remplacement: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4v6h6" stroke="currentColor"/><path d="M20 20v-6h-6" stroke="currentColor"/><path d="M4 20l16-16" stroke="currentColor"/></svg>
  ),
  history: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 9-9" stroke="currentColor"/><path d="M3 3v5h5" stroke="currentColor"/><path d="M12 7v5l4 2" stroke="currentColor"/></svg>
  ),
  users: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" stroke="currentColor"/><circle cx="9" cy="7" r="4" stroke="currentColor"/><path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor"/><path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor"/></svg>
  ),
};

export default function Dashboard() {
  const [tab, setTab] = useState("calendar");
  const navigate = useNavigate();
  const { user } = useAuth();

  // Sidebar items (Absence et Remplacement ajoutés, Notifications retiré)
  const sidebarItems = [
    { key: "calendar", label: "Calendrier", icon: icons.calendar },
    { key: "absence", label: "Absence", icon: icons.absence },
    { key: "remplacement", label: "Remplacement", icon: icons.remplacement },
    { key: "historique", label: "Historique", icon: icons.history },
  ];
  if (user?.role === "ADMIN") {
    sidebarItems.push({ key: "employes", label: "Employés", icon: icons.users });
  }

  return (
    <div className="flex h-screen bg-accent">
      {/* Sidebar */}
      <aside className="w-20 bg-secondary flex flex-col items-center py-6 gap-4">
        {sidebarItems.map((item) => (
          <button
            key={item.key}
            className={`flex flex-col items-center gap-1 text-xs font-semibold rounded-xl px-2 py-3 transition focus:outline-none ${tab === item.key ? "bg-primary text-secondary" : "text-accent hover:bg-primary/20"}`}
            onClick={() => setTab(item.key)}
          >
            <span>{item.icon}</span>
            <span className="mt-1">{item.label}</span>
          </button>
        ))}
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex items-center justify-between px-10 py-6 bg-accent border-b border-secondary">
          <div className="text-2xl font-semibold text-secondary flex items-center gap-2">
            Bonjour
            <span className="font-bold text-primary">
              {user?.prenom ? `${user.prenom} ${user.nom}` : user?.nom || user?.email || "Utilisateur"}
            </span>
          </div>
          <select className="bg-primary px-3 py-1 rounded-xl text-secondary">
            <option>Mon périmètre</option>
          </select>
        </header>

        {/* Stats cards */}
        <div className="flex gap-6 px-10 py-6">
          <div className="flex-1 bg-white rounded-2xl p-6 flex flex-col items-center shadow border border-primary/30">
            <div className="text-3xl font-bold text-secondary">45</div>
            <div className="text-secondary mt-2">Absences probables</div>
          </div>
          <div className="flex-1 bg-white rounded-2xl p-6 flex flex-col items-center shadow border border-primary/30">
            <div className="text-3xl font-bold text-secondary">706</div>
            <div className="text-secondary mt-2">Points d'attention</div>
          </div>
          <div className="flex-1 bg-white rounded-2xl p-6 flex flex-col items-center shadow border border-primary/30">
            <div className="text-3xl font-bold text-secondary">0</div>
            <div className="text-secondary mt-2">Mes tickets ouverts</div>
          </div>
        </div>

        {/* Main grid: demandes + tâches */}
        <div className="flex flex-1 gap-6 px-10 pb-10 min-h-0">
          {/* Demandes à traiter (contenu central) */}
          <section className="flex-1 bg-white rounded-2xl shadow p-6 overflow-y-auto flex flex-col min-h-0">
            {/* Tabs content */}
            {tab === "calendar" && <Calendar />}
            {tab === "absence" && <RequestAbsenceForm />}
            {tab === "remplacement" && <RemplacementSuggestPage />}
            {tab === "historique" && <HistoriqueAbsences />}
            {tab === "employes" && <EmployeeDashboardTab />}
          </section>

          {/* Tâches à faire : affiché UNIQUEMENT sur le calendrier */}
          {tab === "calendar" && (
            <aside className="w-96 bg-white rounded-2xl shadow p-6 flex flex-col">
              <TaskList />
            </aside>
          )}
        </div>
      </main>
    </div>
  );
}

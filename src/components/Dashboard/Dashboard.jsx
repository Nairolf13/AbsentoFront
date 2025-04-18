import React, { useState } from "react";
import Calendar from "./Calendar";
import HistoriqueAbsences from "./HistoriqueAbsences";
import Notifications from "./Notifications";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function Dashboard() {
  const [tab, setTab] = useState("calendar");

  const tabClass = (active) =>
    `flex-1 py-3 rounded-xl font-semibold text-center transition cursor-pointer ${active ? "bg-primary text-white shadow" : "bg-accent text-secondary hover:bg-primary/10"}`;

  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-accent px-2 py-8 flex flex-col items-center">
      <div className="flex w-full max-w-xl gap-2 mb-8">
        <button onClick={() => setTab("calendar")} className={tabClass(tab === "calendar")}>Calendrier</button>
        <button onClick={() => setTab("historique")} className={tabClass(tab === "historique")}>Historique</button>
        <button onClick={() => setTab("notifications")} className={tabClass(tab === "notifications")}>Notifications</button>
        {user?.role === "ADMIN" && (
          <button
            onClick={() => navigate("/admin/employes")}
            className="flex-1 py-3 rounded-xl font-semibold text-center transition cursor-pointer bg-secondary text-white hover:bg-secondary/80 shadow"
          >
            Employés
          </button>
        )}
      </div>
      <div className="w-full max-w-xl">
        {tab === "calendar" && <Calendar />}
        {tab === "historique" && <HistoriqueAbsences />}
        {tab === "notifications" && <Notifications />}
      </div>
    </div>
  );
}

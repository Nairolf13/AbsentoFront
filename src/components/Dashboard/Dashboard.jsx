import React, { useState } from "react";
import Calendar from "./Calendar";
import HistoriqueAbsences from "./HistoriqueAbsences";
import Notifications from "./Notifications";

export default function Dashboard() {
  const [tab, setTab] = useState("calendar");

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        <button onClick={() => setTab("calendar")} style={{ fontWeight: tab === "calendar" ? "bold" : "normal" }}>Calendrier</button>
        <button onClick={() => setTab("historique")} style={{ fontWeight: tab === "historique" ? "bold" : "normal" }}>Historique</button>
        <button onClick={() => setTab("notifications")} style={{ fontWeight: tab === "notifications" ? "bold" : "normal" }}>Notifications</button>
      </div>
      <div>
        {tab === "calendar" && <Calendar />}
        {tab === "historique" && <HistoriqueAbsences />}
        {tab === "notifications" && <Notifications />}
      </div>
    </div>
  );
}

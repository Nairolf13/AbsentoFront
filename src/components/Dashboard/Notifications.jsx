import React, { useEffect, useState } from "react";
import useSocket from "../../hooks/useSocket";

export default function Notifications() {
  const [notifications, setNotifications] = useState([
    // Notifications initiales (optionnel)
  ]);

  useSocket((event, payload) => {
    if (event === "nouveau_remplacement") {
      setNotifications(n => [
        { text: "Un remplaçant a été assigné à votre absence." },
        ...n
      ]);
    }
    if (event === "remplacement_valide") {
      setNotifications(n => [
        { text: "Votre demande d'absence a été validée." },
        ...n
      ]);
    }
    if (event === "remplacement_refuse") {
      setNotifications(n => [
        { text: "Une demande de remplacement a été refusée." },
        ...n
      ]);
    }
  });

  return (
    <div className="bg-white rounded-2xl shadow-lg px-8 py-10 w-full max-w-xs mx-auto">
      <h4 className="font-semibold text-xl mb-4 text-primary text-center">Notifications</h4>
      <ul className="divide-y divide-accent">
        {notifications.map((n, i) => (
          <li key={i} className="py-3 flex items-center gap-3">
            <span className="h-2 w-2 bg-primary rounded-full"></span>
            <span className="text-sm text-gray-700">{n.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

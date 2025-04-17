import React, { useEffect, useState } from "react";
import useSocket from "../../hooks/useSocket";

export default function Notifications() {
  const [notifications, setNotifications] = useState([
    // Notifications initiales (optionnel)
  ]);

  useSocket((event, payload) => {
    if (event === "nouveau_remplacement") {
      setNotifications(n => [
        { text: "A replacement has assigned for your absent shift." },
        ...n
      ]);
    }
    if (event === "remplacement_valide") {
      setNotifications(n => [
        { text: "Your absence request has been approved." },
        ...n
      ]);
    }
    if (event === "remplacement_refuse") {
      setNotifications(n => [
        { text: "A replacement request has been refused." },
        ...n
      ]);
    }
  });

  return (
    <div className="bg-white rounded-2xl shadow p-6 max-w-xs mx-auto mt-10">
      <h4 className="font-semibold mb-4">Notifications</h4>
      <ul>
        {notifications.map((n, i) => (
          <li key={i} className="mb-3 flex items-center">
            <span className="h-2 w-2 bg-primary rounded-full mr-2"></span>
            <span className="text-sm">{n.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

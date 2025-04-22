import React from "react";
import TaskList from "../components/Dashboard/TaskList";

export default function MesTaches() {
  return (
    <div className="w-full h-full flex flex-col">
      <h2 className="text-2xl font-bold text-primary mb-6">Mes tâches</h2>
      <TaskList />
    </div>
  );
}

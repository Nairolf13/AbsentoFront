import React from "react";
import EmployeeAdmin from "./EmployeeAdmin";

export default function EmployeeDashboardTab() {
  // On encapsule EmployeeAdmin pour usage comme "onglet" dans le Dashboard
  return (
    <div className="h-full w-full">
      <EmployeeAdmin />
    </div>
  );
}

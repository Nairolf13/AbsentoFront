import { useState, useMemo } from "react";

export default function EmployeeSelector({ employees, selectedUserId, onUserSelected }) {
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredEmployees = useMemo(() => {
    if (!search) return employees;
    return employees.filter(
      (emp) =>
        emp.prenom.toLowerCase().includes(search.toLowerCase()) ||
        emp.nom.toLowerCase().includes(search.toLowerCase())
    );
  }, [employees, search]);

  const handleEmployeeClick = (emp) => {
    onUserSelected(emp.id);
    setSearch(`${emp.prenom} ${emp.nom}`);
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        className="rounded-xl border border-primary/30 px-3 py-2 text-sm mb-2 w-full"
        placeholder="À qui ? (tapez le prénom ou le nom)"
        value={search}
        onChange={e => {
          setSearch(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
      />
      
      {showDropdown && search && (
        <div className="absolute z-10 w-full bg-white border border-primary/30 rounded-xl shadow max-h-56 overflow-y-auto">
          {filteredEmployees.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-400">Aucun employé</div>
          ) : (
            filteredEmployees.map(emp => (
              <div
                key={emp.id}
                className={`px-3 py-2 text-sm cursor-pointer hover:bg-primary/10 ${String(selectedUserId) === String(emp.id) ? 'bg-primary/10 font-bold' : ''}`}
                onClick={() => handleEmployeeClick(emp)}
              >
                {emp.prenom} {emp.nom}
              </div>
            ))
          )}
        </div>
      )}
      
      <button
        type="button"
        className="absolute top-1 right-2 text-gray-400 hover:text-primary text-lg"
        tabIndex={-1}
        aria-label="Afficher toute la liste"
        onClick={() => {
          setShowDropdown(v => !v);
          setSearch("");
        }}
      >▼</button>
      
      {showDropdown && !search && (
        <div className="absolute z-10 w-full bg-white border border-primary/30 rounded-xl shadow max-h-56 overflow-y-auto">
          {employees.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-400">Aucun employé</div>
          ) : (
            employees.map(emp => (
              <div
                key={emp.id}
                className={`px-3 py-2 text-sm cursor-pointer hover:bg-primary/10 ${String(selectedUserId) === String(emp.id) ? 'bg-primary/10 font-bold' : ''}`}
                onClick={() => handleEmployeeClick(emp)}
              >
                {emp.prenom} {emp.nom}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

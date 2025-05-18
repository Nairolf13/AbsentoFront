export default function EmployeeSelector({ 
  user, 
  search, 
  setSearch,
  selectedEmployeeId,
  setSelectedEmployeeId,
  filteredEmployees,
  loadingEmployees,
  isMobile = false
}) {
  if (!user || !["ADMIN", "MANAGER", "RH"].includes(user.role)) return null;
  
  return (
    <div className={isMobile ? "mb-2 flex flex-col items-center" : "mb-4"}>
      <input
        type="text"
        className={isMobile 
          ? "mb-2 rounded border px-2 py-1 text-xs max-w-xs w-full"
          : "w-full mb-2 rounded border px-2 py-1 text-xs"
        }
        placeholder="Rechercher un employé..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={isMobile ? {maxWidth: 320} : {}}
      />
      <select
        className={isMobile 
          ? "rounded border px-2 py-1 text-xs max-w-xs w-full"
          : "w-full rounded border px-2 py-1 text-xs"
        }
        value={selectedEmployeeId || ''}
        onChange={e => setSelectedEmployeeId(e.target.value)}
        disabled={loadingEmployees}
        style={isMobile ? {maxWidth: 320} : {}}
      >
        {filteredEmployees.map(emp => (
          <option key={emp.id} value={emp.id}>
            {emp.nom} {emp.prenom}
          </option>
        ))}
      </select>
    </div>
  );
}

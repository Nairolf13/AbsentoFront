import React, { useState, useMemo } from "react";

export default function AddTaskModal({ open, onClose, onAdd, employees = [], isManager }) {
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredEmployees = useMemo(() => {
    if (!search) return employees;
    return employees.filter(
      (emp) =>
        emp.prenom.toLowerCase().includes(search.toLowerCase()) ||
        emp.nom.toLowerCase().includes(search.toLowerCase())
    );
  }, [employees, search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Le titre est requis");
      return;
    }
    setLoading(true);
    setError("");
    const res = await onAdd({ title, userId: isManager ? selectedUserId : undefined });
    if (res && res.error) setError(res.error); // Affiche l'erreur backend si présente
    else {
      setTitle("");
      setSelectedUserId("");
      setSearch("");
      onClose();
    }
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-primary text-xl"
          onClick={onClose}
        >
          ×
        </button>
        <div className="font-semibold text-secondary mb-4">Créer une tâche</div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            className="rounded-xl border border-primary/30 px-3 py-2 text-sm"
            placeholder="Titre de la tâche"
            value={title}
            onChange={e => setTitle(e.target.value)}
            autoFocus
          />
          {isManager && (
            <div>
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
                {/* Suggestion/autocomplete list when typing */}
                {showDropdown && search && (
                  <div className="absolute z-10 w-full bg-white border border-primary/30 rounded-xl shadow max-h-56 overflow-y-auto">
                    {filteredEmployees.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-gray-400">Aucun employé</div>
                    ) : (
                      filteredEmployees.map(emp => (
                        <div
                          key={emp.id}
                          className={`px-3 py-2 text-sm cursor-pointer hover:bg-primary/10 ${String(selectedUserId) === String(emp.id) ? 'bg-primary/10 font-bold' : ''}`}
                          onClick={() => {
                            setSelectedUserId(emp.id);
                            setSearch(`${emp.prenom} ${emp.nom}`);
                            setShowDropdown(false);
                          }}
                        >
                          {emp.prenom} {emp.nom}
                        </div>
                      ))
                    )}
                  </div>
                )}
                {/* Dropdown button for full list */}
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
                {/* If dropdown open and no search, show full employee list */}
                {showDropdown && !search && (
                  <div className="absolute z-10 w-full bg-white border border-primary/30 rounded-xl shadow max-h-56 overflow-y-auto">
                    {employees.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-gray-400">Aucun employé</div>
                    ) : (
                      employees.map(emp => (
                        <div
                          key={emp.id}
                          className={`px-3 py-2 text-sm cursor-pointer hover:bg-primary/10 ${String(selectedUserId) === String(emp.id) ? 'bg-primary/10 font-bold' : ''}`}
                          onClick={() => {
                            setSelectedUserId(emp.id);
                            setSearch(`${emp.prenom} ${emp.nom}`);
                            setShowDropdown(false);
                          }}
                        >
                          {emp.prenom} {emp.nom}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          {error && <div className="text-red-500 text-xs">{error}</div>}
          <button
            type="submit"
            className="bg-primary text-secondary rounded-xl px-4 py-2 font-semibold mt-2"
            disabled={loading}
          >
            Ajouter
          </button>
        </form>
      </div>
    </div>
  );
}

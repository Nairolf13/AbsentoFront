import { useState } from "react";
import EmployeeSelector from "./EmployeeSelector";

export default function TaskForm({ onAdd, onClose, employees = [], isManager }) {
  const [title, setTitle] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Le titre est requis");
      return;
    }
    setLoading(true);
    setError("");
    const res = await onAdd({ title, userId: isManager ? selectedUserId : undefined });
    if (res && res.error) setError(res.error); 
    else {
      setTitle("");
      setSelectedUserId("");
      onClose();
    }
    setLoading(false);
  };

  const handleUserSelected = (userId) => {
    setSelectedUserId(userId);
  };

  return (
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
        <EmployeeSelector 
          employees={employees} 
          selectedUserId={selectedUserId}
          onUserSelected={handleUserSelected}
        />
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
  );
}

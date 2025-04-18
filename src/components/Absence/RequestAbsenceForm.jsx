import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { requestAbsence } from "../../api/absento";

export default function RequestAbsenceForm() {
  const [date, setDate] = useState("");
  const [heureDebut, setHeureDebut] = useState("");
  const [heureFin, setHeureFin] = useState("");
  const [type, setType] = useState("");
  const [motif, setMotif] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      await requestAbsence({ date, heureDebut, heureFin, type, motif }, token);
      setSuccess("Demande d'absence envoyée !");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Erreur lors de la soumission");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-accent">
      <div className="bg-white rounded-2xl shadow-lg px-8 py-10 w-full max-w-md mx-auto flex flex-col items-center">
        <h3 className="font-semibold text-2xl mb-6 text-primary text-center">Déclarer une absence</h3>
        <form onSubmit={handleSubmit} className="space-y-4 w-full flex flex-col items-center">
          <div className="w-full">
            <label className="block mb-1 text-secondary text-center">Date</label>
            <input type="date" className="block w-full rounded-xl border border-primary px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700" value={date} onChange={e => setDate(e.target.value)} required />
          </div>
          <div className="flex gap-4 w-full">
            <div className="flex-1">
              <label className="block mb-1 text-secondary text-center">Heure début</label>
              <input type="time" className="block w-full rounded-xl border border-primary px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700" value={heureDebut} onChange={e => setHeureDebut(e.target.value)} required />
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-secondary text-center">Heure fin</label>
              <input type="time" className="block w-full rounded-xl border border-primary px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700" value={heureFin} onChange={e => setHeureFin(e.target.value)} required />
            </div>
          </div>
          <div className="w-full">
            <label className="block mb-1 text-secondary text-center">Type</label>
            <select className="block w-full rounded-xl border border-primary px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700" value={type} onChange={e => setType(e.target.value)} required>
              <option value="">Type</option>
              <option value="CONGE">Congé</option>
              <option value="MALADIE">Maladie</option>
              <option value="RTT">RTT</option>
              <option value="AUTRE">Autre</option>
            </select>
          </div>
          <div className="w-full">
            <label className="block mb-1 text-secondary text-center">Motif</label>
            <textarea className="block w-full rounded-xl border border-primary px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700" rows={2} value={motif} onChange={e => setMotif(e.target.value)} />
          </div>
          <button className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/80 transition" type="submit">Envoyer</button>
          {success && <div className="text-xs text-green-600 text-center mt-2 w-full">{success}</div>}
          {error && <div className="text-xs text-red-500 text-center mt-2 w-full">{error}</div>}
        </form>
      </div>
    </div>
  );
}

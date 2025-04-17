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
    console.log('Token utilisé pour la déclaration d\'absence:', token);
    try {
      await requestAbsence({ date, heureDebut, heureFin, type, motif }, token);
      setSuccess("Absence request submitted!");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
        console.error('Erreur backend:', err.response.data.message);
        if (err.response.data.body) {
          console.error('Body reçu par le backend:', err.response.data.body);
        }
      } else {
        setError("Error submitting absence");
        console.error('Erreur inconnue:', err);
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6 max-w-md mx-auto mt-10">
      <h3 className="font-semibold text-xl mb-4">Request Absence</h3>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">Date</label>
        <input type="date" className="input mb-4" value={date} onChange={e => setDate(e.target.value)} />
        <label className="block mb-2">Heure début</label>
        <input type="time" className="input mb-4" value={heureDebut} onChange={e => setHeureDebut(e.target.value)} />
        <label className="block mb-2">Heure fin</label>
        <input type="time" className="input mb-4" value={heureFin} onChange={e => setHeureFin(e.target.value)} />
        <label className="block mb-2">Type</label>
        <select className="input mb-4" value={type} onChange={e => setType(e.target.value)}>
          <option value="">Type</option>
          <option value="CONGE">Leave</option>
          <option value="MALADIE">Sick</option>
          <option value="RTT">RTT</option>
          <option value="AUTRE">Other</option>
        </select>
        <label className="block mb-2">Motif</label>
        <textarea className="input mb-4" rows={2} value={motif} onChange={e => setMotif(e.target.value)} />
        <button className="btn-primary w-full" type="submit">Submit</button>
        {success && <div className="text-xs text-green-600 mt-2 text-center">{success}</div>}
        {error && <div className="text-xs text-red-500 mt-2 text-center">{error}</div>}
      </form>
    </div>
  );
}

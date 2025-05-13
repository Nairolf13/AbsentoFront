import React, { useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { requestAbsence } from "../../api/absento";
import { useNavigate } from "react-router-dom";

export default function RequestAbsenceForm() {
  const [dateDebut, setDateDebut] = useState("");
  const [heureDebut, setHeureDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [heureFin, setHeureFin] = useState("");
  const [type, setType] = useState("");
  const [motif, setMotif] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [justificatif, setJustificatif] = useState(null);
  const [fileLabel, setFileLabel] = useState("Aucun fichier choisi");
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      await requestAbsence({ dateDebut, heureDebut, dateFin, heureFin, type, motif, justificatif }, token);
      setSuccess("Demande d'absence envoyée !");
      window.dispatchEvent(new CustomEvent("refreshAbsenceCounter"));
      setTimeout(() => {
        navigate("/dashboard", { replace: true, state: { openTab: "calendar", showAbsenceNotif: true } });
      }, 800);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Erreur lors de la soumission");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-accent py-4 px-0 sm:px-4">
      <div className="bg-white rounded-2xl shadow-lg px-2 py-4 sm:px-8 sm:py-10 w-full max-w-md mx-auto flex flex-col items-center">
        <h3 className="font-semibold text-xl sm:text-2xl mb-4 sm:mb-6 text-primary text-center">Déclarer une absence</h3>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 w-full flex flex-col items-center">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
            <div className="w-full sm:w-1/2">
              <label className="block mb-1 text-secondary text-center text-xs sm:text-sm">Date de début</label>
              <div className="relative">
                <input type="date" className="block w-full rounded-xl border border-primary px-3 py-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700 text-xs sm:text-base appearance-none bg-white pr-10" value={dateDebut} onChange={e => setDateDebut(e.target.value)} required />
                {/* Icône calendrier unique, supprimée dupliquée par Chrome/OS */}
                {/* <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </span> */}
              </div>
              <label className="block mt-1 mb-1 text-secondary text-center text-xs sm:text-sm">Heure de début</label>
              <div className="relative">
                <input type="time" className="block w-full rounded-xl border border-primary px-3 py-2 pr-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700 text-xs sm:text-base appearance-none bg-white" value={heureDebut} onChange={e => setHeureDebut(e.target.value)} required />
                {/* Icône horloge unique, supprimée dupliquée par Chrome/OS */}
                {/* <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </span> */}
              </div>
            </div>
            <div className="w-full sm:w-1/2">
              <label className="block mb-1 text-secondary text-center text-xs sm:text-sm">Date de fin</label>
              <div className="relative">
                <input type="date" className="block w-full rounded-xl border border-primary px-3 py-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700 text-xs sm:text-base appearance-none bg-white pr-10" value={dateFin} onChange={e => setDateFin(e.target.value)} required />
                {/* Icône calendrier unique, supprimée dupliquée par Chrome/OS */}
                {/* <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </span> */}
              </div>
              <label className="block mt-1 mb-1 text-secondary text-center text-xs sm:text-sm">Heure de fin</label>
              <div className="relative">
                <input type="time" className="block w-full rounded-xl border border-primary px-3 py-2 pr-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700 text-xs sm:text-base appearance-none bg-white" value={heureFin} onChange={e => setHeureFin(e.target.value)} required />
                {/* Icône horloge unique, supprimée dupliquée par Chrome/OS */}
                {/* <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </span> */}
              </div>
            </div>
          </div>
          <div className="w-full">
            <label className="block mb-1 text-secondary text-center text-xs sm:text-sm">Type</label>
            <select className="block w-full rounded-xl border border-primary px-3 py-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700 text-xs sm:text-base" value={type} onChange={e => setType(e.target.value)} required>
              <option value="">Type</option>
              <option value="CONGE">Congé</option>
              <option value="MALADIE">Maladie</option>
              <option value="RTT">RTT</option>
              <option value="AUTRE">Autre</option>
            </select>
          </div>
          <div className="w-full">
            <label className="block mb-1 text-secondary text-center text-xs sm:text-sm">Motif</label>
            <textarea className="block w-full rounded-xl border border-primary px-3 py-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700 text-xs sm:text-base" rows={2} value={motif} onChange={e => setMotif(e.target.value)} />
          </div>
          <div className="w-full">
            <label className="block mb-1 text-secondary text-center text-xs sm:text-sm">Justificatif (PDF ou photo)</label>
            <label className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 border border-primary rounded-xl cursor-pointer bg-primary/10 hover:bg-primary/20 transition text-primary font-semibold">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              <span className="truncate max-w-[120px] sm:max-w-[200px]">{fileLabel}</span>
              <input
                type="file"
                accept="application/pdf,image/*"
                className="hidden"
                onChange={e => {
                  setJustificatif(e.target.files[0]);
                  setFileLabel(e.target.files[0] ? e.target.files[0].name : "Aucun fichier choisi");
                }}
              />
            </label>
          </div>
          <button className="w-full bg-primary text-white font-bold py-2 sm:py-3 rounded-xl hover:bg-primary/80 transition text-base sm:text-lg mt-1" type="submit">Envoyer</button>
          {success && <div className="text-xs text-green-600 text-center mt-2 w-full">{success}</div>}
          {error && <div className="text-xs text-red-500 text-center mt-2 w-full">{error}</div>}
        </form>
      </div>
    </div>
  );
}

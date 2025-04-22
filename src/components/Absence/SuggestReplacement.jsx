import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { getReplacements, assignReplacement, refuseReplacement } from "../../api/absento";

export default function SuggestReplacement() {
  const [replacements, setReplacements] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getReplacements(token);
        setReplacements(data.replacements || []);
      } catch {
        setReplacements([]);
      }
    }
    if (token) fetchData();
  }, [token]);

  const handleAssign = async (remplacementId) => {
    setError(""); setSuccess("");
    try {
      await assignReplacement(remplacementId, token);
      setSuccess("Remplaçant assigné et validé !");
    } catch {
      setError("Erreur lors de l'assignation");
    }
  };

  const handleRefuse = async (remplacementId) => {
    setError(""); setSuccess("");
    try {
      await refuseReplacement(remplacementId, token);
      setSuccess("Remplacement refusé.");
    } catch {
      setError("Erreur lors du refus");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#e7f5f9] to-[#e3f5ec] px-2 py-6">
      <div className="w-full max-w-md flex flex-col gap-6">
        <div className="rounded-3xl bg-white shadow-lg px-6 py-7 flex flex-col items-center">
          <h3 className="font-bold text-2xl mb-2 text-gradient bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-center">Suggestion de remplaçants</h3>
          <div className="mb-5 text-secondary text-center w-full text-sm">Voici les remplaçants disponibles selon vos critères.</div>
          <ul className="flex flex-col gap-4 w-full">
            {replacements.map((r, i) => (
              <li key={i} className="rounded-2xl bg-[#f5fafc] shadow flex flex-col gap-3 px-4 py-4">
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-base text-gray-800 break-words max-w-full">{r.name}</span>
                  <div className="text-xs text-secondary">{r.role}</div>
                  <span className="text-xs text-gray-500">{r.when}</span>
                </div>
                {r.remplacementId && (
                  <div className="flex flex-col sm:flex-row gap-2 w-full mt-2">
                    <button className="w-full sm:w-auto bg-primary text-white rounded-xl px-4 py-2 text-xs font-semibold hover:bg-primary/80 transition" onClick={() => handleAssign(r.remplacementId)}>Assigner</button>
                    <button className="w-full sm:w-auto bg-secondary text-white rounded-xl px-4 py-2 text-xs font-semibold hover:bg-secondary/80 transition" onClick={() => handleRefuse(r.remplacementId)}>Refuser</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
          {success && <div className="text-xs text-green-600 text-center mt-4 w-full">{success}</div>}
          {error && <div className="text-xs text-red-500 text-center mt-4 w-full">{error}</div>}
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
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
    <div className="min-h-screen flex items-center justify-center bg-accent">
      <div className="bg-white rounded-2xl shadow-lg px-8 py-10 w-full max-w-md mx-auto flex flex-col items-center">
        <h3 className="font-semibold text-2xl mb-6 text-primary text-center">Suggestion de remplaçants</h3>
        <div className="mb-4 text-secondary text-center w-full">Voici les remplaçants disponibles selon vos critères.</div>
        <ul className="divide-y divide-accent w-full">
          {replacements.map((r, i) => (
            <li key={i} className="flex flex-col md:flex-row md:justify-between md:items-center py-4 w-full">
              <div>
                <span className="font-medium text-base text-gray-800">{r.name}</span>
                <div className="text-xs text-secondary">{r.role}</div>
              </div>
              <span className="text-xs text-gray-500 mt-2 md:mt-0">{r.when}</span>
              {r.remplacementId && (
                <div className="flex mt-2 md:mt-0 md:ml-4 gap-2">
                  <button className="bg-primary text-white rounded-xl px-4 py-2 text-xs font-semibold hover:bg-primary/80 transition" onClick={() => handleAssign(r.remplacementId)}>Assigner</button>
                  <button className="bg-secondary text-white rounded-xl px-4 py-2 text-xs font-semibold hover:bg-secondary/80 transition" onClick={() => handleRefuse(r.remplacementId)}>Refuser</button>
                </div>
              )}
            </li>
          ))}
        </ul>
        {success && <div className="text-xs text-green-600 text-center mt-4 w-full">{success}</div>}
        {error && <div className="text-xs text-red-500 text-center mt-4 w-full">{error}</div>}
      </div>
    </div>
  );
}

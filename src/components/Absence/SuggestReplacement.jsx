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
      setSuccess("Replacement assigned and validated!");
    } catch {
      setError("Error assigning replacement");
    }
  };

  const handleRefuse = async (remplacementId) => {
    setError(""); setSuccess("");
    try {
      await refuseReplacement(remplacementId, token);
      setSuccess("Replacement refused.");
    } catch {
      setError("Error refusing replacement");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6 max-w-md mx-auto mt-10">
      <h3 className="font-semibold text-xl mb-4">Suggest Replacement</h3>
      <div className="mb-4 text-secondary">A replacement has been generated based on the defined criteria.</div>
      <ul>
        {replacements.map((r, i) => (
          <li key={i} className="flex justify-between items-center p-2 border-b last:border-b-0">
            <div>
              <span className="font-medium">{r.name}</span>
              <div className="text-xs text-secondary">{r.role}</div>
            </div>
            <span className="text-xs">{r.when}</span>
            {r.remplacementId && (
              <>
                <button className="btn-primary ml-4" onClick={() => handleAssign(r.remplacementId)}>Assign</button>
                <button className="btn-secondary ml-2" onClick={() => handleRefuse(r.remplacementId)}>Refuse</button>
              </>
            )}
          </li>
        ))}
      </ul>
      {success && <div className="text-xs text-green-600 mt-4 text-center">{success}</div>}
      {error && <div className="text-xs text-red-500 mt-4 text-center">{error}</div>}
    </div>
  );
}

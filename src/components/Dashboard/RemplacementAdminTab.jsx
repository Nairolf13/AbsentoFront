import React, { useEffect, useState } from "react";
import { getAbsencesSansRemplacant } from "../../api/absento";
import { useAuth } from "../../context/AuthProvider";

export default function RemplacementAdminTab() {
  const { user } = useAuth();
  const [absences, setAbsences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getAbsencesSansRemplacant()
      .then(setAbsences)
      .catch((err) => {
        console.error("Erreur lors du chargement des absences:", err);
        setError("Erreur lors du chargement des absences.");
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (!user || (user.role !== "ADMIN" && user.role !== "MANAGER")) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg px-8 py-10 w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-primary text-center">
        Absences sans remplaçant
      </h2>
      {loading ? (
        <div className="text-center">Chargement…</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : absences.length === 0 ? (
        <div className="text-center text-secondary">Aucune absence à traiter.</div>
      ) : (
        <ul className="divide-y divide-accent mb-6">
          {absences.map((a) => (
            <li key={a.id} className="flex items-center justify-between py-3">
              <div>
                {a.employee ? (
                  <>
                    <span className="font-semibold">{a.employee.nom} {a.employee.prenom}</span> <span className="text-secondary text-xs">({a.employee.poste})</span>
                  </>
                ) : (
                  <span className="italic text-gray-400">Aucun employé associé</span>
                )}
                <span className="ml-2 text-xs text-gray-400">{a.date ? a.date : a.startDate ? new Date(a.startDate).toLocaleDateString() : ''}</span>
              </div>
              {/* Bouton pour choisir un remplaçant, navigation à implémenter si besoin */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

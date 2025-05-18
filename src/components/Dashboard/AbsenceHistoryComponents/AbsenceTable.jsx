import { statusColors } from './utils';
import { formatDate, formatTime } from './utils';

export default function AbsenceTable({ absences, user, onValidate, onRefuse, onModify, onDelete, onShowJustificatif }) {
  const hasAdminRights = user?.role === "ADMIN" || user?.role === "RH" || user?.role === "MANAGER";

  return (
    <div className="w-full overflow-x-auto hidden sm:block">
      <table className="w-full bg-white border border-gray-200 rounded-xl text-xs sm:text-sm text-center">
        <thead>
          <tr className="bg-accent text-secondary">
            <th className="py-2 px-1 sm:px-3">Date</th>
            <th className="py-2 px-1 sm:px-3">Début</th>
            <th className="py-2 px-1 sm:px-3">Fin</th>
            <th className="py-2 px-1 sm:px-3">Type</th>
            <th className="py-2 px-1 sm:px-3">Motif</th>
            <th className="py-2 px-1 sm:px-3">Statut</th>
            <th className="py-2 px-1 sm:px-3">Remplaçant</th>
            <th className="py-2 px-1 sm:px-3">Justificatif</th>
            {hasAdminRights && <th className="py-2 px-1 sm:px-3">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {absences.map((a) => (
            <tr key={a.id} className="border-b last:border-b-0 hover:bg-accent/40 transition">
              <td className="py-2 px-1 sm:px-3 whitespace-nowrap">{formatDate(a.startDate)}</td>
              <td className="py-2 px-1 sm:px-3 whitespace-nowrap">{formatTime(a.startDate)}</td>
              <td className="py-2 px-1 sm:px-3 whitespace-nowrap">{formatTime(a.endDate)}</td>
              <td className="py-2 px-1 sm:px-3 whitespace-nowrap">{a.type}</td>
              <td className="py-2 px-1 sm:px-3 whitespace-nowrap">{a.reason || "-"}</td>
              <td className="py-2 px-1 sm:px-3 whitespace-nowrap">
                <span className={`px-2 py-1 rounded-xl text-xs font-semibold ${statusColors[a.status] || "bg-gray-200 text-gray-700"}`}>{a.status}</span>
              </td>
              <td className="py-2 px-1 sm:px-3 whitespace-nowrap">
                {a.remplacement?.remplacant ? `${a.remplacement.remplacant.prenom} ${a.remplacement.remplacant.nom}` : "-"}
              </td>
              <td className="py-2 px-1 sm:px-3 whitespace-nowrap">
                {a.justificatifUrl ? (
                  <button
                    className="text-primary underline font-semibold"
                    onClick={() => onShowJustificatif(a.justificatifUrl)}
                  >
                    Voir
                  </button>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
              {hasAdminRights && (
                <td className="py-2 px-1 sm:px-3 whitespace-nowrap flex flex-col gap-2 sm:flex-row sm:gap-2 items-center justify-center">
                  <button className="bg-primary text-white rounded-xl px-2 sm:px-3 py-1 text-xs font-bold hover:bg-primary/80 transition w-full sm:w-auto" onClick={() => onValidate(a.id)}>Valider</button>
                  <button className="bg-red-500 text-white rounded-xl px-2 sm:px-3 py-1 text-xs font-bold hover:bg-red-500/80 transition w-full sm:w-auto" onClick={() => onRefuse(a.id)}>Refuser</button>
                  <button className="bg-blue-500 text-white rounded-xl px-2 sm:px-3 py-1 text-xs font-bold hover:bg-blue-500/80 transition w-full sm:w-auto" onClick={() => onModify(a)}>Modifier</button>
                  <button className="bg-gray-700 text-white rounded-xl px-2 sm:px-3 py-1 text-xs font-bold hover:bg-gray-700/80 transition w-full sm:w-auto" onClick={() => onDelete(a.id)}>Supprimer</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

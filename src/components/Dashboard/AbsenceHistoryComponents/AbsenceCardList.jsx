import { statusColors } from './utils';
import { formatDate, formatTime } from './utils';

export default function AbsenceCardList({ absences, user, onValidate, onRefuse, onModify, onDelete, onShowJustificatif }) {
  const hasAdminRights = user?.role === "ADMIN" || user?.role === "RH" || user?.role === "MANAGER";

  return (
    <div className="flex flex-col gap-4 w-full sm:hidden">
      {absences.map((a) => (
        <div key={a.id} className="bg-accent/30 rounded-xl shadow p-3 flex flex-col gap-1 text-xs">
          <div className="flex justify-between"><span className="font-semibold">Date</span><span>{formatDate(a.startDate)}</span></div>
          <div className="flex justify-between"><span className="font-semibold">Début</span><span>{formatTime(a.startDate)}</span></div>
          <div className="flex justify-between"><span className="font-semibold">Fin</span><span>{formatTime(a.endDate)}</span></div>
          <div className="flex justify-between"><span className="font-semibold">Type</span><span>{a.type}</span></div>
          <div className="flex flex-col items-start">
            <span className="font-semibold">Motif</span>
            <span className="whitespace-pre-line break-words text-left w-full bg-white/60 rounded px-2 py-1 mt-1" style={{wordBreak: 'break-word', fontSize: '0.98em'}}>{a.reason || '-'}</span>
          </div>
          <div className="flex justify-between"><span className="font-semibold">Statut</span><span className={`px-2 py-1 rounded-xl text-xs font-semibold ${statusColors[a.status] || 'bg-gray-200 text-gray-700'}`}>{a.status}</span></div>
          <div className="flex justify-between"><span className="font-semibold">Remplaçant</span><span>{a.remplacement?.remplacant ? `${a.remplacement.remplacant.prenom} ${a.remplacement.remplacant.nom}` : '-'}</span></div>
          <div className="flex justify-between">
            <span className="font-semibold">Justificatif</span>
            <span>
              {a.justificatifUrl ? (
                <button className="text-primary underline font-semibold" onClick={() => onShowJustificatif(a.justificatifUrl)}>
                  Voir
                </button>
              ) : (
                <span className="text-gray-400">-</span>
              )}
            </span>
          </div>
          {hasAdminRights && (
            <div className="flex flex-col gap-1 pt-1">
              <button className="bg-primary text-white rounded-xl px-2 py-1 text-xs font-bold hover:bg-primary/80 transition" onClick={() => onValidate(a.id)}>Valider</button>
              <button className="bg-red-500 text-white rounded-xl px-2 py-1 text-xs font-bold hover:bg-red-500/80 transition" onClick={() => onRefuse(a.id)}>Refuser</button>
              <button className="bg-blue-500 text-white rounded-xl px-2 py-1 text-xs font-bold hover:bg-blue-500/80 transition" onClick={() => onModify(a)}>Modifier</button>
              <button className="bg-gray-700 text-white rounded-xl px-2 py-1 text-xs font-bold hover:bg-gray-700/80 transition" onClick={() => onDelete(a.id)}>Supprimer</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

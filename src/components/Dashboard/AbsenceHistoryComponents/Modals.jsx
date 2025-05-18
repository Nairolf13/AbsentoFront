import { isImageUrl, isPdfUrl } from './utils';
import { formatDate } from './utils';

export function JustificatifModal({ url, onClose }) {
  if (!url) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-2">
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 w-full max-w-lg mx-auto relative flex flex-col items-center">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h3 className="text-base sm:text-lg font-bold mb-2">Justificatif</h3>
        {isImageUrl(url) ? (
          <img
            src={url}
            alt="Justificatif"
            className="max-h-96 max-w-full mb-4 rounded"
            onError={e => { e.target.onerror = null; e.target.style.display = 'none'; }}
          />
        ) : isPdfUrl(url) ? (
          <embed src={url} type="application/pdf" className="w-full h-96 mb-4" />
        ) : (
          <div className="text-red-500 mb-4">Format de justificatif non supporté.<br/>URL : <span className="break-all">{url}</span></div>
        )}
        <a
          href={url}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded hover:bg-primary/80 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" /></svg>
          Télécharger
        </a>
      </div>
    </div>
  );
}

export function RemplacantModal({ absence, employees, remplacantId, actionLoading, onChangeRemplacant, onSetRemplacantId, onClose }) {
  if (!absence) return null;

  const handleChange = (e) => {
    onSetRemplacantId(e.target.value);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-2">
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 w-full max-w-lg mx-auto relative">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl" onClick={onClose}>&times;</button>
        <h3 className="text-base sm:text-lg font-bold mb-2">Modifier le remplaçant pour l'absence du {formatDate(absence.startDate)}</h3>
        <select 
          value={remplacantId} 
          onChange={handleChange} 
          className="py-2 px-3 border border-gray-300 rounded-lg w-full mb-4"
        >
          <option value="">Sélectionner un remplaçant</option>
          {employees
            .filter(emp => emp.poste === (absence.remplacement?.remplace?.poste || absence.employee?.poste || absence.poste))
            .map(emp => (
              <option key={emp.id} value={emp.id}>{emp.prenom} {emp.nom}</option>
            ))}
        </select>
        <button 
          className="bg-primary text-white rounded-xl px-3 py-1 text-xs font-bold hover:bg-primary/80 transition mt-2 w-full" 
          onClick={onChangeRemplacant} 
          disabled={actionLoading || !remplacantId}
        >
          Valider le changement
        </button>
        <button 
          className="bg-gray-200 text-gray-700 rounded-xl px-3 py-1 text-xs font-bold hover:bg-gray-200/80 transition mt-2 w-full" 
          onClick={onClose}
        >
          Annuler
        </button>
      </div>
    </div>
  );
}

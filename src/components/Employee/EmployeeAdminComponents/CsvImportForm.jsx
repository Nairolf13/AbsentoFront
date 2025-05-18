export const CsvImportForm = ({
  csvInputRef,
  csvData,
  csvImportResult,
  csvError,
  csvSuccess,
  csvLoading,
  employees,
  handleCsvDrop,
  handleCsvAdd,
  handleFileInputChange
}) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 gap-2">
        <h3 className="font-semibold text-lg text-center">Importer via CSV</h3>
        <a
          href="/modele_employes.csv"
          download
          className="block md:hidden bg-primary text-white rounded-full p-2 shadow hover:bg-primary/80 transition mx-auto"
          aria-label="Télécharger un modèle CSV"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 4v12" />
          </svg>
        </a>
        <a
          href="/modele_employes.csv"
          download
          className="hidden md:inline text-xs text-primary underline hover:text-primary/70 text-center md:text-right"
        >
          Télécharger un modèle CSV
        </a>
      </div>
      <div className="flex flex-col items-center mt-2 mb-2">
        <input
          ref={csvInputRef}
          type="file"
          accept=".csv,text/csv"
          style={{ display: 'none' }}
          onChange={handleFileInputChange}
        />
        <button
          type="button"
          className="mt-2 mb-2 px-4 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary/80 transition md:hidden"
          onClick={() => csvInputRef.current && csvInputRef.current.click()}
        >
          Choisir un fichier CSV
        </button>
      </div>
      <div
        className="border-2 border-dashed border-primary rounded-xl p-8 text-center cursor-pointer bg-accent/30 hover:bg-accent/60 transition"
        onDrop={handleCsvDrop}
        onDragOver={e => e.preventDefault()}
      >
        Glissez-déposez un fichier CSV ici
        <div className="text-xs text-secondary mt-2">
          Colonnes attendues : nom, prenom, email, telephone, dateNaissance (YYYY-MM-DD), adresse, poste, role (EMPLOYE ou ADMIN)
        </div>
        {csvError && <div className="mt-2 text-xs text-red-600 font-semibold">{csvError}</div>}
        {csvImportResult && (
          <div className="mt-2 text-xs font-semibold">
            {csvImportResult.created && csvImportResult.created.length > 0 && (
              <div>
                {csvImportResult.created.length} employé(s) importé(s) : {csvImportResult.created.map((email, i) => (
                  <span key={email} className="text-green-700 font-bold">{email}{i < csvImportResult.created.length - 1 ? ', ' : ''}</span>
                ))}
              </div>
            )}
            {csvImportResult.ignored && csvImportResult.ignored.length > 0 && (
              <div>
                {csvImportResult.ignored.length} déjà existant(s) ignoré(s) : {csvImportResult.ignored.map((email, i) => (
                  <span key={email} className="text-red-700 font-bold">{email}{i < csvImportResult.ignored.length - 1 ? ', ' : ''}</span>
                ))}
              </div>
            )}
            {csvImportResult.invalid && csvImportResult.invalid.length > 0 && (
              <div className="text-orange-700">
                {csvImportResult.invalid.length} lignes invalides ignorées côté backend : {csvImportResult.invalid.join(', ')}
              </div>
            )}
          </div>
        )}
        {!csvImportResult && csvSuccess && (
          <div className="mt-2 text-xs text-green-600 font-semibold">{csvSuccess}</div>
        )}
        {(csvData && csvData.length > 0) && (
          <div className="mt-4 max-h-64 overflow-y-auto">
            <table className="w-full text-sm border">
              <thead>
                <tr>
                  <th className="px-2 py-1 border">Nom</th>
                  <th className="px-2 py-1 border">Prénom</th>
                  <th className="px-2 py-1 border">Email</th>
                </tr>
              </thead>
              <tbody>
                {csvData.map((row, idx) => {
                  let rowClass = '';
                  if (csvImportResult) {
                    if (csvImportResult.created && csvImportResult.created.includes(row.email)) {
                      rowClass = 'bg-green-100';
                    } else if (csvImportResult.ignored && csvImportResult.ignored.includes(row.email)) {
                      rowClass = 'bg-red-100';
                    } else {
                      rowClass = '';
                    }
                  } else {
                    const emailExists = employees.some(e => e.email && row.email && e.email.toLowerCase() === row.email.toLowerCase());
                    rowClass = emailExists ? 'bg-red-100' : 'bg-green-100';
                  }
                  let nomClass = '';
                  if (csvImportResult) {
                    if (csvImportResult.created && csvImportResult.created.includes(row.email)) {
                      nomClass = 'text-green-700 font-semibold';
                    } else if (csvImportResult.ignored && csvImportResult.ignored.includes(row.email)) {
                      nomClass = 'text-red-700 font-semibold';
                    }
                  }
                  return (
                    <tr key={idx} className={rowClass}>
                      <td className={`px-2 py-1 border ${nomClass}`}>{row.nom}</td>
                      <td className="px-2 py-1 border">{row.prenom}</td>
                      <td className="px-2 py-1 border">{row.email}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="text-xs mt-2">
              <span className="inline-block w-3 h-3 bg-green-200 mr-1 border border-green-600 align-middle"></span> = Peut être ajouté / a été ajouté<br />
              <span className="inline-block w-3 h-3 bg-red-200 ml-4 mr-1 border border-red-600 align-middle"></span> = Déjà existant / ignoré
            </div>
          </div>
        )}
        <button
          className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!csvData || csvLoading}
          onClick={handleCsvAdd}
          type="button"
        >
          Importer les employés
        </button>
      </div>
    </div>
  );
};

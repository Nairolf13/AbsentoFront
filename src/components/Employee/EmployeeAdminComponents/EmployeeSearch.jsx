export const EmployeeSearch = ({ searchTerm, setSearchTerm, filteredEmployees, loadingEmployees }) => {
  return (
    <div className="mb-6 relative">
      <div className="relative">
        <input
          type="text"
          placeholder="Rechercher un employé..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-primary px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        {searchTerm && (
          <button 
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-primary"
            onClick={() => setSearchTerm("")}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        )}
      </div>
      {filteredEmployees.length === 0 && searchTerm && !loadingEmployees && (
        <p className="mt-2 text-sm text-red-500">Aucun employé ne correspond à votre recherche.</p>
      )}
      {filteredEmployees.length > 0 && searchTerm && (
        <p className="mt-2 text-sm text-gray-500">{filteredEmployees.length} employé(s) trouvé(s)</p>
      )}
    </div>
  );
};

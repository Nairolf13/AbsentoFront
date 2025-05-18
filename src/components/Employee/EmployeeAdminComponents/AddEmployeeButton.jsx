
export const AddEmployeeButton = ({ showAddForm, setShowAddForm }) => {
  return (
    <div className="absolute top-0 right-12 mt-4 mr-4 z-20" style={{ right: '3px' }}>
      <button
        className="bg-primary text-white font-bold py-2 px-3 rounded-xl shadow hover:bg-primary/80 transition block md:hidden"
        onClick={() => setShowAddForm(f => !f)}
        aria-label={showAddForm ? 'Fermer le formulaire' : 'Ajouter un employé'}
      >
        {showAddForm ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        )}
      </button>
      <button
        className="bg-primary text-white font-bold py-2 px-6 rounded-xl shadow hover:bg-primary/80 transition hidden md:block"
        onClick={() => setShowAddForm(f => !f)}
      >
        {showAddForm ? 'Fermer le formulaire' : 'Ajouter un employé'}
      </button>
    </div>
  );
};

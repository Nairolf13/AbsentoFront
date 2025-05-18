export const AddEmployeeForm = ({ 
  singleForm, 
  singleError, 
  singleSuccess, 
  singleLoading, 
  handleSingleChange, 
  handleSingleSubmit 
}) => {
  return (
    <div className="w-full">
      <h3 className="font-semibold text-lg mb-2 text-center">Ajouter un employé manuellement</h3>
      <form onSubmit={handleSingleSubmit} className="space-y-4 w-full flex flex-col items-center">
        <div className="w-full flex gap-4">
          <input 
            type="text" 
            name="nom" 
            placeholder="Nom" 
            className="block w-full rounded-xl border border-primary px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700" 
            value={singleForm.nom} 
            onChange={handleSingleChange} 
            required 
          />
          <input 
            type="text" 
            name="prenom" 
            placeholder="Prénom" 
            className="block w-full rounded-xl border border-primary px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700" 
            value={singleForm.prenom} 
            onChange={handleSingleChange} 
            required 
          />
        </div>
        <input 
          type="email" 
          name="email" 
          placeholder="Email" 
          className="block w-full rounded-xl border border-primary px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700" 
          value={singleForm.email} 
          onChange={handleSingleChange} 
          required 
        />
        <input 
          type="tel" 
          name="telephone" 
          placeholder="Téléphone" 
          className="block w-full rounded-xl border border-primary px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700" 
          value={singleForm.telephone} 
          onChange={handleSingleChange} 
          required 
        />
        <div className="relative w-full mb-2">
          <span
            className="absolute right-2 md:right-2 md:left-auto md:hidden"
            style={{ top: '50%', transform: 'translateY(-50%)', zIndex: 100 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </span>
          <input
            type="date"
            name="dateNaissance"
            id="dateNaissance"
            className={`block w-screen max-w-none rounded-xl border border-primary pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700 bg-white shadow-sm hover:border-secondary transition peer ${singleForm.dateNaissance ? 'not-empty' : ''} md:w-full md:mx-0 md:pr-10`}
            style={{ marginLeft: '0px', width: 'calc(100vw - 65px)', paddingLeft: '1rem', maxWidth: '100%' }}
            value={singleForm.dateNaissance}
            onChange={handleSingleChange}
            required
            min="1950-01-01"
            max={new Date().toISOString().split('T')[0]}
          />
          <label
            htmlFor="dateNaissance"
            className="absolute top-1/2 -translate-y-1/2 bg-white px-1 text-gray-500 text-sm pointer-events-none transition-all duration-200 peer-focus:-top-3 peer-focus:text-xs peer-focus:text-primary peer-[.not-empty]:-top-3 peer-[.not-empty]:text-xs peer-[.not-empty]:text-primary md:left-4"
            style={{
              left: '0.75rem',
              top: singleForm.dateNaissance ? '-0.75rem' : '50%',
              fontSize: singleForm.dateNaissance ? '0.75rem' : '1rem',
              color: singleForm.dateNaissance ? '#2563eb' : '#6b7280',
              background: 'white',
              padding: '0 0.25rem',
              display: singleForm.dateNaissance ? 'none' : 'block',
            }}
          >
            Date de naissance
          </label>
        </div>
        <input 
          type="text" 
          name="adresse" 
          placeholder="Adresse" 
          className="block w-full rounded-xl border border-primary px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700" 
          value={singleForm.adresse} 
          onChange={handleSingleChange} 
          required 
        />
        <input 
          type="text" 
          name="poste" 
          placeholder="Poste" 
          className="block w-full rounded-xl border border-primary px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700" 
          value={singleForm.poste} 
          onChange={handleSingleChange} 
          required 
        />
        <select 
          name="role" 
          className="block w-full rounded-xl border border-primary px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700" 
          value={singleForm.role} 
          onChange={handleSingleChange} 
          required
        >
          <option value="EMPLOYE">Employé</option>
          <option value="MANAGER">Manager</option>
          <option value="RH">RH</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button 
          className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/80 transition" 
          type="submit" 
          disabled={singleLoading}
        >
          Ajouter
        </button>
        {singleError && <div className="text-xs text-red-500 text-center mt-2 w-full">{singleError}</div>}
        {singleSuccess && <div className="text-xs text-green-600 text-center mt-2 w-full">{singleSuccess}</div>}
      </form>
    </div>
  );
};

export const EditEmployeeForm = ({
  editEmp,
  setEditEmp,
  editError,
  editSuccess,
  editLoading,
  onSubmit
}) => {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl px-8 py-10 w-full max-w-xl mx-auto relative animate-fade-in">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold"
          onClick={() => setEditEmp(null)}
          aria-label="Fermer"
        >×</button>
        <h3 className="font-semibold text-lg mb-4 text-center">Modifier l'employé</h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="flex gap-2">
            <input 
              type="text" 
              value={editEmp.nom} 
              onChange={e => setEditEmp(emp => ({ ...emp, nom: e.target.value }))} 
              placeholder="Nom" 
              className="block w-full rounded-xl border border-primary px-4 py-3" 
              required 
            />
            <input 
              type="text" 
              value={editEmp.prenom} 
              onChange={e => setEditEmp(emp => ({ ...emp, prenom: e.target.value }))} 
              placeholder="Prénom" 
              className="block w-full rounded-xl border border-primary px-4 py-3" 
              required 
            />
          </div>
          <input 
            type="email" 
            value={editEmp.email} 
            onChange={e => setEditEmp(emp => ({ ...emp, email: e.target.value }))} 
            placeholder="Email" 
            className="block w-full rounded-xl border border-primary px-4 py-3" 
            required 
          />
          <input 
            type="tel" 
            value={editEmp.telephone} 
            onChange={e => setEditEmp(emp => ({ ...emp, telephone: e.target.value }))} 
            placeholder="Téléphone" 
            className="block w-full rounded-xl border border-primary px-4 py-3" 
            required 
          />
          <input 
            type="text" 
            value={editEmp.adresse} 
            onChange={e => setEditEmp(emp => ({ ...emp, adresse: e.target.value }))} 
            placeholder="Adresse" 
            className="block w-full rounded-xl border border-primary px-4 py-3" 
            required 
          />
          <input 
            type="text" 
            value={editEmp.poste} 
            onChange={e => setEditEmp(emp => ({ ...emp, poste: e.target.value }))} 
            placeholder="Poste" 
            className="block w-full rounded-xl border border-primary px-4 py-3" 
            required 
          />
          <select 
            value={editEmp.role} 
            onChange={e => setEditEmp(emp => ({ ...emp, role: e.target.value }))} 
            className="block w-full rounded-xl border border-primary px-4 py-3" 
            required
          >
            <option value="EMPLOYE">Employé</option>
            <option value="MANAGER">Manager</option>
            <option value="RH">RH</option>
            <option value="ADMIN">Admin</option>
          </select>
          <input 
            type="date" 
            value={
              editEmp.dateNaissance ? (
                typeof editEmp.dateNaissance === 'string' ? 
                  editEmp.dateNaissance.includes('T') ? editEmp.dateNaissance.split('T')[0] : editEmp.dateNaissance 
                  : 
                  new Date(editEmp.dateNaissance).toISOString().split('T')[0]
              ) : ''
            } 
            onChange={e => setEditEmp(emp => ({ ...emp, dateNaissance: e.target.value }))} 
            className="block w-full rounded-xl border border-primary px-4 py-3" 
            required 
          />
          <div className="flex flex-col gap-1 pt-1">
            <button 
              type="submit" 
              className="bg-primary text-white font-bold px-6 py-2 rounded-xl hover:bg-primary/80 transition" 
              disabled={editLoading}
            >
              Enregistrer
            </button>
            <button 
              type="button" 
              className="bg-gray-300 text-gray-700 font-bold px-6 py-2 rounded-xl hover:bg-gray-400 transition" 
              onClick={() => setEditEmp(null)}
            >
              Annuler
            </button>
          </div>
          {editError && <div className="text-xs text-red-600 text-center mt-2">{editError}</div>}
          {editSuccess && <div className="text-xs text-green-600 text-center mt-2">{editSuccess}</div>}
        </form>
      </div>
    </div>
  );
};

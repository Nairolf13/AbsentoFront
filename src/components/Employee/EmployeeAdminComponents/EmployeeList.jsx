export const EmployeeMobileList = ({ employees, onEdit, onDelete }) => {
  return (
    <div className="flex flex-col gap-4 w-full sm:hidden">
      {employees.map(emp => (
        <div key={emp.id} className="bg-accent/30 rounded-xl shadow p-3 flex flex-col gap-1 text-xs">
          <div className="flex justify-between"><span className="font-semibold">Nom</span><span className="text-right max-w-[65%] break-words">{emp.nom}</span></div>
          <div className="flex justify-between"><span className="font-semibold">Prénom</span><span className="text-right max-w-[65%] break-words">{emp.prenom}</span></div>
          <div className="flex justify-between"><span className="font-semibold">Email</span><span className="text-right max-w-[65%] break-words">{emp.email}</span></div>
          <div className="flex justify-between"><span className="font-semibold">Téléphone</span><span className="text-right max-w-[65%] break-words">{emp.telephone}</span></div>
          <div className="flex justify-between"><span className="font-semibold">Poste</span><span className="text-right max-w-[65%] break-words">{emp.poste}</span></div>
          <div className="flex justify-between"><span className="font-semibold">Rôle</span><span className="text-right max-w-[65%] break-words">{emp.role}</span></div>
          <div className="flex justify-between"><span className="font-semibold">Entreprise</span><span className="text-right max-w-[65%] break-words">{emp.entreprise?.nom}</span></div>
          <div className="flex flex-col items-start">
            <span className="font-semibold">Adresse</span>
            <span className="whitespace-pre-line break-words text-left w-full bg-white/60 rounded px-2 py-1 mt-1" style={{wordBreak: 'break-word', fontSize: '0.98em'}}>{emp.adresse}</span>
          </div>
          <div className="flex justify-between"><span className="font-semibold">Date de naissance</span><span>{emp.dateNaissance ? (typeof emp.dateNaissance === 'string' ? emp.dateNaissance.split('T')[0] : new Date(emp.dateNaissance).toISOString().split('T')[0]) : ''}</span></div>
          <div className="flex flex-col gap-1 pt-1">
            <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-3 py-1 rounded" onClick={() => onEdit(emp)}>Modifier</button>
            <button className="bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-1 rounded" onClick={() => onDelete(emp)}>Supprimer</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export const EmployeeDesktopList = ({ employees, onEdit, onDelete }) => {
  return (
    <div className="hidden sm:block pb-4" style={{overflow: 'visible'}}>
      <div className="w-full" style={{overflow: 'visible', height: 'auto'}}>
        <table className="w-full bg-white border border-gray-200 rounded-xl text-sm">
          <thead>
            <tr>
              <th className="py-2 px-3 border-b">Nom</th>
              <th className="py-2 px-3 border-b">Prénom</th>
              <th className="py-2 px-3 border-b">Email</th>
              <th className="py-2 px-3 border-b">Téléphone</th>
              <th className="py-2 px-3 border-b">Poste</th>
              <th className="py-2 px-3 border-b">Rôle</th>
              <th className="py-2 px-3 border-b">Entreprise</th>
              <th className="py-2 px-3 border-b">Adresse</th>
              <th className="py-2 px-3 border-b">Date de naissance</th>
              <th className="py-2 px-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.id} className="text-center">
                <td className="py-2 px-3 border-b truncate">{emp.nom}</td>
                <td className="py-2 px-3 border-b truncate">{emp.prenom}</td>
                <td className="py-2 px-3 border-b truncate">{emp.email}</td>
                <td className="py-2 px-3 border-b truncate">{emp.telephone}</td>
                <td className="py-2 px-3 border-b truncate">{emp.poste}</td>
                <td className="py-2 px-3 border-b truncate">{emp.role}</td>
                <td className="py-2 px-3 border-b truncate">{emp.entreprise?.nom}</td>
                <td className="py-2 px-3 border-b truncate">{emp.adresse}</td>
                <td className="py-2 px-3 border-b truncate">{emp.dateNaissance ? (typeof emp.dateNaissance === 'string' ? emp.dateNaissance.split('T')[0] : new Date(emp.dateNaissance).toISOString().split('T')[0]) : ''}</td>
                <td className="py-2 px-3 border-b">
                  <div className="flex flex-row justify-center gap-2">
                    <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-3 py-1 rounded" onClick={() => onEdit(emp)}>Modifier</button>
                    <button className="bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-1 rounded" onClick={() => onDelete(emp)}>Supprimer</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

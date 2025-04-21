import React from "react";
import useAuth from "../../hooks/useAuth";

export default function Profile() {
  const { user } = useAuth();
  if (!user) return <div>Chargement...</div>;
  return (
    <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        Profil de l'employé
      </h2>
      <div className="space-y-2 text-lg">
        <div><span className="font-semibold">Nom :</span> {user.nom}</div>
        <div><span className="font-semibold">Prénom :</span> {user.prenom}</div>
        <div><span className="font-semibold">Email :</span> {user.email}</div>
        <div><span className="font-semibold">Téléphone :</span> {user.telephone}</div>
        <div><span className="font-semibold">Date de naissance :</span> {user.dateNaissance && new Date(user.dateNaissance).toLocaleDateString()}</div>
        <div><span className="font-semibold">Adresse :</span> {user.adresse}</div>
        <div><span className="font-semibold">Poste :</span> {user.poste}</div>
        <div><span className="font-semibold">Rôle :</span> {user.role}</div>
      </div>
    </div>
  );
}

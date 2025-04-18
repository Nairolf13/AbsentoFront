import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerEntreprise } from "../../api/absento";

export default function RegisterForm() {
  const [nomEntreprise, setNomEntreprise] = useState("");
  const [siret, setSiret] = useState("");
  const [secteur, setSecteur] = useState("");
  const [taille, setTaille] = useState("");
  const [adresseEntreprise, setAdresseEntreprise] = useState("");
  const [telephoneEntreprise, setTelephoneEntreprise] = useState("");
  const [emailContact, setEmailContact] = useState("");
  const [responsableNom, setResponsableNom] = useState("");
  const [responsablePrenom, setResponsablePrenom] = useState("");
  const [emailResponsable, setEmailResponsable] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      await registerEntreprise({
        nom: nomEntreprise,
        siret,
        secteur,
        taille,
        adresse: adresseEntreprise,
        telephone: telephoneEntreprise,
        emailContact,
        responsableNom,
        responsablePrenom,
        emailResponsable,
        motDePasse,
        dateNaissance
      });
      setSuccess("Entreprise créée ! Vous pouvez vous connecter.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-accent">
      <div className="bg-white rounded-2xl shadow-lg px-8 py-10 w-full max-w-md mx-auto flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6 text-center text-primary">Créer une entreprise</h2>
        <form onSubmit={handleSubmit} className="space-y-4 w-full flex flex-col items-center">
          <input type="text" placeholder="Nom de l'entreprise" className="block w-full rounded-xl border border-primary px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700" value={nomEntreprise} onChange={e => setNomEntreprise(e.target.value)} required />
          <input type="text" placeholder="SIRET" className="block w-full rounded-xl border border-primary px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700" value={siret} onChange={e => setSiret(e.target.value)} required />
          <input type="text" placeholder="Secteur (optionnel)" className="block w-full rounded-xl border border-primary px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700" value={secteur} onChange={e => setSecteur(e.target.value)} />
          <input type="text" placeholder="Taille (optionnel)" className="block w-full rounded-xl border border-primary px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700" value={taille} onChange={e => setTaille(e.target.value)} />
          <input type="text" placeholder="Adresse de l'entreprise" className="block w-full rounded-xl border border-primary px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700" value={adresseEntreprise} onChange={e => setAdresseEntreprise(e.target.value)} required />
          <input type="text" placeholder="Téléphone entreprise" className="block w-full rounded-xl border border-primary px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700" value={telephoneEntreprise} onChange={e => setTelephoneEntreprise(e.target.value)} />
          <input type="email" placeholder="Email de contact entreprise" className="block w-full rounded-xl border border-primary px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700" value={emailContact} onChange={e => setEmailContact(e.target.value)} required />
          <input type="text" placeholder="Nom du responsable" className="block w-full rounded-xl border border-primary px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700" value={responsableNom} onChange={e => setResponsableNom(e.target.value)} required />
          <input type="text" placeholder="Prénom du responsable" className="block w-full rounded-xl border border-primary px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700" value={responsablePrenom} onChange={e => setResponsablePrenom(e.target.value)} required />
          <input type="email" placeholder="Email du responsable" className="block w-full rounded-xl border border-primary px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700" value={emailResponsable} onChange={e => setEmailResponsable(e.target.value)} required />
          <input type="password" placeholder="Mot de passe" className="block w-full rounded-xl border border-primary px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700" value={motDePasse} onChange={e => setMotDePasse(e.target.value)} required />
          <input type="date" placeholder="Date de naissance du responsable" className="block w-full rounded-xl border border-primary px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700" value={dateNaissance} onChange={e => setDateNaissance(e.target.value)} />
          <button className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/80 transition" type="submit">Créer l'entreprise</button>
          {error && <div className="text-xs text-red-500 text-center mt-2 w-full">{error}</div>}
          {success && <div className="text-xs text-green-600 text-center mt-2 w-full">{success}</div>}
        </form>
        <div className="text-xs text-center mt-4 text-secondary cursor-pointer hover:underline w-full" onClick={() => navigate('/login')}>Déjà un compte ?</div>
      </div>
    </div>
  );
}

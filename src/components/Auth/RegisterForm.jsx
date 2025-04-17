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
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-xs">
        <h2 className="text-2xl font-bold mb-6 text-center">Créer une entreprise</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Nom de l'entreprise" className="input" value={nomEntreprise} onChange={e => setNomEntreprise(e.target.value)} />
          <input type="text" placeholder="SIRET" className="input mt-4" value={siret} onChange={e => setSiret(e.target.value)} />
          <input type="text" placeholder="Secteur (optionnel)" className="input mt-4" value={secteur} onChange={e => setSecteur(e.target.value)} />
          <input type="text" placeholder="Taille (optionnel)" className="input mt-4" value={taille} onChange={e => setTaille(e.target.value)} />
          <input type="text" placeholder="Adresse de l'entreprise" className="input mt-4" value={adresseEntreprise} onChange={e => setAdresseEntreprise(e.target.value)} />
          <input type="text" placeholder="Téléphone entreprise" className="input mt-4" value={telephoneEntreprise} onChange={e => setTelephoneEntreprise(e.target.value)} />
          <input type="email" placeholder="Email de contact entreprise" className="input mt-4" value={emailContact} onChange={e => setEmailContact(e.target.value)} />
          <input type="text" placeholder="Nom du responsable" className="input mt-4" value={responsableNom} onChange={e => setResponsableNom(e.target.value)} />
          <input type="text" placeholder="Prénom du responsable" className="input mt-4" value={responsablePrenom} onChange={e => setResponsablePrenom(e.target.value)} />
          <input type="email" placeholder="Email du responsable" className="input mt-4" value={emailResponsable} onChange={e => setEmailResponsable(e.target.value)} />
          <input type="password" placeholder="Mot de passe" className="input mt-4" value={motDePasse} onChange={e => setMotDePasse(e.target.value)} />
          <input type="date" placeholder="Date de naissance du responsable" className="input mt-4" value={dateNaissance} onChange={e => setDateNaissance(e.target.value)} />
          <button className="btn-primary mt-6 w-full" type="submit">Créer l'entreprise</button>
          {error && <div className="text-xs text-red-500 mt-2 text-center">{error}</div>}
          {success && <div className="text-xs text-green-600 mt-2 text-center">{success}</div>}
        </form>
        <div className="text-xs text-center mt-4 text-secondary cursor-pointer" onClick={() => navigate('/login')}>Déjà un compte ?</div>
      </div>
    </div>
  );
}

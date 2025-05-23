import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerEntreprise } from "../../api/absento";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const regex = {
  nomEntreprise: /^[A-Za-z0-9À-ÿ' -]{2,100}$/,
  siret: /^\d{14}$/,
  adresseEntreprise: /^.{5,100}$/,
  telephoneEntreprise: /^\+?\d{10,15}$/,
  emailContact: /^[\w-.]+@[\w-]+\.[a-z]{2,}$/i,
  responsableNom: /^[A-Za-zÀ-ÿ' -]{2,50}$/,
  responsablePrenom: /^[A-Za-zÀ-ÿ' -]{2,50}$/,
  emailResponsable: /^[\w-.]+@[\w-]+\.[a-z]{2,}$/i,
  motDePasse: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}:;"',.<>/?]).{8,}$/
};

function validateDateNaissance(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const age = now.getFullYear() - date.getFullYear();
  return !isNaN(date) && age >= 18;
}

function useIsMobile() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(max-width: 640px)').matches;
}

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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  function validateAllFields() {
    if (!regex.nomEntreprise.test(nomEntreprise)) return "Nom d'entreprise invalide (lettres, chiffres, 2-100 caractères)";
    if (!regex.siret.test(siret)) return "SIRET invalide (14 chiffres)";
    if (!regex.adresseEntreprise.test(adresseEntreprise)) return "Adresse invalide (5 à 100 caractères)";
    if (!regex.telephoneEntreprise.test(telephoneEntreprise)) return "Téléphone invalide (10 à 15 chiffres)";
    if (!regex.emailContact.test(emailContact)) return "Email de contact invalide";
    if (!regex.responsableNom.test(responsableNom)) return "Nom du responsable invalide (lettres, 2-50 caractères)";
    if (!regex.responsablePrenom.test(responsablePrenom)) return "Prénom du responsable invalide (lettres, 2-50 caractères)";
    if (!regex.emailResponsable.test(emailResponsable)) return "Email du responsable invalide";
    if (!regex.motDePasse.test(motDePasse)) return "Mot de passe trop faible (8 caractères, majuscule, minuscule, chiffre, spécial)";
    if (!validateDateNaissance(dateNaissance)) return "Date de naissance invalide ou moins de 18 ans";
    if (motDePasse !== confirmPassword) return "Les mots de passe ne correspondent pas.";
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    const validationError = validateAllFields();
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      await registerEntreprise({
        nom: nomEntreprise,
        siret,
        secteur,
        taille,
        adresse: adresseEntreprise,
        telephone: telephoneEntreprise,
        emailContact: emailContact.trim().toLowerCase(),
        responsableNom,
        responsablePrenom,
        emailResponsable: emailResponsable.trim().toLowerCase(),
        motDePasse,
        dateNaissance,
      });
      setSuccess("Inscription réussie ! Vous pouvez maintenant vous connecter.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err?.response?.data?.error || "Erreur lors de l'inscription");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-accent">
      <div className="bg-white rounded-2xl shadow-lg px-8 py-10 w-full max-w-md mx-auto flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6 text-center text-primary">Créer une entreprise</h2>
        <form onSubmit={handleSubmit} className="space-y-4 w-full flex flex-col items-center">
          {/* Section Informations entreprise */}
          <div className="w-full mb-6">
            <h3 className="text-lg font-semibold text-primary mb-2">Informations entreprise</h3>
            <input type="text" placeholder="Nom de l'entreprise" className="block w-full rounded-xl border border-primary px-4 py-3 mb-1 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700" value={nomEntreprise} onChange={e => setNomEntreprise(e.target.value)} required />
            <input type="text" placeholder="SIRET (14 chiffres)" className="block w-full rounded-xl border border-primary px-4 py-3 mb-1 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700" value={siret} onChange={e => setSiret(e.target.value)} required />
            <input type="text" placeholder="Secteur (optionnel)" className="block w-full rounded-xl border border-primary px-4 py-3 mb-1 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700" value={secteur} onChange={e => setSecteur(e.target.value)} />
            <input type="text" placeholder="Taille (optionnel)" className="block w-full rounded-xl border border-primary px-4 py-3 mb-1 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700" value={taille} onChange={e => setTaille(e.target.value)} />
            <input type="text" placeholder="Adresse de l'entreprise" className="block w-full rounded-xl border border-primary px-4 py-3 mb-1 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700" value={adresseEntreprise} onChange={e => setAdresseEntreprise(e.target.value)} required />
            <input type="text" placeholder="Téléphone entreprise" className="block w-full rounded-xl border border-primary px-4 py-3 mb-1 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700" value={telephoneEntreprise} onChange={e => setTelephoneEntreprise(e.target.value)} />
            <input type="email" placeholder="Email de contact entreprise" className="block w-full rounded-xl border border-primary px-4 py-3 mb-1 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700" value={emailContact} onChange={e => setEmailContact(e.target.value)} required />
          </div>

          {/* Section Informations responsable */}
          <div className="w-full mb-6">
            <h3 className="text-lg font-semibold text-primary mb-2">Informations responsable</h3>
            <input type="text" placeholder="Nom du responsable" className="block w-full rounded-xl border border-primary px-4 py-3 mb-1 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700" value={responsableNom} onChange={e => setResponsableNom(e.target.value)} required />
            <input type="text" placeholder="Prénom du responsable" className="block w-full rounded-xl border border-primary px-4 py-3 mb-1 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700" value={responsablePrenom} onChange={e => setResponsablePrenom(e.target.value)} required />
            <label htmlFor="dateNaissance" className="block mb-1 text-secondary text-xs sm:text-sm text-center w-full">
              Date de naissance du responsable
            </label>
            {isMobile ? (
              <div className="relative w-full mb-2">
                <input
                  id="dateNaissance"
                  type="date"
                  className="block w-full rounded-xl border border-primary px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700 bg-white appearance-none"
                  value={dateNaissance}
                  onChange={e => setDateNaissance(e.target.value)}
                  required
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </span>
                {!dateNaissance && (
                  <span className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none select-none">
                    Sélectionner une date
                  </span>
                )}
              </div>
            ) : (
              <input
                id="dateNaissance"
                type="date"
                className="block w-full rounded-xl border border-primary px-4 py-3 mb-2 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700"
                value={dateNaissance}
                onChange={e => setDateNaissance(e.target.value)}
                required
              />
            )}
            <input type="email" placeholder="Email du responsable" className="block w-full rounded-xl border border-primary px-4 py-3 mb-1 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700" value={emailResponsable} onChange={e => setEmailResponsable(e.target.value)} required />
            <div className="relative w-full mb-2">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe"
                className="block w-full rounded-xl border border-primary px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700"
                value={motDePasse}
                onChange={e => setMotDePasse(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-primary"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <span className="text-xs text-gray-500 mb-2 block">8+ caractères, majuscule, minuscule, chiffre, spécial</span>
            <div className="relative w-full mb-2">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirmer le mot de passe"
                className="block w-full rounded-xl border border-primary px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-primary"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/80 transition" type="submit">Créer l'entreprise</button>
          {error && <div className="text-xs text-red-500 text-center mt-2 w-full">{error}</div>}
          {success && <div className="text-xs text-green-600 text-center mt-2 w-full">{success}</div>}
        </form>
        <div className="text-xs text-center mt-4 text-secondary cursor-pointer hover:underline w-full" onClick={() => navigate('/login')}>Déjà un compte ?</div>
      </div>
    </div>
  );
}

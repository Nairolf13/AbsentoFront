import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function CreatePassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const token = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!password || password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);
    try {
      // TODO: Appeler l'API pour définir le mot de passe avec le token
      // await axios.post(`${API_URL}/utilisateurs/set-password`, { token, password });
      setSuccess("Mot de passe créé avec succès ! Vous pouvez vous connecter.");
      setTimeout(() => navigate("/login"), 2000);
    } catch {
      setError("Lien invalide ou expiré.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return <div className="min-h-screen flex items-center justify-center bg-accent"><div className="bg-white p-8 rounded-xl shadow text-red-500">Lien invalide.</div></div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-accent">
      <div className="bg-white rounded-2xl shadow-lg px-8 py-10 w-full max-w-md mx-auto flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6 text-primary text-center">Créer votre mot de passe</h2>
        <form onSubmit={handleSubmit} className="space-y-4 w-full flex flex-col items-center">
          <input type="password" placeholder="Mot de passe" className="block w-full rounded-xl border border-primary px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700" value={password} onChange={e => setPassword(e.target.value)} required />
          <input type="password" placeholder="Confirmer le mot de passe" className="block w-full rounded-xl border border-primary px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700" value={confirm} onChange={e => setConfirm(e.target.value)} required />
          <button className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/80 transition" type="submit" disabled={loading}>Créer le mot de passe</button>
          {error && <div className="text-xs text-red-500 text-center mt-2 w-full">{error}</div>}
          {success && <div className="text-xs text-green-600 text-center mt-2 w-full">{success}</div>}
        </form>
      </div>
    </div>
  );
}

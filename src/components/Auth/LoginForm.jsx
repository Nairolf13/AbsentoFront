import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await loginUser(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Identifiants invalides");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-accent">
      <div className="bg-white rounded-2xl shadow-lg px-8 py-10 w-full max-w-md mx-auto flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6 text-center text-primary">Connexion</h2>
        <form onSubmit={handleSubmit} className="space-y-4 w-full flex flex-col items-center">
          <input
            type="email"
            placeholder="Adresse email"
            className="block w-full rounded-xl border border-primary px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            className="block w-full rounded-xl border border-primary px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/80 transition" type="submit">
            Connexion
          </button>
          {error && <div className="text-xs text-red-500 text-center mt-2">{error}</div>}
          <div className="flex justify-between mt-4 text-xs w-full">
            <span className="text-secondary cursor-pointer hover:underline" onClick={() => navigate('/register')}>Créer un compte</span>
            <span className="text-secondary cursor-pointer hover:underline">Mot de passe oublié ?</span>
          </div>
        </form>
      </div>
    </div>
  );
}

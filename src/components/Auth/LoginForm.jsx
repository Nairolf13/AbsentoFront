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
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-accent">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-xs">
        <h2 className="text-2xl font-bold mb-6 text-center">Log In</h2>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email address" className="input" value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" className="input mt-4" value={password} onChange={e => setPassword(e.target.value)} />
          <button className="btn-primary mt-6 w-full" type="submit">Log In</button>
          {error && <div className="text-xs text-red-500 mt-2 text-center">{error}</div>}
          <div className="text-xs text-center mt-4 text-secondary cursor-pointer" onClick={() => navigate('/register')}>Create an account</div>
          <div className="text-xs text-center mt-4 text-secondary cursor-pointer">Forgot password?</div>
        </form>
      </div>
    </div>
  );
}

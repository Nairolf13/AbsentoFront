import React from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-accent flex flex-col items-center justify-center">
      {/* Connexion button fixed top right */}
      <div className="fixed top-6 right-8 z-30">
        <button
          className="text-primary font-semibold border border-primary rounded-lg px-4 py-2 hover:bg-primary hover:text-white transition hidden md:block"
          onClick={() => navigate('/login')}
        >
          Connexion
        </button>
        <button
          className="text-primary font-semibold border border-primary rounded-lg px-4 py-2 hover:bg-primary hover:text-white transition md:hidden"
          onClick={() => navigate('/login')}
        >
          <span className="material-icons">login</span>
        </button>
      </div>

      {/* Header */}
      <header className="bg-primary/10 rounded-b-3xl px-6 py-5 flex justify-center items-center w-full max-w-4xl mx-auto mt-4 md:rounded-3xl md:mt-8">
        <span className="text-2xl font-bold text-primary">Absento</span>
      </header>

      {/* Main */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 flex flex-col items-center">
        <h1 className="mt-8 text-2xl md:text-4xl font-bold mb-2 text-center">
          Gérez intelligemment<br />les absences en entreprises
        </h1>
        <p className="mb-6 text-secondary text-center">
          Absento simplifie la déclaration d’absence et la gestion des remplacements
        </p>
        <button
          className="w-full bg-primary text-white font-bold py-3 rounded-xl mb-6 hover:bg-primary/80 transition"
          onClick={() => navigate('/register')}
        >
          Essayer gratuitement
        </button>

        <div className="space-y-4 w-full">
          <div className="border border-primary/20 rounded-xl p-4 bg-white text-center">
            <h3 className="font-semibold mb-1">Déclarer une absence</h3>
            <p className="text-sm text-secondary">Déclarez vos absences en quelques clics</p>
          </div>
          <div className="border border-primary/20 rounded-xl p-4 bg-white text-center">
            <h3 className="font-semibold mb-1">Obtenir un remplacement</h3>
            <p className="text-sm text-secondary">Trouvez rapidement des remplaçants disponibles</p>
          </div>
          <div className="border border-primary/20 rounded-xl p-4 bg-white text-center">
            <h3 className="font-semibold mb-1">Gérer le planning</h3>
            <p className="text-sm text-secondary">Visualisez et gérez facilement les plannings</p>
          </div>
        </div>

        <div className="bg-primary/10 rounded-xl p-4 mt-8 text-center w-full">
          <p className="mb-2 font-medium">Prêt à simplifier la gestion des absences ?</p>
          <button
            className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/80 transition"
            onClick={() => navigate('/register')}
          >
            Essayer gratuitement
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-2xl mx-auto flex justify-between items-center mt-8 mb-4 text-secondary text-sm px-4">
        <span>2025 Absento</span>
        <span className="flex gap-2">
          <a href="#" className="hover:text-primary"><i className="fa-brands fa-linkedin"></i></a>
          <a href="#" className="hover:text-primary"><i className="fa-brands fa-x-twitter"></i></a>
        </span>
      </footer>
    </div>
  );
}

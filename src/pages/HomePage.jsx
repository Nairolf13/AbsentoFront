import React from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      {/* Connexion button fixed top right */}
      <div className="fixed top-6 right-8 z-30">
        <button
          className="text-green-700 font-semibold border border-green-700 rounded-lg px-4 py-2 hover:bg-green-700 hover:text-white transition hidden md:block"
          onClick={() => navigate('/login')}
        >
          Connexion
        </button>
        <button
          className="text-green-700 font-semibold border border-green-700 rounded-lg px-4 py-2 hover:bg-green-700 hover:text-white transition md:hidden"
          onClick={() => navigate('/login')}
        >
          <span className="material-icons">login</span>
        </button>
      </div>

      {/* Header */}
      <header className="bg-green-100 rounded-b-3xl px-6 py-5 flex justify-center items-center max-w-md mx-auto mt-4 md:max-w-4xl md:rounded-3xl md:mt-8">
        <span className="text-2xl font-bold text-green-700">Absento</span>
      </header>

      {/* Main */}
      <main className="flex-1 w-full max-w-md mx-auto px-4 md:max-w-4xl md:px-0">
        <h1 className="mt-8 text-2xl md:text-4xl font-bold mb-2">
          Gérez intelligemment<br />les absences en entreprises
        </h1>
        <p className="mb-6 text-gray-700">
          Absento simplifie la déclaration d’absence et la gestion des remplacements
        </p>
        <button
          className="w-full bg-green-400 text-white font-bold py-3 rounded-lg mb-6 hover:bg-green-600 transition"
          onClick={() => navigate('/register')}
        >
          Essayer gratuitement
        </button>

        <div className="space-y-4">
          <div className="border border-green-200 rounded-xl p-4 bg-white">
            <h3 className="font-semibold mb-1">Déclarer une absence</h3>
            <p className="text-sm text-gray-600">Déclarez vos absences en quelques clics</p>
          </div>
          <div className="border border-green-200 rounded-xl p-4 bg-white">
            <h3 className="font-semibold mb-1">Obtenir un remplacement</h3>
            <p className="text-sm text-gray-600">Trouvez rapidement des remplaçants disponible</p>
          </div>
          <div className="border border-green-200 rounded-xl p-4 bg-white">
            <h3 className="font-semibold mb-1">Gérer le planning</h3>
            <p className="text-sm text-gray-600">Visualisez et gérez facilement les planning</p>
          </div>
        </div>

        <div className="bg-green-50 rounded-xl p-4 mt-8 text-center">
          <p className="mb-2 font-medium">Prêt à simplifier la gestion des absences ?</p>
          <button
            className="w-full bg-green-400 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition"
            onClick={() => navigate('/register')}
          >
            Essayer gratuitement
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-md mx-auto md:max-w-4xl flex justify-between items-center mt-8 mb-4 text-gray-700 text-sm px-4">
        <span> 2025 Absento</span>
        <span className="flex gap-2">
          <a href="#" className="hover:text-green-700"><i className="fa-brands fa-linkedin"></i></a>
          <a href="#" className="hover:text-green-700"><i className="fa-brands fa-x-twitter"></i></a>
        </span>
      </footer>
    </div>
  );
}

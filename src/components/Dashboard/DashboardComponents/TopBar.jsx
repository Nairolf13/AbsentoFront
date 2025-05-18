import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function TopBar({ user, isMobile = false, burgerOpen, setBurgerOpen }) {
  if (isMobile) {
    return (
      <header className="relative flex items-center justify-center px-4 py-3 bg-accent border-b border-secondary">
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-primary/10 text-primary focus:outline-none"
          onClick={() => setBurgerOpen(true)}
          aria-label="Ouvrir le menu"
        >
          <Bars3Icon className="w-8 h-8" />
        </button>
        <div className="text-xl font-semibold text-secondary flex items-center gap-2 justify-center w-full">
          Bonjour
          <span className="font-bold text-primary">
            {user?.prenom ? `${user.prenom} ${user.nom}` : user?.nom || user?.email || "Utilisateur"}
          </span>
        </div>
      </header>
    );
  }

  return (
    <header className="flex items-center justify-between px-10 py-6 bg-accent border-b border-secondary">
      <div className="text-2xl font-semibold text-secondary flex items-center gap-2">
        Bonjour
        <span className="font-bold text-primary">
          {user?.prenom ? `${user.prenom} ${user.nom}` : user?.nom || user?.email || "Utilisateur"}
        </span>
      </div>
      <select className="bg-primary px-3 py-1 rounded-xl text-secondary">
        <option>Mon périmètre</option>
      </select>
    </header>
  );
}

import { XMarkIcon } from '@heroicons/react/24/outline';
import { icons } from './icons.jsx';

export default function Sidebar({ 
  user, 
  activeTab, 
  handleSidebarClick, 
  isMobile = false, 
  burgerOpen, 
  setBurgerOpen 
}) {
  const generateSidebarItems = () => {
    const items = [
      { key: "calendar", label: "Calendrier", icon: icons.calendar },
      { key: "taches", label: "Mes tâches", icon: icons.tasks },
      { key: "absence", label: "Absence", icon: icons.absence },
      ...(user && (user.role === "ADMIN" || user.role === "MANAGER") 
          ? [{ key: "remplacement", label: "Remplacement", icon: icons.remplacement }] 
          : []),
      { key: "historique", label: "Historique", icon: icons.history },
    ];

    if (user && user.role === "ADMIN") {
      items.push({ key: "employes", label: "Employés", icon: icons.users });
    }
    
    return items;
  };

  const sidebarItems = generateSidebarItems();
  
  if (isMobile) {
    if (!burgerOpen) return null;
    
    return (
      <div className="fixed inset-0 z-50 bg-black/40 flex">
        <nav className="bg-white w-64 h-full shadow-lg p-6 flex flex-col">
          <button
            className="self-end mb-8 p-2 rounded-xl text-primary focus:outline-none"
            onClick={() => setBurgerOpen(false)}
            aria-label="Fermer le menu"
          >
            <XMarkIcon className="w-8 h-8" />
          </button>
          {sidebarItems.map((item) => {
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                className={`flex items-center gap-3 text-lg font-semibold rounded-xl px-4 py-3 mb-2 transition focus:outline-none w-full min-h-[56px] ${isActive ? "bg-primary text-secondary" : "text-primary hover:bg-primary/10"}`}
                onClick={() => {
                  handleSidebarClick(item.key);
                  setBurgerOpen(false);
                }}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="flex-1" onClick={() => setBurgerOpen(false)} />
      </div>
    );
  }
  
  return (
    <aside className="w-36 bg-secondary flex flex-col items-center py-6 gap-4">
      {sidebarItems.map((item) => {
        const isActive = activeTab === item.key;
        return (
          <button
            key={item.key}
            className={`flex flex-col items-center justify-center gap-1 text-xs font-semibold rounded-xl px-3 py-3 w-32 h-24 transition focus:outline-none ${isActive ? "border-2 border-primary text-primary bg-primary/10" : "border-none text-primary hover:bg-primary/20"}`}
            onClick={() => handleSidebarClick(item.key)}
          >
            <span>{item.icon}</span>
            <span className="mt-1 text-center w-full whitespace-normal">{item.label}</span>
          </button>
        );
      })}
    </aside>
  );
}

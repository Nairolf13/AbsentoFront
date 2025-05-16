import { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { getAllAbsences } from "../../api/absento";
import { API_URL } from "../../api/config";
import useSocket from '../../hooks/useSocket';
import axios from 'axios';
import { toast } from 'react-toastify';

const icons = {
  calendar: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="8" width="18" height="13" rx="2" stroke="currentColor"/><path d="M16 3v4M8 3v4M3 12h18" stroke="currentColor"/></svg>
  ),
  tasks: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor"/>
      <path d="M8 9h8M8 13h6M8 17h4" stroke="currentColor" strokeLinecap="round"/>
      <path d="M6 9l1 1 2-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  absence: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3" stroke="currentColor"/><circle cx="12" cy="12" r="10" stroke="currentColor"/></svg>
  ),
  remplacement: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4v6h6" stroke="currentColor"/><path d="M20 20v-6h-6" stroke="currentColor"/><path d="M4 20l16-16" stroke="currentColor"/></svg>
  ),
  history: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 9-9" stroke="currentColor"/><path d="M3 3v5h5" stroke="currentColor"/><path d="M12 7v5l4 2" stroke="currentColor"/></svg>
  ),
  users: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" stroke="currentColor"/><circle cx="9" cy="7" r="4" stroke="currentColor"/><path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor"/><path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor"/></svg>
  ),
};

export default function Dashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const { '*': subroute } = useParams();
  const navigate = useNavigate();
  const [burgerOpen, setBurgerOpen] = useState(false);
  const [absencesEnCours, setAbsencesEnCours] = useState(0);
  const [tasksEnCours, setTasksEnCours] = useState(0);
  const { socket } = useSocket();
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('calendar');

  const tabToRoute = {
    calendar: '',
    taches: 'taches',
    absence: 'absence',
    remplacement: 'remplacement', 
    historique: 'historique',
    employes: 'employes',
  };
  const routeToTab = {
    '': 'calendar',
    calendar: 'calendar',
    taches: 'taches',
    absence: 'absence',
    remplacement: 'remplacement',
    historique: 'historique',
    employes: 'employes',
  };

  const handleSidebarClick = (key) => {
    navigate(`/dashboard/${tabToRoute[key]}`);
    setActiveTab(key);
    window.dispatchEvent(new CustomEvent("refreshNotifications"));
  };
  
  useEffect(() => {
    const pathParts = location.pathname.split('/');
    let currentRoute = '';
    
    if (pathParts.length >= 3 && pathParts[1] === 'dashboard') {
      currentRoute = pathParts[2] || '';
    }
    
    const matchedTab = routeToTab[currentRoute];
    
    if (matchedTab) {
      setActiveTab(matchedTab);
    } else {
      setActiveTab('calendar');
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.state?.showAbsenceNotif && activeTab === "calendar") {
      window.dispatchEvent(new CustomEvent("absenceDeclared"));
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("refreshNotifications"));
      }, 5000);
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("refreshNotifications"));
      }, 10000);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, activeTab, navigate, location.pathname, location.key]);
  

  useEffect(() => {
    if (!user) return;
    
    async function fetchAbsences() {
      try {
        const absences = await getAllAbsences();
        const enCours = absences.filter(a => a.status === "En attente" || a.status === "en attente" || a.status === "EN_ATTENTE" || a.statut === "En attente" || a.statut === "en attente" || a.statut === "EN_ATTENTE").length;
        setAbsencesEnCours(enCours);
      } catch (e) {
        console.error("Erreur lors du chargement des absences:", e);
        setAbsencesEnCours(0);
      }
    }
    async function fetchTasks() {
      try {
        const res = await axios.get(`${API_URL}/tasks`);
        const tasks = res.data;
        const enCours = Array.isArray(tasks) ? tasks.filter(t => !t.completed).length : 0;
        setTasksEnCours(enCours);
      } catch (e) {
        console.error("Erreur lors du chargement des tâches:", e);
        setTasksEnCours(0);
      }
    }
    fetchAbsences();
    fetchTasks();
    const handlerAbs = () => fetchAbsences();
    const handlerTasks = () => fetchTasks();
    window.addEventListener("refreshAbsenceCounter", handlerAbs);
    window.addEventListener("refreshTaskCounter", handlerTasks);
    return () => {
      window.removeEventListener("refreshAbsenceCounter", handlerAbs);
      window.removeEventListener("refreshTaskCounter", handlerTasks);
    };
  }, [user]);

  useEffect(() => {
    if (socket) {
      socket.on('task-update', (data) => {
        if (data.type === 'delete') {
          setTasks(currentTasks => 
            currentTasks.filter(task => task.id !== data.task.id)
          );
          toast.info("Une tâche a été supprimée");
        }
      });

      return () => {
        socket.off('task-update');
      };
    }
  }, [socket]);


  const isCalendarTab = activeTab === 'calendar';

  const sidebarItems = [
    { key: "calendar", label: "Calendrier", icon: icons.calendar },
    { key: "taches", label: "Mes tâches", icon: icons.tasks },
    { key: "absence", label: "Absence", icon: icons.absence },
    ...(user && (user.role === "ADMIN" || user.role === "MANAGER") ? [{ key: "remplacement", label: "Remplacement", icon: icons.remplacement }] : []),
    { key: "historique", label: "Historique", icon: icons.history },
  ];
  if (user && user.role === "ADMIN") {
    sidebarItems.push({ key: "employes", label: "Employés", icon: icons.users });
  }

  useSocket((event) => {
    if (["absence:created", "absence:updated", "absence:deleted"].includes(event)) {
      window.dispatchEvent(new CustomEvent("refreshAbsenceCounter"));
    }
  });

  return (
    <div className="h-screen w-full">
      <div className="md:hidden flex flex-col h-full bg-accent">
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

        {burgerOpen && (
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
        )}

        <div className="flex gap-4 px-4 pt-6 w-full">
          <div className="flex-1 bg-white rounded-2xl p-5 flex flex-col items-center shadow border border-primary/30 min-w-0">
            <div className="text-2xl font-bold text-secondary">{absencesEnCours}</div>
            <div className="text-secondary mt-1 text-sm">Absences en cours</div>
          </div>
          <div className="flex-1 bg-white rounded-2xl p-5 flex flex-col items-center shadow border border-primary/30 min-w-0">
            <div className="text-2xl font-bold text-secondary">{tasksEnCours}</div>
            <div className="text-secondary mt-1 text-sm">Tâches en cours</div>
          </div>
          <div className="flex-1 bg-white rounded-2xl p-5 flex flex-col items-center shadow border border-primary/30 min-w-0">
            <div className="text-2xl font-bold text-secondary">0</div>
            <div className="text-secondary mt-1 text-sm">Métédées ouverts</div>
          </div>
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          {user ? (
            <Outlet />
          ) : (
            <div className="flex items-center justify-center h-full w-full text-lg text-secondary">
              Chargement du tableau de bord…
            </div>
          )}
        </div>

      </div>

      <div className="hidden md:flex h-screen bg-accent">
        
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
        <main className="flex-1 flex flex-col min-w-0">
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
          <div className="flex gap-6 px-10 py-6">
            <div className="flex-1 bg-white rounded-2xl p-6 flex flex-col items-center shadow border border-primary/30">
              <div className="text-3xl font-bold text-secondary">{absencesEnCours}</div>
              <div className="text-secondary mt-2">Absences en cours</div>
            </div>
            <div className="flex-1 bg-white rounded-2xl p-6 flex flex-col items-center shadow border border-primary/30">
              <div className="text-3xl font-bold text-secondary">{tasksEnCours}</div>
              <div className="text-secondary mt-2">Tâches en cours</div>
            </div>
            <div className="flex-1 bg-white rounded-2xl p-6 flex flex-col items-center shadow border border-primary/30">
              <div className="text-3xl font-bold text-secondary">0</div>
              <div className="text-secondary mt-2">Mes tickets ouverts</div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row flex-1 gap-6 px-4 md:px-10 pb-10 min-h-0">
            <section className="flex-1 bg-white rounded-2xl shadow p-6 overflow-y-auto flex flex-col min-h-0">
              {user ? (
                <Outlet />
              ) : (
                <div className="flex items-center justify-center h-full w-full text-lg text-secondary">
                  Chargement du tableau de bord…
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

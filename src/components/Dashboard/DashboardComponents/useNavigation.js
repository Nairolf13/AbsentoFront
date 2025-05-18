import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from "react-router-dom";

export default function useNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { '*': subroute } = useParams();
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
      // Une seule fois suffit pour rafraîchir les notifications
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("refreshNotifications"));
      }, 5000);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, activeTab, navigate, location.pathname, location.key]);

  return {
    activeTab,
    handleSidebarClick
  };
}

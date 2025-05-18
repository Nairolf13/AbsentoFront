import { useState } from "react";
import { useAuth } from "../../context/AuthProvider";

// Importation des composants extraits
import MobileView from "./DashboardComponents/MobileView";
import DesktopView from "./DashboardComponents/DesktopView";

// Importation des hooks personnalisés
import useNavigation from "./DashboardComponents/useNavigation";
import useDashboardData from "./DashboardComponents/useDashboardData";

export default function Dashboard() {
  const { user } = useAuth();
  const [burgerOpen, setBurgerOpen] = useState(false);
  
  // Utilisation des hooks personnalisés
  const { activeTab, handleSidebarClick } = useNavigation();
  const { absencesEnCours, tasksEnCours } = useDashboardData(user);

  return (
    <div className="h-screen w-full">
      <MobileView 
        user={user}
        activeTab={activeTab}
        burgerOpen={burgerOpen}
        setBurgerOpen={setBurgerOpen}
        absencesEnCours={absencesEnCours}
        tasksEnCours={tasksEnCours}
        handleSidebarClick={handleSidebarClick}
      />

      <DesktopView 
        user={user}
        activeTab={activeTab}
        handleSidebarClick={handleSidebarClick}
        absencesEnCours={absencesEnCours}
        tasksEnCours={tasksEnCours}
      />
    </div>
  );
}

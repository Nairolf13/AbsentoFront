import TopBar from './TopBar';
import StatCards from './StatCards';
import Sidebar from './Sidebar';
import MainContent from './MainContent';

export default function MobileView({ 
  user,
  activeTab,
  burgerOpen,
  setBurgerOpen,
  absencesEnCours,
  tasksEnCours,
  handleSidebarClick
}) {
  return (
    <div className="md:hidden flex flex-col h-full bg-accent">
      <TopBar 
        user={user} 
        isMobile={true} 
        burgerOpen={burgerOpen} 
        setBurgerOpen={setBurgerOpen} 
      />
      
      <Sidebar 
        user={user}
        activeTab={activeTab}
        handleSidebarClick={handleSidebarClick}
        isMobile={true}
        burgerOpen={burgerOpen}
        setBurgerOpen={setBurgerOpen}
      />
      
      <StatCards 
        absencesEnCours={absencesEnCours} 
        tasksEnCours={tasksEnCours} 
        isMobile={true} 
      />
      
      <MainContent user={user} isMobile={true} />
    </div>
  );
}

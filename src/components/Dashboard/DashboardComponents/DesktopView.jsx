import TopBar from './TopBar';
import StatCards from './StatCards';
import Sidebar from './Sidebar';
import MainContent from './MainContent';

export default function DesktopView({ 
  user, 
  activeTab, 
  handleSidebarClick,
  absencesEnCours,
  tasksEnCours
}) {
  return (
    <div className="hidden md:flex h-screen bg-accent">
      <Sidebar 
        user={user}
        activeTab={activeTab}
        handleSidebarClick={handleSidebarClick}
      />
      
      <main className="flex-1 flex flex-col min-w-0">
        <TopBar user={user} />
        
        <StatCards 
          absencesEnCours={absencesEnCours} 
          tasksEnCours={tasksEnCours} 
        />
        
        <MainContent user={user} />
      </main>
    </div>
  );
}

export default function StatCards({ absencesEnCours, tasksEnCours, isMobile = false }) {
  const mobileClasses = "flex-1 bg-white rounded-2xl p-5 flex flex-col items-center shadow border border-primary/30 min-w-0";
  const desktopClasses = "flex-1 bg-white rounded-2xl p-6 flex flex-col items-center shadow border border-primary/30";
  
  const containerClasses = isMobile ? mobileClasses : desktopClasses;
  const textSizeClass = isMobile ? "text-2xl" : "text-3xl";
  const subtextClasses = isMobile ? "text-secondary mt-1 text-sm" : "text-secondary mt-2";

  return (
    <div className={`flex gap-${isMobile ? '4' : '6'} ${isMobile ? 'px-4 pt-6' : 'px-10 py-6'} w-full`}>
      <div className={containerClasses}>
        <div className={`${textSizeClass} font-bold text-secondary`}>{absencesEnCours}</div>
        <div className={subtextClasses}>Absences en cours</div>
      </div>
      <div className={containerClasses}>
        <div className={`${textSizeClass} font-bold text-secondary`}>{tasksEnCours}</div>
        <div className={subtextClasses}>Tâches en cours</div>
      </div>
      <div className={containerClasses}>
        <div className={`${textSizeClass} font-bold text-secondary`}>0</div>
        <div className={subtextClasses}>
          {isMobile ? "Métédées ouverts" : "Mes tickets ouverts"}
        </div>
      </div>
    </div>
  );
}

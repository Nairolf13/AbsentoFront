import { Outlet } from "react-router-dom";

export default function MainContent({ user, isMobile = false }) {
  if (isMobile) {
    return (
      <div className="flex-1 flex flex-col min-h-0">
        {user ? (
          <Outlet />
        ) : (
          <div className="flex items-center justify-center h-full w-full text-lg text-secondary">
            Chargement du tableau de bord…
          </div>
        )}
      </div>
    );
  }

  return (
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
  );
}

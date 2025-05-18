import React, { useRef, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { BackHeader, NotificationList, useNotifications } from "./NotificationComponents";
import "./binButton.css";

/**
 * Composant principal des notifications
 * Gère l'affichage et les interactions avec les notifications
 */
export default function Notifications({ onCountChange }) {
  const { user } = useAuth();
  const [show, setShow] = useState(true);
  const notifRef = useRef();
  
  // Utilisation du hook personnalisé pour gérer les notifications
  const { 
    notifications, 
    handleDelete, 
    handleMarkAsRead 
  } = useNotifications(user, onCountChange);

  // Gestion du clic à l'extérieur pour fermer les notifications (desktop uniquement)
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) return;
    
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShow(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Ne rien afficher si l'utilisateur a fermé les notifications
  if (!show) return null;

  // Navigation vers la page précédente
  const navigateBack = () => {
    if (window.innerWidth <= 768) {
      window.location.href = "/dashboard";
    } else {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = "/";
      }
    }
  };

  // Détection du mode mobile
  const isMobile = window.innerWidth <= 768;

  return (
    <div
      ref={notifRef}
      className={`bg-white shadow-lg w-full ${isMobile ? 'fixed inset-0 z-50 rounded-none h-full overflow-auto' : 'rounded-2xl max-w-xl mx-auto'} px-8 py-10`}
      style={isMobile ? { minHeight: '100vh', maxHeight: '100vh' } : { maxWidth: '520px', minWidth: '420px' }}
    >
      {/* Affichage du bouton de retour sur mobile */}
      {isMobile && <BackHeader onBack={navigateBack} />}
      
      {/* Titre */}
      <h4 className="font-semibold text-xl mb-4 text-primary text-center">Notifications</h4>
      
      {/* Liste des notifications */}
      <NotificationList 
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onDelete={handleDelete}
      />
    </div>
  );
}

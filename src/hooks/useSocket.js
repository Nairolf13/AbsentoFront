import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { getToken } from '../utils/auth';

/**
 * Hook useSocket - Version améliorée supportant deux modes d'utilisation:
 * 1. Sans callback: renvoie { socket, isConnected }
 * 2. Avec callback: exécute le callback sur les événements de socket et renvoie { socket, isConnected }
 * 
 * @param {function} callback - Fonction à appeler quand un événement socket se produit (optionnel)
 * @returns {object} - { socket, isConnected }
 */
const useSocket = (callback) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  // Stocker le callback dans un ref pour éviter des re-connexions inutiles
  const callbackRef = useRef(callback);
  // Une référence pour stocker le singleton du socket
  const socketRef = useRef(null);
  
  // Mettre à jour la référence du callback quand il change
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    // Réutiliser l'instance de socket si elle existe déjà
    if (!socketRef.current) {
      socketRef.current = io(import.meta.env.VITE_API_URL, {
        withCredentials: true,
        auth: { token }
      });
      
      socketRef.current.on('connect', () => {
        console.log('Connecté au socket');
        setIsConnected(true);
        
        const user = getCurrentUser(); 
        if (user && user.id) {
          socketRef.current.emit('identify', user.id);
        }
      });

      socketRef.current.on('disconnect', () => {
        console.log('Déconnecté du socket');
        setIsConnected(false);
      });

      // Ajouter les écouteurs pour tous les événements pertinents
      const eventsToListen = ['absence:created', 'absence:updated', 'absence:deleted', 'notification', 'task-update'];
      eventsToListen.forEach(eventName => {
        socketRef.current.on(eventName, (payload) => {
          // Si un callback est fourni, l'appeler avec l'événement et les données
          if (callbackRef.current) {
            callbackRef.current(eventName, payload);
          }
        });
      });
    }

    // Définit le socket dans l'état
    setSocket(socketRef.current);
    setIsConnected(socketRef.current.connected);
  }, []); // Dépendances vides pour s'assurer que cette logique ne s'exécute qu'une fois

  return { socket, isConnected };
};

const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export default useSocket;

import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { getToken } from '../utils/auth';

const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const newSocket = io(import.meta.env.VITE_API_URL, {
      withCredentials: true,
      auth: { token }
    });

    newSocket.on('connect', () => {
      console.log('Connecté au socket');
      setIsConnected(true);
      
    
      const user = getCurrentUser(); 
      if (user && user.id) {
        newSocket.emit('identify', user.id);
      }
    });

    newSocket.on('disconnect', () => {
      console.log('Déconnecté du socket');
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

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

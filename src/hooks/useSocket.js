import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthProvider';

const SOCKET_URL = import.meta.env.VITE_API_URL.replace(/\/api$/, '');

export default function useSocket(onEvent) {
  const socketRef = useRef(null);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;
    socketRef.current = io(SOCKET_URL, {
      auth: { token }
    });
    const socket = socketRef.current;
    if (onEvent) {
      socket.onAny((event, ...args) => onEvent(event, ...args));
    }
    return () => {
      socket.disconnect();
    };
  }, [onEvent, token]);

  return socketRef.current;
}

import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL.replace(/\/api$/, '');

export default function useSocket(onEvent) {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL);
    const socket = socketRef.current;
    if (onEvent) {
      socket.onAny((event, ...args) => onEvent(event, ...args));
    }
    return () => {
      socket.disconnect();
    };
  }, [onEvent]);

  return socketRef.current;
}

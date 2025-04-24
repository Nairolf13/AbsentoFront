// Configuration de l'URL de l'API backend
import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL;

// Plus d'interceptor pour Authorization, juste forcer withCredentials
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

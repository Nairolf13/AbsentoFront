// Configuration de l'URL de l'API backend
const localApiUrl = "http://localhost:5000/api";
const networkApiUrl = import.meta.env.VITE_API_URL;

// Choisir automatiquement en fonction de l'environnement (localhost ou réseau)
export const API_URL =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? localApiUrl
    : networkApiUrl;

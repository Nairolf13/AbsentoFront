import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Utilise process.env.PORT pour la compatibilité avec CJS
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5173;

export default defineConfig({
  plugins: [react()],
  server: {
    port: port,
    strictPort: true // échoue si le port est déjà pris
  }
});

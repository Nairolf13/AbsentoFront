import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: import.meta.env.PORT,
    strictPort: true // échoue si le port est déjà pris
  }
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5173;

export default defineConfig({
  plugins: [react()],
  server: {
    port: port,
    strictPort: true
  }
});

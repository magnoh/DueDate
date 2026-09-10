import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// @ts-ignore
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3333',
        changeOrigin: true,
      },
      '/health': {
        target: 'http://localhost:3333',
        changeOrigin: true,
      },
    },
  },
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },

  build: {
    outDir: 'dist',
    // Temporarily enable source maps to help debug production runtime errors
    // (set to false or remove before final production deploy).
    sourcemap: true
  }
});

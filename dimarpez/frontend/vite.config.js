import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: 'public',
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        // ¡NO USES rewrite! Elimina esa línea
      }
    }
  },
  resolve: {
    alias: {
      '@services': path.resolve(__dirname, 'src/services')
    }
  }
});
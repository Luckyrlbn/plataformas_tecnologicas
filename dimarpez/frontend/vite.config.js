import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: 'public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'plataformastecnologicas-production.up.railway.app',
        changeOrigin: true,
      }
    }
  },
  resolve: {
    alias: {
      '@services': path.resolve(__dirname, 'src/services')
    }
  }
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Site publié sur https://acat3s.github.io/Storage-Site/
  base: '/Storage-Site/',
  build: {
    // Même dossier qu'avec react-scripts : gh-pages et le Dockerfile publient build/
    outDir: 'build',
  },
  server: {
    port: 3000,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
  },
});

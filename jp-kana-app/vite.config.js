import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nextReactRouter } from 'vite-plugin-next-react-router';

export default defineConfig({
  plugins: [
    react(),
    nextReactRouter(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
  },
});
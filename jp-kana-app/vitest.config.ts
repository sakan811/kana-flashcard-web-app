import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['**/*.test.ts', '**/*.test.tsx'],
    exclude: [
      '**/node_modules/**',
      '**/.next/**',
      '**/dist/**',
    ],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/setup.ts',
        '.next/',
        '**/*.d.ts',
      ],
    },
    testTimeout: 20000,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});

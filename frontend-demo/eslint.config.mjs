import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import pluginReact from 'eslint-plugin-react';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],  // Include JavaScript and TypeScript file extensions
    ignores: ['node_modules/**', 'dist/**'],  // Exclude dependencies and build output
    languageOptions: {
      globals: {
        ...globals.browser,
        jest: true,  // Jest testing framework
        'vitest/globals': true,  // Vitest testing framework
      },
      parser: tsParser,  // Set TypeScript parser
      parserOptions: {
        ecmaVersion: 'latest',  // Use the latest ECMAScript version
        sourceType: 'module',   // Enable ES module support
        ecmaFeatures: {
          jsx: true,  // Enable JSX support for React
        },
      },
    },
    settings: {
      react: {
        version: 'detect',  // Automatically detect React version
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,  // TypeScript ESLint plugin
    },
    rules: {
      ...tseslint.configs.recommended.rules,  // Use the recommended TypeScript rules
    },
  },
  pluginJs.configs.recommended,  // Use the recommended JavaScript rules
  pluginReact.configs.flat.recommended,  // Use the recommended React rules (flat config)
];

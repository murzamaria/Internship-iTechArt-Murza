import js from '@eslint/js';
import globals from 'globals';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    rules: js.configs.recommended.rules,
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
  },
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    plugins: { '@typescript-eslint': tsPlugin },
    rules: tsPlugin.configs.recommended.rules,
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
  },
  {
    ignores: ['package.json', 'package-lock.json', 'test-results/**/*.json'],
  },
];

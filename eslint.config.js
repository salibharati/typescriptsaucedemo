import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: [
      'node_modules',
      'playwright-report',
      'test-results',
      'allure-results',
      'allure-report',
      '**/*-snapshots/**',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Type-aware rule: catch missing awaits on Playwright's async API.
  {
    files: ['**/*.ts'],
    languageOptions: {
      globals: { ...globals.node },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
    },
  },

  // Playwright-specific best-practice rules for the test files.
  {
    ...playwright.configs['flat/recommended'],
    files: ['tests/**/*.ts'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      // Assertions are encapsulated in Page Object `expect*` helpers, which
      // this rule cannot statically see - it would false-positive on POM tests.
      'playwright/expect-expect': 'off',
    },
  },

  // Keep ESLint out of Prettier's way (formatting handled by Prettier).
  prettier,
);

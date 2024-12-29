import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,

      // Adjusting rules for leniency
      'react/jsx-no-target-blank': 'warn', // Warning instead of turning off
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'no-console': 'off', // Allow console logs
      'no-unused-vars': 'warn', // Warn for unused variables but don't throw errors
      'eqeqeq': 'warn', // Warn for non-strict equality checks instead of error
      'curly': 'warn', // Warn instead of error for missing curly braces
      'consistent-return': 'warn', // Warning for inconsistent return statements
      'no-debugger': 'warn', // Allow debugger statements with a warning
      'no-eval': 'warn', // Warn for eval() usage
      'no-implied-eval': 'warn', // Warn for implied eval()
    },
  },
];

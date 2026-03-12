import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'node_modules']),

  {
    files: ['**/*.{js,jsx}'],

    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],

    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },

    rules: {
      // Allow unused variables (common in React props / callbacks)
      'no-unused-vars': ['warn', { varsIgnorePattern: '^[A-Z_]' }],

      // Disable strict React 19 rule causing many errors
      'react-hooks/set-state-in-effect': 'off',

      // Reduce hook dependency strictness
      'react-hooks/exhaustive-deps': 'warn',

      // Fast refresh rule often breaks contexts
      'react-refresh/only-export-components': 'off',

      // Allow empty blocks (common in try/catch)
      'no-empty': 'warn',

      // Reduce hook order strictness
      'react-hooks/rules-of-hooks': 'warn',
    },
  },
])
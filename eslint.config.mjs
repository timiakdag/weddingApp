// ESLint flat config. CRA used to lint inside its build; Vite doesn't lint at all, so run
// `npm run lint` yourself (the editor's ESLint extension also picks this file up).
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  // Build output, secrets backups and the import script aren't app source.
  { ignores: ['dist/', 'build/', 'envBackup/', 'csvFolder/'] },

  js.configs.recommended,
  reactHooks.configs.flat.recommended,

  // App code: browser globals (localStorage, setTimeout...) and JSX parsing. Listing .jsx here is
  // what makes ESLint lint those files at all; by default it only picks up .js/.mjs/.cjs.
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // Already "warn" in recommended. Kept here so it's visible: this is the rule that catches
      // missing effect dependencies.
      'react-hooks/exhaustive-deps': 'warn',
    },
  },

  // tailwind.config.js and postcss.config.js are CommonJS files that Node runs.
  {
    files: ['*.config.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: globals.node,
    },
  },
];

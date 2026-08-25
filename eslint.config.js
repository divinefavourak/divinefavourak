import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),

  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    plugins: { react },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      // Without this, any binding used ONLY inside JSX — `motion` in
      // <motion.div>, `Icon` in <Icon /> — is reported as unused.
      // That was drowning real findings in false positives.
      'react/jsx-uses-vars': 'error',
      'react/jsx-uses-react': 'error',
      // No varsIgnorePattern. It existed to stop capitalised
      // components being flagged, which jsx-uses-vars now handles
      // properly — and while it was there it also silenced genuinely
      // unused imports and dead constants.
      //
      // ignoreRestSiblings allows the omit-a-key idiom
      // (`const { [k]: _drop, ...rest } = obj`), where the binding is
      // deliberately unused because extracting it is the point.
      'no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
    },
  },

  // Config files and the serverless handler run in Node, not the
  // browser, and need Node's globals rather than the browser set.
  {
    files: ['vite.config.js', 'eslint.config.js', 'api/**/*.js'],
    languageOptions: { globals: { ...globals.node } },
  },

  // The Express backend is CommonJS, so it needs both Node globals
  // and the script source type — otherwise every require/module is
  // reported as undefined.
  {
    files: ['backend/**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { ...globals.node },
    },
    rules: {
      // ESLint replaces a rule's options wholesale rather than
      // merging them, so this restates everything the base block
      // sets. Express error middleware must declare four parameters
      // to be recognised as error middleware, even when `next` goes
      // unused.
      'no-unused-vars': ['error', { argsIgnorePattern: '^(_|next$)' }],
    },
  },

  {
    // The canvas games were ported from standalone HTML builds with
    // their logic intentionally unchanged. They carry a few unused
    // leftovers from their original authoring; flagging those every
    // run would just train us to ignore the linter.
    files: ['src/games/engines/**/*.js'],
    rules: { 'no-unused-vars': 'off' },
  },

  {
    // These modules deliberately export both components and the data
    // the OS drives read. Splitting them to satisfy fast-refresh
    // would fragment the legacy code for no runtime benefit.
    files: ['src/os/**/*.jsx'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
])

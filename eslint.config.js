// @ts-check
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      '**/playwright-report/**',
      '**/test-results/**',
      'scripts/**',
      '.claude/**',
      'spec/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.strict,
  {
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  {
    files: ['apps/web/**/*.{ts,tsx}'],
    languageOptions: { globals: { ...globals.browser } },
    plugins: { 'react-hooks': reactHooks },
    rules: reactHooks.configs.recommended.rules,
  },
  // Tests index fixtures they just built; `!` is clearer there than a guard.
  {
    files: ['**/*.test.{ts,tsx}'],
    rules: { '@typescript-eslint/no-non-null-assertion': 'off' },
  },
  // Engine purity (bearings hard rule 10): pure functions over plain data.
  {
    files: ['packages/engine/src/**/*.ts'],
    ignores: ['packages/engine/src/**/*.test.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        { selector: 'ClassDeclaration', message: 'Engine is a functional core: no classes.' },
        { selector: 'ClassExpression', message: 'Engine is a functional core: no classes.' },
      ],
      'no-restricted-globals': [
        'error',
        { name: 'Date', message: 'No wall-clock time in the engine; pass values in.' },
        { name: 'performance', message: 'No wall-clock time in the engine.' },
      ],
      'no-restricted-properties': [
        'error',
        { object: 'Math', property: 'random', message: 'Use the seeded engine RNG in GameState.' },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['node:*'], message: 'Engine does no I/O.' },
            { group: ['react', 'react-dom', 'react/*'], message: 'Engine has no DOM or UI.' },
            { group: ['**/apps/**', '@survival/web'], message: 'Engine never imports the app.' },
          ],
        },
      ],
    },
  },
)

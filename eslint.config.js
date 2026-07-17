// ESLint flat config — scoped to real-bug rules first (ENGINEERING_PRACTICES),
// tighten incrementally rather than churning the codebase.
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';

export default tseslint.config(
  { ignores: ['dist', 'dev-dist', 'node_modules'] },
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-floating-promises': 'off', // needs type-aware linting; typecheck covers most
      'no-console': 'off', // console is the structured log sink (util/log.ts)
    },
  },
);

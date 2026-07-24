// ESLint flat config — scoped to real-bug rules first (ENGINEERING_PRACTICES),
// tighten incrementally rather than churning the codebase.
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';

export default tseslint.config(
  {
    ignores: [
      'dist',
      'dev-dist',
      'node_modules',
      // Reference-only originals this project's UI components were tailored
      // from — not part of the app, written against react-native/@retayl/*
      // which aren't installed here. See components/redundant/MANIFEST.md.
      'src/components/redundant',
    ],
  },
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-floating-promises': 'off', // needs type-aware linting; typecheck covers most
      'no-console': 'off', // console is the structured log sink (util/log.ts)
      // ENGINEERING_PRACTICES.md: "Keep files small. If a class/component
      // grows past ~300 lines, split it."
      'max-lines': ['error', { max: 300, skipBlankLines: true, skipComments: true }],
    },
  },
  {
    // GENERATED data tables (scripts/generate-*.py) — line count tracks the
    // source workbook's row count, not hand-authored complexity, so the
    // 300-line split rule doesn't apply here.
    files: ['src/domain/taxonomy.ts', 'src/domain/lookups.ts', 'src/domain/deficiencyReference.ts', 'src/domain/formOptions.ts'],
    rules: {
      'max-lines': 'off',
    },
  },
);

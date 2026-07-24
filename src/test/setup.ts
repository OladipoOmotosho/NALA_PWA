// IndexedDB shim so Dexie runs in Node tests (practices: tests never touch real services).
import 'fake-indexeddb/auto';
// RTL matchers (toBeInTheDocument, etc.) — harmless in the default node environment,
// active for the per-file `@vitest-environment jsdom` component tests.
import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// vitest.config.ts doesn't set test.globals, so RTL's own auto-cleanup (which
// only registers if it detects a global `afterEach`) never fires — wire it
// explicitly. No-ops when nothing was rendered (node-environment test files).
afterEach(() => {
  cleanup();
});

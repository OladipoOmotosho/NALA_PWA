/**
 * Design tokens for the ui/ component library.
 *
 * Adapted from the Retayl components' `@retayl/hooks` useTheme() +
 * `@retayl/utils` token modules (fontSize, spacing, radius, etc.) — that
 * whole package doesn't exist in this project, so instead of porting it,
 * these tokens are read from the CSS custom properties already defined in
 * styles.css (--bg, --teal, --line, ...). One source of truth, zero new
 * dependencies, and it stays in sync with the rest of the app automatically.
 */

export const colors = {
  bg: 'var(--bg)',
  card: 'var(--card)',
  line: 'var(--line)',
  text: 'var(--text)',
  muted: 'var(--muted)',
  teal: 'var(--teal)',
  tealDark: 'var(--teal-dark)',
  red: 'var(--red)',
  amber: 'var(--amber)',
  green: 'var(--green)',
  inputBg: '#0e1626',
  overlay: 'rgba(0, 0, 0, 0.6)',
} as const;

/** 4px base scale — matches the spacing already used by hand throughout styles.css. */
export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;

export const radius = {
  sm: 8,
  md: 10,
  lg: 12,
  xl: 14,
  full: 999,
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 15,
  lg: 17,
  xl: 18,
} as const;

/** Minimum interactive target — PRD §9.5 "large tap targets", gloved use. */
export const minTouchTarget = 48;

export const transition = {
  fast: '120ms ease',
  base: '150ms ease',
} as const;

export const zIndex = {
  dropdown: 60,
  modal: 100,
  tooltip: 120,
} as const;

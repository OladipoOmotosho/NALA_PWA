/**
 * Design tokens for the ui/ component library.
 *
 * Adapted from the Retayl components' `@retayl/hooks` useTheme() +
 * `@retayl/utils` token modules — that whole package doesn't exist in this
 * project, so instead of porting it, these tokens are read from the CSS
 * custom properties already defined in styles.css (--bg, --teal, --line,
 * ...). One source of truth, zero new dependencies, and it stays in sync
 * with the rest of the app automatically.
 *
 * Scope, post-Tailwind (2026-07-24): every component's own visual states
 * are now CSS classes (see each Component.module.css, written with
 * Tailwind's @apply against the @theme mapping in styles.css) — radius,
 * transition-duration and the 48px touch-target minimum moved there and
 * were removed from here. What's left is only what's still genuinely read
 * from JS: color/font-size props passed straight to lucide icons or used
 * as Text's per-instance defaults (not expressible as a class since callers
 * pass arbitrary values, not a finite enum), and the couple of truly
 * dynamic position/z-index values in Select/Autocomplete/Tooltip's portals.
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
  inputBg: 'var(--input-bg)',
  overlay: 'var(--overlay)',
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

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 15,
  lg: 17,
  xl: 18,
} as const;

export const zIndex = {
  dropdown: 60,
  modal: 100,
  tooltip: 120,
} as const;

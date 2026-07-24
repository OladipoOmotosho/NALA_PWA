# UI component library — technical documentation

`src/ui/` is this project's own component library, tailored 2026-07-24 from
Dipo's "retayl" project component set. The originals were written for React
Native (+ react-native-web) and a `@retayl/*` workspace package that don't
exist here — this project is plain Vite + React DOM. Every component below
was rewritten against HTML/CSS, themed off this app's own CSS custom
properties (`src/ui/theme.ts`).

**Wired into every screen** (2026-07-24) — Button, TextInput, Autocomplete,
Modal, StatusBadge, Tooltip, and Spinner are in active use across Capture,
Records, Diagnostics, and Settings. `fields.tsx`'s native-`<select>`-backed
`Select`/`YesNo` and the native Inspection Date / hidden file input are
deliberately kept as-is — see those screens' own comments for why.

See `src/components/redundant/MANIFEST.md` for the full accounting of every
original file: what it became, or why it was left out.

## Components

| Component | File | Doc |
| --- | --- | --- |
| Button | `ui/Button.tsx` | [Button.md](./Button.md) |
| Text | `ui/Text.tsx` | [Text.md](./Text.md) |
| Checkbox | `ui/Checkbox.tsx` | [Checkbox.md](./Checkbox.md) |
| Radio | `ui/Radio.tsx` | [Radio.md](./Radio.md) |
| Switch | `ui/Switch.tsx` | [Switch.md](./Switch.md) |
| TextInput | `ui/TextInput.tsx` | [TextInput.md](./TextInput.md) |
| Select | `ui/Select.tsx` | [Select.md](./Select.md) |
| Modal | `ui/Modal.tsx` | [Modal.md](./Modal.md) |
| Tooltip | `ui/Tooltip.tsx` | [Tooltip.md](./Tooltip.md) |
| Spinner | `ui/Spinner.tsx` | [Spinner.md](./Spinner.md) |
| Autocomplete | `ui/Autocomplete.tsx` | [Autocomplete.md](./Autocomplete.md) |
| StatusBadge | `ui/StatusBadge.tsx` | [StatusBadge.md](./StatusBadge.md) |

Shared foundation, not components themselves:

- `ui/theme.ts` — the JS-side mirror of `src/styles.css`'s CSS custom
  properties (`colors`), plus the small `spacing`/`fontSize`/`zIndex` scales.
  Only genuinely dynamic/computed JS values (portal positioning, SVG
  geometry, per-instance numeric props/defaults) read from `theme.ts` now —
  everything else is a Tailwind utility class (see "Styling" below).
  `radius`, `minTouchTarget`, and `transition` were removed once nothing
  referenced them anymore (radius now lives in `styles.css`'s `@theme`
  block instead).
- Icons come from `lucide-react` directly (imported at each call site — no
  wrapper module). Originally a hand-rolled inline-SVG set (`ui/icons.tsx`)
  to avoid adding a dependency; Dipo asked to switch to lucide 2026-07-24
  once the library was actually in use, so that file is gone.
- `ui/ui.css` — the one shared keyframe (`@keyframes ui-spin`, used by the
  Spinner and the loading state on Button/lucide's `Loader2`). Imported once
  at the app root (`main.tsx`).

## Conventions

- **Every component is a plain function component, no HOCs, no context
  providers.** Nothing needs a `<ThemeProvider>` wrapper — theme values are
  read directly from `theme.ts` at import time.
- **Controlled only.** Every input-like component (`TextInput`, `Select`,
  `Checkbox`, `Radio`, `Switch`, `Autocomplete`) takes `value`/`checked` +
  an `onChange`/`onChangeText` callback. None hold their own uncontrolled
  state for the value itself (only for transient UI state like "is the
  dropdown open").
- **One runtime dependency: `lucide-react`** (icons). Everything else —dates,
  portals, positioning— is either a browser API (`react-dom`'s
  `createPortal`, `getBoundingClientRect`) or hand-rolled.
- **Touch targets ≥ 48px by default**, per this app's existing PRD
  requirement (gloved, outdoor, one-handed use) — every interactive
  component's default size is `min-h-12`/`min-w-12` (48px) in its own
  `*.module.css`. The one documented exception is `Button`'s `size="sm"`
  (40px), a deliberate opt-in for dense contexts (see [Button.md](./Button.md));
  reach for it only where that tradeoff is explicitly warranted, never as
  the default.

## Styling

Two migrations, both still in force:

**2026-07-24, CSS Modules, co-located.** Every component and screen used to
share one 500-line global `src/styles.css` grab-bag, with `ui/` components
styled via inline style objects. Neither scaled — no separation of concerns,
no atomicity, and a global stylesheet nobody could safely edit without
grepping the whole app first. Fix: every component/screen owns a co-located
`*.module.css` next to its `.tsx` (`Button.tsx` + `Button.module.css`); Vite
scopes the class names automatically. Genuinely cross-cutting layout atoms
used identically by 2+ unrelated components (`.card`, `.field`, `.grid2`,
`.toast`, …) live in one explicit `src/styles/primitives.module.css` instead
of being duplicated — the one deliberate exception to "co-located only".
Class names are camelCase, not kebab-case (`fieldLabel`, not `field-label`)
since CSS Modules classes become JS object keys.

**2026-07-24, Tailwind coupled in via `@apply`.** Every `*.module.css` file's
declarations are now written as Tailwind utility classes composed with
`@apply`, rather than hand-written CSS properties — same files, same
co-location, same camelCase class names, same `primitives.module.css`
exception; only the vocabulary *inside* each rule changed. JSX never
contains a raw Tailwind utility className directly — that would collapse
the separation of concerns this whole convention exists to protect, putting
styling vocabulary back in the markup instead of behind a named class.

```css
/* Tooltip.module.css */
@reference '#styles.css';

.trigger {
  @apply inline-flex min-h-12 min-w-12 cursor-pointer items-center justify-center;
}
```

Mechanics:

- **`@reference '#styles.css';` is required at the top of every file that
  uses `@apply`.** Tailwind v4 compiles each CSS Modules file in isolation,
  so without it `@apply` can't see this app's `@theme` mapping (or even
  Tailwind's own utilities) and the build fails loudly — "Cannot apply
  unknown utility class". `#styles.css` is a Node subpath import
  (`package.json`'s `imports` field, pointing at `src/styles.css`) rather
  than a relative path, so it's identical in every file regardless of
  nesting depth.
- **`src/styles.css`'s `@theme inline { ... }` block maps this app's own
  design tokens into Tailwind's theme** — `--color-teal: var(--teal)`, etc. —
  so `bg-teal`, `text-muted`, `border-line` resolve to this app's own CSS
  custom properties, not Tailwind's stock palette. The `--radius-*` scale is
  overridden outright (not extended) so `rounded-sm/md/lg/xl` mean exactly
  what they meant pre-Tailwind (8/10/12/14px). One source of truth either
  way: change a value in `:root`, every `@apply`'d component picks it up.
- **Arbitrary values (`px-[14px]`, `bg-[#1a2438]`) are expected, not a
  smell** — this app's spacing/radius/color values predate Tailwind and
  don't all land on its default scale. Prefer the canonical scale step when
  one exists (`gap-2.5` over `gap-[10px]`; Tailwind's spacing scale
  includes half-steps down to 2px) and fall back to brackets when it
  doesn't.
- **`src/styles.css` is still global scope, intentionally minimal**: the
  `@import 'tailwindcss'`, the `@theme` mapping, `:root` tokens, and the
  cross-browser reset for bare native form controls (`fields.tsx`'s
  `<select>`, the Inspection Date and hidden file `<input>`s). It also
  restores default `<p>` spacing that Tailwind's Preflight reset zeroes,
  since most bare paragraphs in this app don't carry their own spacing
  class. Nothing else belongs there.
- **Genuinely dynamic values stay inline**: DOM-measured positions
  (`getBoundingClientRect` for `Select`/`Autocomplete`/`Tooltip`'s portals),
  SVG geometry (`Spinner`'s stroke-dashoffset math), and arbitrary
  per-instance props (`Text`'s `size`/`color`) are the accepted exceptions —
  everything else is a class.
- **Enforced, not just documented** — CI runs `stylelint` (`yarn lint:css`)
  with a rule that forbids any class selector in `src/styles.css` itself, so
  the global file mechanically cannot regrow into a monolith. ESLint's
  `max-lines` rule (300, per `.agent/ENGINEERING_PRACTICES.md`) applies to
  every `.ts`/`.tsx` file for the same reason, with the regenerated
  `domain/*.ts` data tables (taxonomy, lookups, …) explicitly excluded since
  their size tracks the source workbook, not hand-authored complexity.
  stylelint's `import-notation` rule is pinned to `"string"` (not the
  standard config's default `"url"`) because Tailwind specifically expects
  `@import 'tailwindcss';` as a bare string.

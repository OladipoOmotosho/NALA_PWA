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

- `ui/theme.ts` — color/spacing/radius/font-size tokens, all backed by the
  CSS custom properties already defined in `src/styles.css`. Change a value
  in one place, every component picks it up. Only genuinely dynamic/computed
  JS values (portal positioning, SVG geometry, per-instance numeric props)
  read from `theme.ts` directly now — everything else is a CSS class (see
  "Styling" below).
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
  component's default size respects `theme.minTouchTarget`. The one
  documented exception is `Button`'s `size="sm"` (40px), a deliberate
  opt-in for dense contexts (see [Button.md](./Button.md)); reach for it
  only where that tradeoff is explicitly warranted, never as the default.

## Styling (2026-07-24 migration: CSS Modules, co-located)

Every component and screen used to share one 500-line global `src/styles.css`
grab-bag, with `ui/` components styled via inline style objects. Neither
scaled — no separation of concerns, no atomicity, and a global stylesheet
nobody could safely edit without grepping the whole app first. The fix:

- **Every component/screen owns a co-located `*.module.css`** next to its
  `.tsx` (`Button.tsx` + `Button.module.css`). Vite scopes the class names
  automatically; import as `import styles from './Button.module.css'` and
  reference `styles.foo`. Compose conditional/modifier classes with the tiny
  `ui/cx.ts` helper — no `classnames`/`clsx` dependency.
- **`src/styles.css` is global scope, intentionally minimal**: `:root` design
  tokens (the CSS custom properties `theme.ts` reads) and the cross-browser
  reset for bare native form controls (`fields.tsx`'s `<select>`, the
  Inspection Date and hidden file `<input>`s — nothing else styles these
  directly). Nothing else belongs there.
- **Genuinely cross-cutting layout atoms** — used identically by 2+ unrelated
  components (`.card`, `.field`, `.grid2`, `.toast`, …) — live in one
  explicit `src/styles/primitives.module.css`, imported where needed. This is
  the one deliberate exception to "co-located only": duplicating the same
  card/field chrome into a dozen component-local files would be its own kind
  of anti-pattern.
- **Class names are camelCase**, not kebab-case (`fieldLabel`, not
  `field-label`) — CSS Modules classes become JS object keys, and
  `styles['field-label']` is worse than `styles.fieldLabel`.
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

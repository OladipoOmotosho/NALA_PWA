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
  in one place, every component picks it up.
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
- **Touch targets ≥ 48px**, per this app's existing PRD requirement
  (gloved, outdoor, one-handed use) — every interactive component respects
  `theme.minTouchTarget`.

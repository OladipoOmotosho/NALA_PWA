# Button

`src/ui/Button.tsx` — adapted from `RetaylButton.tsx` (+ `.helpers.ts`,
`useRetaylButtonStyles.ts`).

## Use case

The single button component for every clickable action in the app: form
submit/save actions, dialog actions, the tab bar's primary actions, retry/
sync-now buttons. Replaces the current ad-hoc `<button className="btn ...">`
markup scattered across screens.

## What changed from the original

- Rebuilt as a plain `<button>` — the original used react-native's
  `Pressable`/`View`/`StyleSheet` plus `@retayl/hooks`' `useTheme()`, neither
  available here.
- `RetaylButtonContent.tsx` and `useRetaylButtonProps.ts` were referenced by
  the original but not included in the files handed over; this component
  reconstructs their behavior (default resolution, icon+label+spinner
  layout) directly.
- Dropped the `buttonDropdown` type/split-button behavior — no split-button
  control exists in this app. If ever needed, the original split-button
  logic is preserved untouched in
  `components/redundant/RetaylButtonDropdown.tsx`.
- Dropped the disabled-state tooltip — it was dead code in the original
  (`showTooltip` was declared but never set to `true`).

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `variant` | `'primary' \| 'secondary' \| 'tertiary' \| 'danger'` | `'primary'` | Visual style. `danger` is new relative to the original three-variant set, added because `Modal`'s button configs need it (e.g. a destructive confirm). |
| `size` | `'md' \| 'sm'` | `'md'` | `sm` (40px) drops below the 48px touch-target minimum — added during the app wiring for dense contexts (a per-record "Edit" in the Records list, the Sync Now button, secondary toggles like Field Reference). Reserve `md` for the primary action on any given screen. |
| `loading` | `boolean` | `false` | Shows a spinner in place of the left icon; disables the button. |
| `disabled` | `boolean` | `false` | |
| `leftIcon` / `rightIcon` | `ReactNode` | — | Any icon element, e.g. from `lucide-react`. |
| `fullWidth` | `boolean` | `false` | Stretches to the container's width. |
| ...rest | `ButtonHTMLAttributes<HTMLButtonElement>` | — | `onClick`, `type`, `aria-label`, etc. pass straight through. |

## Usage

```tsx
import { Button } from '../ui';

<Button onClick={handleSave}>Save draft</Button>

<Button variant="primary" fullWidth loading={isSyncing} onClick={triggerFlush}>
  Sync now
</Button>

<Button variant="danger" onClick={handleDiscard}>
  Discard draft
</Button>
```

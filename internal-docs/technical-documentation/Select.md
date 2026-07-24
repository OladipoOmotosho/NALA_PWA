# Select

`src/ui/Select.tsx` — adapted from `RetaylSelect.tsx` + `.types.ts` +
`RetaylSelectDropdown.tsx` + `RetaylSelectOptionItem.tsx` +
`RetaylSelectStyles.ts` + `useRetaylSelect.ts` + `useRetaylSelectMemoStyles.ts`
(six files consolidated into one).

## Use case

The single custom dropdown component: Site, Category, Component Type,
Sub-Component, Deficiency Category/Description/Mechanism/Focus Area,
Consequence Severity, Likelihood — every closed-list field in the Inspection
form. Would replace the native `<select>`-backed `Select` currently in
`components/fields.tsx`.

**Trade-off worth knowing:** a native `<select>` opens the OS's own picker on
mobile, which is arguably better for gloved/outdoor use than any custom
dropdown (larger touch targets, OS-level accessibility, no JS positioning
math to get wrong). This component trades that native behavior for visual
consistency across the whole app and features the native element can't do
(inline search-filter for long lists, custom item rendering). Worth an
explicit decision, not an assumed win, when the swap-in step happens.

## What changed from the original

This family was already the closest to portable as-is — the web variant
used plain `div`s, a `react-dom` portal, and inline styles; no react-native
primitives to strip. What changed:

- `@retayl/hooks`' `useTheme()` + `@retayl/utils` tokens → this project's
  `theme.ts`.
- `@retayl/icons` (`Pencil`/`SearchIcon`/`CloseIcon`) → `lucide-react`
  directly (`ChevronDown`/`Search`) — a real dependency of this project.
- Dropped: backend/server search mode (`onSearch`/`isSearching`), the
  "add more options" and "header action" rows, per-item icon/image slots,
  and the configurable scrollbar-style prop — none of this app's dropdown
  lists need them, and they added real complexity for zero current use.
- Kept: the debounced-by-length auto-search-box (only appears once a list is
  long enough to need filtering — the original's `>10 items` threshold),
  portal-based positioning that flips above the trigger when there's no room
  below, and click-outside/scroll-to-close.
- `useWebStyleTag` (a missing dependency in the original) isn't needed here
  since this version doesn't inject dynamic placeholder-color CSS.

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `items` | `{ label: string; value: string }[]` | — | |
| `value` | `string` | — | Controlled — matched against `items[].value`. |
| `onChange` | `(value: string, label: string) => void` | — | |
| `fieldLabel` | `string` | — | |
| `placeholder` | `string` | `'Select…'` | |
| `required` | `boolean` | `false` | Visual `*` marker only — required-field enforcement lives in the form's own validation (`db/submissions.ts`'s `validateForSubmit`), same as the current native-`<select>`-backed component. |
| `disabled` | `boolean` | `false` | |
| `error` / `errorMessage` | `boolean` / `string` | — | |
| `searchable` | `boolean` | auto (`items.length > 10`) | Force the search box on/off explicitly. |
| `searchPlaceholder` | `string` | `'Search…'` | |
| `isLoading` | `boolean` | `false` | Shows "Loading…" in the trigger, disables interaction. |

## Usage

```tsx
import { Select } from '../ui';
import { DEFICIENCY_CATEGORIES } from '../domain/lookups';

<Select
  fieldLabel="Deficiency Category"
  required
  value={form.deficiencyCategory}
  items={DEFICIENCY_CATEGORIES.map((c) => ({ value: c.label, label: c.label }))}
  onChange={(v) => {
    set('deficiencyCategory', v);
    set('detailedDescription', '');
    set('mechanism', '');
    set('focusArea', '');
  }}
/>
```

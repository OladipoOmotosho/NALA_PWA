# Autocomplete

`src/ui/Autocomplete.tsx` — adapted from `RetaylAutocomplete.tsx` +
`RetaylAutocompleteDropdown.tsx` + `RetaylAutocompleteHooks.ts` +
`RetaylAutocompleteStyles.ts` (four files consolidated into one).

## Use case

A free-text field with local suggestions — built for the **Parent Asset**
field (`components/capture/AssetSection.tsx`), which today uses a plain
`<input>` + native `<datalist>`. This component gives the same "type
anything, or pick a suggestion" behavior with a styled dropdown and keyboard
navigation, consistent with the rest of this library.

## What changed from the original — a re-architecture, not just a port

The original was built for a different interaction entirely: "type to
search (debounced, server-side), click a result to add it as a chip
elsewhere" — after selecting, its query resets back to empty, because the
selected item becomes a separate tag/chip, not the input's own persisted
value.

That's the wrong shape for Parent Asset, where the **typed text itself is
the field value** — an inspector should be able to type a brand-new parent
asset name freely (registries load per campaign and are often incomplete),
not be forced to pick from a fixed list. So this version is a controlled
`value`/`onChangeText` text input with a filtered **local, static** list of
suggestions:

- No debounce, no `onSearch` callback, no `minSearchLength` — there's
  nothing asynchronous to wait on with a local ~18-item array.
- Selecting a suggestion sets the input's value to that suggestion (doesn't
  clear it).
- Keyboard navigation (↑/↓/Enter/Escape) is kept from the original — good
  UX, and it cost nothing extra to carry over.

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `string` | — | Controlled — this *is* the field's value, not just a search query. |
| `onChangeText` | `(text: string) => void` | — | |
| `suggestions` | `string[]` | — | The full candidate list; filtered locally by substring match against `value`. Capped at 8 shown at a time. |
| `fieldLabel` | `string` | — | |
| `placeholder` | `string` | — | |
| `disabled` | `boolean` | `false` | |

## Usage

```tsx
import { Autocomplete } from '../ui';
import { FORM_OPTIONS } from '../domain/formOptions';

<Autocomplete
  fieldLabel="Parent Asset"
  placeholder="e.g. Blower Building"
  value={form.parentAsset}
  onChangeText={(v) => set('parentAsset', v)}
  suggestions={FORM_OPTIONS.parentAssets}
/>
```

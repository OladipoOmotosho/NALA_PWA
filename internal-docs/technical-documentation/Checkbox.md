# Checkbox

`src/ui/Checkbox.tsx` — adapted from `RetaylCheckbox.tsx`.

## Use case

Standalone true/false selection with a visible label — e.g. a future
"In Scope" toggle on an asset, or any boolean that reads more naturally as a
checkbox than a Yes/No pair. (Today's Yes/No fields in the Inspection form
use the segmented control in `components/fields.tsx`, kept as-is since a
large two-button segmented control is more glove-friendly than a small
checkbox for those — see `Switch.md` for the other boolean option.)

## What changed from the original

The original animated its checkmark in with React Native's `Animated.spring`
(a physics-based scale animation) and used `StyleSheet.create`. This version
uses a CSS `transform: scale()` transition — visually equivalent, no
animation library needed. Touch target bumped from the original's 24×24 to
this app's 48px-minimum convention (the checkbox glyph itself stays a compact
24×24 visual square; the tappable label area around it meets 48px).

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `label` | `string` | — | Optional — omit for a standalone checkbox and pass `aria-label` instead. |
| `checked` | `boolean` | — | Controlled. |
| `onChange` | `(checked: boolean) => void` | — | |
| `disabled` | `boolean` | `false` | |
| `aria-label` | `string` | — | Falls back to `label` if omitted. |

## Usage

```tsx
import { Checkbox } from '../ui';

<Checkbox
  label="In scope for this campaign"
  checked={asset.inScope}
  onChange={(v) => setAsset({ ...asset, inScope: v })}
/>
```

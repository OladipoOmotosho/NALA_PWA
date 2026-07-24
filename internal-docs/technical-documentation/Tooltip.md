# Tooltip

`src/ui/Tooltip.tsx` — adapted from `RetaylTooltip.tsx`.

## Use case

A hover/focus-triggered info popup — used by `TextInput`'s `infoMessage`
prop, and available standalone for any field that needs a short explanation
without permanently occupying layout space (e.g. explaining why "Equipment
Type" is free text despite the workbook's stray Yes/No validation).

## What changed from the original

Dropped the react-native `Platform.OS === 'web'` branching entirely — this
project is web-only, so only that code path was kept (the native-Pressable
fallback branch is gone). The hover/focus state, viewport-aware
above/below flip, and portal rendering (so the tooltip is never clipped by a
scrolling or `overflow: hidden` ancestor, a real risk inside the form's card
sections) are preserved as-is.

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `message` | `string` | — | Required — the tooltip renders nothing without it (matches the original's behavior). |
| `title` | `string` | — | Optional bold heading above the message. |
| `children` | `ReactNode` | an info icon | Custom trigger element; defaults to a small `InfoIcon`. |
| `aria-label` | `string` | `title` or `'More information'` | |

## Usage

```tsx
import { Tooltip } from '../ui';

<Tooltip title="Equipment Type" message="Free text — the workbook's Yes/No validation on this column was a template defect." />

<Tooltip message="Registries load per campaign; this may not be complete.">
  <YourOwnTriggerElement />
</Tooltip>
```

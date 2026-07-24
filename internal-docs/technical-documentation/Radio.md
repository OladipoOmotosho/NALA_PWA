# Radio

`src/ui/Radio.tsx` — adapted from `RetaylRadio.tsx`.

## Use case

One option selected from a small visible set, rendered as a group of radio
buttons rather than a dropdown — best when there are 2–4 options and seeing
them all at once (without opening a `Select`) matters more than saving
vertical space. No current field in the Inspection form uses this (they're
all `Select`s), but it's here for e.g. a future "Draft / Submitted /
Reviewed" reviewer-status picker.

## What changed from the original

Same treatment as `Checkbox`: the original's `Animated.spring` inner-dot
scale replaced with a CSS transition; sizes bumped slightly for touch
comfort.

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `label` | `string` | — | Required — a radio option without a visible label is a UX antipattern. |
| `selected` | `boolean` | — | Controlled. |
| `onSelect` | `() => void` | — | Called when this option is chosen; the parent owns which single option in the group is `selected`. |
| `disabled` | `boolean` | `false` | |

## Usage

```tsx
import { Radio } from '../ui';

const OPTIONS = ['Draft', 'Submitted', 'Reviewed'] as const;

{OPTIONS.map((opt) => (
  <Radio key={opt} label={opt} selected={status === opt} onSelect={() => setStatus(opt)} />
))}
```

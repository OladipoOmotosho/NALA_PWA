# Switch

`src/ui/Switch.tsx` — **built fresh, not adapted.**

## Important caveat

Retayl's `RetaylSwitch.tsx` is a 3-line re-export of `./RetaylSwitchBase` —
all of its actual behavior and styling live in `RetaylSwitchBase.tsx`, which
was **not included** in the files handed over. There was no source to
tailor. This component follows the same visual language as the adapted
`Checkbox`/`Radio` (teal accent, CSS-transition thumb) rather than guessing
at the missing file's exact implementation.

If `RetaylSwitchBase.tsx` turns up later, it's worth diffing this
implementation against it and reconciling any real differences.

## Use case

A true/false toggle styled as an iOS-style pill switch rather than a
checkbox — a common alternative treatment for the same kind of boolean the
Inspection form's Yes/No segmented control handles today. Reach for this
when a checkbox/segmented-control reads wrong for the context (e.g. a
settings-style "enabled/disabled" toggle) rather than a form field answer.

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `checked` | `boolean` | — | Controlled. |
| `onChange` | `(checked: boolean) => void` | — | |
| `disabled` | `boolean` | `false` | |
| `aria-label` | `string` | — | Recommended — the switch has no visible label of its own; pair it with a `Text` label placed beside it, or set this. |

## Usage

```tsx
import { Switch } from '../ui';
import { Text } from '../ui';

<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
  <Switch checked={notifyOnP1} onChange={setNotifyOnP1} aria-label="Notify on P1" />
  <Text>Notify on P1</Text>
</div>
```

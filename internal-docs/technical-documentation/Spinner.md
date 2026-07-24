# Spinner

`src/ui/Spinner.tsx` — adapted from `RetaylCircularProgress.tsx`.

## Use case

Indeterminate loading indication — the sync engine's "Syncing…" state in
`SyncBanner.tsx` currently shows text only; this gives it a visual spinner.
Also usable anywhere a determinate percentage matters (kept from the
original, costs nothing to retain even though nothing in this app currently
needs a percentage).

## What changed from the original

Renamed from `CircularProgress` — "Spinner" describes this app's actual uses
(indeterminate loading, sync-in-progress) far better than "CircularProgress",
which implies the determinate-percentage use case. The SVG ring math is
otherwise identical; the original imported `View`/`StyleSheet` from
`react-native-web` (note: not `react-native` — this one file used the web
package directly) — replaced with a plain `<div>`.

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `number` (0–100) | — | Omit for an indeterminate spinner (continuous rotation via the `ui-spin` keyframe from `ui.css`). Provide it for a determinate progress ring. |
| `size` | `number` (px) | `48` | |
| `strokeWidth` | `number` | `5` | |
| `color` | `string` | `theme.colors.teal` | |
| `trackColor` | `string` | `theme.colors.line` | |
| `showValue` | `boolean` | `false` | Shows the percentage (or `label`) centered in the ring — only meaningful with a determinate `value`. |
| `label` | `string` | — | Overrides the percentage text. |

## Usage

```tsx
import { Spinner } from '../ui';

// indeterminate — "syncing" state
{engine.flushing && <Spinner size={20} />}

// determinate — e.g. a future storage-quota indicator
<Spinner value={storagePercent} showValue />
```

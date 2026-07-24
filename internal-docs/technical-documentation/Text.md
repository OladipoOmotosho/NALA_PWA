# Text

`src/ui/Text.tsx` — adapted from `RetaylText.tsx`.

## Use case

The single typography primitive: labels, hints, headings, card titles. Lets
size/weight/color be set consistently instead of one-off inline `style={}`
scattered through JSX.

## What changed from the original

Simplified significantly:

- Dropped the Matter font-family weight mapping (`weightToMatterFont`) — that
  font isn't bundled in this project; it uses the system font stack already
  defined in `styles.css`.
- Dropped the responsive font-size scaling (`useResponsive` +
  `getResponsiveFontSize`) — this app is single-column, mobile-first, with no
  breakpoints to scale a font size against.
- Kept: semantic element selection (`as`), line-clamping (`numberOfLines`),
  block/inline display, color/size/weight overrides.

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `as` | `'h1'\|'h2'\|'h3'\|'h4'\|'p'\|'span'\|'label'\|'strong'` | `'span'` | Renders the matching HTML element — use `h1`–`h4`/`p` for real document structure, not just visual size. |
| `size` | `number` (px) | `theme.fontSize.md` (15) | |
| `color` | `string` | `theme.colors.text` | Any CSS color, typically one of the `theme.colors.*` tokens. |
| `weight` | `'normal'\|'bold'\|'400'\|'500'\|'600'\|'700'` | `'400'` | |
| `block` | `boolean` | `false` | Forces `display: block` regardless of `as`. |
| `numberOfLines` | `number` | — | Truncates to N lines with an ellipsis (webkit line-clamp). |
| `htmlFor` | `string` | — | Only applies when `as="label"`. |

## Usage

```tsx
import { Text } from '../ui';
import { colors } from '../ui/theme';

<Text as="h2" size={18} weight="600">Risk & priority</Text>
<Text color={colors.muted} size={13}>Choose the Deficiency Category first.</Text>
<Text numberOfLines={2}>{longRecommendedActionText}</Text>
```

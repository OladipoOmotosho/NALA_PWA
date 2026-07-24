# TextInput

`src/ui/TextInput.tsx` — adapted from `RetaylTextInput.web.tsx` (+
`.types.ts`, `useRetaylTextInput.ts`).

## Use case

The single text-entry component: Asset ID, Inspector Name, Recommended
Action (multiline), the backend URL / bearer token fields in Settings. Would
replace the raw `<input>`/`<textarea>` currently used throughout
`components/capture/*` and `screens/SettingsScreen.tsx`.

## What changed from the original

This was one of the most directly portable Retayl components — the `.web`
variant already rendered a plain HTML `<input>`/`<textarea>`, no react-native
primitives to strip. What did change:

- `sanitizeByInputType` came from `@retayl/hooks`, which isn't available —
  only the `decimal` input-mode's digit-filtering was reimplemented (it's
  simple and self-contained); the rest of the original's sanitization
  pass-through wasn't replicated.
- Dropped `autoCapitalize`/`returnKeyType` — these map to native mobile
  keyboard behavior on React Native; there's no DOM equivalent worth faking.
- The info-tooltip icon now uses this library's own `Tooltip` instead of the
  original `RetaylTooltip`.

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `string` | — | Controlled. |
| `onChangeText` | `(text: string) => void` | — | |
| `fieldLabel` | `string` | — | |
| `placeholder` | `string` | — | |
| `inputMode` | `'text'\|'email'\|'tel'\|'url'\|'numeric'\|'decimal'\|'search'` | `'text'` | Maps to the closest HTML `type`/keyboard hint. `decimal` filters input to digits + one `.`. |
| `multiline` | `boolean` | `false` | Renders a `<textarea>`. |
| `disabled` / `readOnly` | `boolean` | `false` | |
| `required` | `boolean` | `false` | Shows a "This field is required" error once the field is touched (blurred) empty. |
| `error` / `errorMessage` | `boolean` / `string` | — | Externally-driven error state, takes priority over the built-in required check. |
| `secureTextEntry` | `boolean` | `false` | Renders as a password field with a Show/Hide toggle — used for the bearer token field. |
| `prefixText` / `suffixText` | `string` | — | |
| `infoMessage` | `string` | — | Shows an info tooltip next to the label. |
| `maxLength` | `number` | — | |
| `autoFocus` | `boolean` | — | |
| `onBlur` | `() => void` | — | |

## Usage

```tsx
import { TextInput } from '../ui';

<TextInput
  fieldLabel="Inspector Name"
  required
  value={form.inspectorName}
  onChangeText={(v) => set('inspectorName', v)}
/>

<TextInput
  fieldLabel="Recommended Action"
  multiline
  value={form.recommendedAction}
  onChangeText={(v) => set('recommendedAction', v)}
/>

<TextInput
  fieldLabel="Bearer token"
  secureTextEntry
  value={token}
  onChangeText={setToken}
/>
```

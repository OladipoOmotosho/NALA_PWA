# Modal

`src/ui/Modal.tsx` — adapted from `RetaylModal.tsx` + `.types.ts` +
`.styles.ts` + `RetaylModalContent.tsx` (four files consolidated into one).
Also folds in what two other files did:

- `RetaylSuccessModal.tsx`'s own doc comment reads
  `@deprecated Use <RetaylModal variant="success" /> instead` — so its job
  is just `<Modal variant="success" ... />` here, not a separate component.
- `RetaylWebModal.tsx` is a simpler, unused-by-`RetaylModal` duplicate of the
  same portal/overlay/scroll-lock pattern `RetaylModal` already implements
  itself — one Modal, not two.

## Use case

Every confirmation dialog and blocking message in the app: "Discard this
draft?" (currently `window.confirm()` in `RecordsScreen.tsx`), "Purge synced
records older than 30 days?" (currently `window.confirm()` in
`DiagnosticsScreen.tsx`), and any future success/error feedback dialog.
Swapping the two `window.confirm()` calls for this component is a real
UX upgrade queued for the wiring-in step — the native browser confirm can't
be styled and reads jarringly against the rest of the dark-themed app.

## What changed from the original

- Dropped modal stacking (`stackLevel`) — this app never shows two modals at
  once.
- Dropped `keyboardAware` — a React Native-only concern (avoiding the
  on-screen keyboard covering the modal).
- Dropped the slide/scale animation-type switch — kept one fade+scale
  transition; the extra option wasn't worth the complexity for the small
  number of dialogs this app has.
- `@retayl/icons` variant icons (`MarkedIcon`/`FailedIcon`/etc.) →
  `lucide-react` (`Check`/`X`/`AlertTriangle`/`Info`).
- Kept: the variant system (auto icon + tint color), primary/secondary
  button configs (now backed by this library's own `Button`), escape-to-close,
  overlay-click-to-close, body-scroll lock, and portal rendering.

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `isVisible` | `boolean` | — | |
| `onClose` | `() => void` | — | |
| `variant` | `'success'\|'error'\|'warning'\|'info'\|'confirmation'\|'custom'` | `'custom'` | Controls the auto-shown icon + its background tint. |
| `title` | `string` | — | |
| `message` | `ReactNode` | — | String or custom content. |
| `children` | `ReactNode` | — | For fully custom modal bodies (`variant="custom"`). |
| `primaryButton` / `secondaryButton` | `{ text, onPress, variant?, loading?, disabled? }` | — | Rendered via this library's `Button`. |
| `size` | `'sm'\|'md'\|'lg'` | `'md'` | 360 / 480 / 640px max-width. |
| `closeOnOverlayClick` | `boolean` | `true` | |
| `showCloseButton` | `boolean` | `true` | Top-right × button. |

## Usage

```tsx
import { Modal } from '../ui';

<Modal
  isVisible={showDiscardConfirm}
  onClose={() => setShowDiscardConfirm(false)}
  variant="warning"
  title="Discard this draft?"
  message="It stays on the device (soft delete), but leaves the Records list."
  primaryButton={{ text: 'Discard', variant: 'danger', onPress: confirmDiscard }}
  secondaryButton={{ text: 'Cancel', onPress: () => setShowDiscardConfirm(false) }}
/>

<Modal isVisible={saved} onClose={() => setSaved(false)} variant="success" message="Inspection saved." />
```

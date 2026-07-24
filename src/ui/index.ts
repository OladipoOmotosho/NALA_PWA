/**
 * Barrel export for the ui/ component library — tailored from Retayl's
 * component set for this project (see internal-docs/technical-documentation/
 * for per-component docs and components/redundant/MANIFEST.md for what
 * was left out and why). Wired into every screen; see App.tsx and friends.
 *
 * Icons come straight from `lucide-react` (a real dependency) — imported
 * directly at each call site, not re-exported here.
 *
 * Import the shared keyframes once, at the app's entry point:
 * `import '../ui/ui.css'` (see main.tsx).
 */
export { Button, type ButtonProps, type ButtonVariant, type ButtonSize } from './Button';
export { Text, type TextProps } from './Text';
export { Checkbox, type CheckboxProps } from './Checkbox';
export { Radio, type RadioProps } from './Radio';
export { Switch, type SwitchProps } from './Switch';
export { TextInput, type TextInputProps, type TextInputMode } from './TextInput';
export { Select, type SelectProps, type SelectItem } from './Select';
export { Modal, type ModalProps, type ModalVariant, type ModalButtonConfig } from './Modal';
export { Tooltip, type TooltipProps } from './Tooltip';
export { Spinner, type SpinnerProps } from './Spinner';
export { Autocomplete, type AutocompleteProps } from './Autocomplete';
export { StatusBadge, type StatusBadgeProps } from './StatusBadge';
export * as theme from './theme';

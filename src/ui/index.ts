/**
 * Barrel export for the ui/ component library — tailored from Retayl's
 * component set for this project (see internal-docs/technical-documentation/
 * for per-component docs and components/redundant/MANIFEST.md for what
 * was left out and why).
 *
 * Import the shared keyframes once, at the app's entry point, alongside
 * this barrel: `import '../ui/ui.css'` (see main.tsx once these are wired in).
 */
export { Button, type ButtonProps, type ButtonVariant } from './Button';
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
export * as icons from './icons';
export * as theme from './theme';

/**
 * Adapted from Retayl's RetaylCheckbox. The original used react-native's
 * Animated.spring for the checkmark scale-in; replaced with a CSS
 * transition (transform + opacity), which is equivalent visually and
 * needs no animation library. Sizes bumped from the original's 16x16 to
 * fit this app's 48px-minimum touch target convention (PRD §9.5).
 */
import { Check } from 'lucide-react';
import { cx } from './cx';
import { Text } from './Text';
import styles from './Checkbox.module.css';

export interface CheckboxProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  'aria-label'?: string;
}

export function Checkbox({ label, checked, onChange, disabled = false, ...aria }: CheckboxProps) {
  return (
    <label className={cx(styles.label, disabled && styles.disabled)}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        aria-label={aria['aria-label'] ?? label}
        className={styles.hiddenInput}
      />
      <span aria-hidden="true" className={cx(styles.box, checked && styles.checked)}>
        <span className={cx(styles.check, checked && styles.checked)}>
          <Check size={14} />
        </span>
      </span>
      {label && <Text as="span">{label}</Text>}
    </label>
  );
}

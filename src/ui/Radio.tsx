/**
 * Adapted from Retayl's RetaylRadio. Same treatment as Checkbox: the
 * original's Animated.spring inner-dot scale replaced with a CSS
 * transition; sizes bumped to fit the 48px touch-target convention.
 */
import { cx } from './cx';
import { Text } from './Text';
import styles from './Radio.module.css';

export interface RadioProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

export function Radio({ label, selected, onSelect, disabled = false }: RadioProps) {
  return (
    <label className={cx(styles.label, disabled && styles.disabled)}>
      <input
        type="radio"
        checked={selected}
        disabled={disabled}
        onChange={onSelect}
        aria-label={label}
        className={styles.hiddenInput}
      />
      <span aria-hidden="true" className={cx(styles.ring, selected && styles.selected)}>
        <span className={cx(styles.dot, selected && styles.selected)} />
      </span>
      <Text as="span">{label}</Text>
    </label>
  );
}

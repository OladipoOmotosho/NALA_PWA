/**
 * NOTE: built fresh, not adapted. Retayl's RetaylSwitch is a 3-line
 * re-export of `./RetaylSwitchBase` — that file wasn't included in the
 * files handed over, so there was no source to tailor here. This follows
 * the same visual language as the adapted Checkbox/Radio (teal accent,
 * CSS-transition thumb) rather than reverse-engineering the missing file.
 * See internal-docs/technical-documentation/Switch.md.
 */
import { cx } from './cx';
import styles from './Switch.module.css';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  'aria-label'?: string;
}

export function Switch({ checked, onChange, disabled = false, ...aria }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={aria['aria-label']}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cx(styles.track, checked && styles.checked)}
    >
      <span className={cx(styles.thumb, checked && styles.checked)} />
    </button>
  );
}

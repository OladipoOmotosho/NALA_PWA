/**
 * Adapted from Retayl's RetaylButton (+ RetaylButton.helpers.ts,
 * useRetaylButtonStyles.ts). Rebuilt as a plain HTML <button> — the
 * original used react-native's Pressable/View/StyleSheet and @retayl/hooks'
 * useTheme; this project has neither.
 *
 * Simplifications from the original (see internal-docs/technical-documentation/Button.md):
 *  - The buttonDropdown variant/split-button behavior was dropped — no
 *    split-button use case in this app yet (its logic lives untouched in
 *    components/redundant/RetaylButtonDropdown.tsx if ever needed).
 *  - The disabled-state tooltip was dead code in the original (state was
 *    set but never flipped true) — not carried over.
 *  - useRetaylButtonProps and RetaylButtonContent weren't included in the
 *    files handed over; this component reconstructs their behavior from
 *    how RetaylButton.tsx consumed them, simplified for our single platform.
 *
 * Styling: variant/size are finite enums, expressed as CSS Module modifier
 * classes (Button.module.css) — nothing here is computed at runtime, so
 * there's no inline style at all besides whatever a caller passes through
 * `style`/`className` (e.g. CaptureScreen's `flex: 1` in its action bar).
 */
import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cx } from './cx';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';
export type ButtonSize = 'md' | 'sm';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  variant?: ButtonVariant;
  /** 'sm' drops below the 48px touch-target minimum — reserve for secondary,
   * low-frequency actions (e.g. a per-record "Edit" in a dense list), never
   * for the primary action on a screen. */
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  /** Stretch to fill the width of its container. */
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  className,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type="button"
      disabled={isDisabled}
      className={cx(styles.button, styles[variant], styles[size], fullWidth && styles.fullWidth, className)}
      {...rest}
    >
      {loading ? <Loader2 size={16} className="ui-spin" /> : leftIcon}
      {children}
      {!loading ? rightIcon : null}
    </button>
  );
}

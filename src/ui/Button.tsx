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
 */
import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { colors, minTouchTarget, radius, transition } from './theme';
import { SpinnerIcon } from './icons';

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

const VARIANT_STYLE: Record<ButtonVariant, { bg: string; text: string; border?: string }> = {
  primary: { bg: colors.teal, text: '#04211d' },
  secondary: { bg: 'transparent', text: colors.text, border: colors.line },
  tertiary: { bg: colors.card, text: colors.muted },
  danger: { bg: '#7f1d1d', text: '#fff' },
};

const SIZE_STYLE: Record<ButtonSize, { minHeight: number; padding: string; fontSize: number }> = {
  md: { minHeight: minTouchTarget, padding: '10px 18px', fontSize: 16 },
  sm: { minHeight: 40, padding: '6px 14px', fontSize: 14 },
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  style,
  ...rest
}: ButtonProps) {
  const v = VARIANT_STYLE[variant];
  const s = SIZE_STYLE[size];
  const isDisabled = disabled || loading;

  return (
    <button
      type="button"
      disabled={isDisabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        minHeight: s.minHeight,
        width: fullWidth ? '100%' : undefined,
        padding: s.padding,
        borderRadius: radius.lg,
        border: `1px solid ${v.border ?? v.bg}`,
        background: v.bg,
        color: v.text,
        fontSize: s.fontSize,
        fontWeight: 600,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.5 : 1,
        transition: `opacity ${transition.fast}`,
        ...style,
      }}
      {...rest}
    >
      {loading ? <SpinnerIcon size={16} /> : leftIcon}
      {children}
      {!loading ? rightIcon : null}
    </button>
  );
}

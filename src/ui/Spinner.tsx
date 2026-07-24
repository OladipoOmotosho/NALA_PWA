/**
 * Adapted from Retayl's RetaylCircularProgress. Renamed — "Spinner" reads
 * better for this project's two uses (indeterminate loading, sync-in-progress)
 * than "CircularProgress", which implies a determinate percentage the rest
 * of this app never actually needs. The determinate `value` prop is kept
 * since the SVG math is identical either way and it costs nothing to retain.
 *
 * Styling: size, colors, and the stroke-dashoffset math are all genuinely
 * per-instance dynamic values (arbitrary numbers, computed SVG geometry) —
 * this stays inline, same treatment as Text's size/color. Only the static
 * structural wrapper classes move to Spinner.module.css.
 */
import { colors } from './theme';
import { Text } from './Text';
import styles from './Spinner.module.css';

export interface SpinnerProps {
  /** Progress 0–100. Omit for an indeterminate spinner (continuous rotation). */
  value?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  showValue?: boolean;
  label?: string;
}

export function Spinner({
  value,
  size = 48,
  strokeWidth = 5,
  color = colors.teal,
  trackColor = colors.line,
  showValue = false,
  label,
}: SpinnerProps) {
  const indeterminate = value === undefined;
  const clamped = Math.max(0, Math.min(100, value ?? 0));
  const r = (size - strokeWidth) / 2;
  const circumference = r * 2 * Math.PI;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className={styles.wrapper} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={indeterminate ? 'ui-spin' : undefined}
      >
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={indeterminate ? circumference * 0.75 : offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: indeterminate ? undefined : 'stroke-dashoffset 300ms ease' }}
        />
      </svg>
      {showValue && !indeterminate && (
        <div className={styles.valueOverlay}>
          <Text size={14} weight="700">
            {label ?? `${Math.round(clamped)}%`}
          </Text>
        </div>
      )}
    </div>
  );
}

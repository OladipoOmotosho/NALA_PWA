/**
 * RetaylCircularProgress - Web implementation
 *
 * Animated circular progress indicator using native SVG
 * Uses CSS transitions for smooth animations
 *
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 *
 * @example
 * ```tsx
 * <RetaylCircularProgress value={75} />
 * <RetaylCircularProgress value={85} size={120} color="#10B981" />
 * ```
 */

import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native-web';
import { useTheme } from '@retayl/hooks';
import { fontSize, animations } from '@retayl/utils';
import RetaylText from './RetaylText';

/** Default size in pixels */
const DEFAULT_SIZE = 64;
/** Default stroke width in pixels */
const DEFAULT_STROKE_WIDTH = 6;
/** Size thresholds for font scaling */
const SIZE_THRESHOLDS = { large: 80, medium: 60 } as const;

export interface RetaylCircularProgressProps {
  /** Progress value (0-100) - values outside range are clamped */
  value: number;
  /** Size of the circle in pixels */
  size?: number;
  /** Stroke width of the progress arc */
  strokeWidth?: number;
  /** Progress color (defaults to theme primary) */
  color?: string;
  /** Background track color (defaults to theme borderLight) */
  trackColor?: string;
  /** Whether to show the percentage value in center */
  showValue?: boolean;
  /** Custom label to display instead of percentage */
  label?: string;
  /** Animation duration in milliseconds */
  duration?: number;
  /** Test ID for testing */
  testID?: string;
}

/**
 * RetaylCircularProgress - Web version using native SVG
 */
const RetaylCircularProgress: React.FC<RetaylCircularProgressProps> = memo(
  ({
    value,
    size = DEFAULT_SIZE,
    strokeWidth = DEFAULT_STROKE_WIDTH,
    color,
    trackColor,
    showValue = true,
    label,
    duration = animations.duration.normal,
    testID,
  }) => {
    const { colors } = useTheme();
    const progressColor = color ?? colors.primary;
    const bgTrackColor = trackColor ?? colors.borderLight;

    // Clamp value to 0-100 range
    const clampedValue = Math.max(0, Math.min(100, value));

    // SVG circle calculations
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset =
      circumference - (clampedValue / 100) * circumference;

    // Calculate font size based on circle size
    const valueFontSize =
      size > SIZE_THRESHOLDS.large
        ? fontSize.xl
        : size > SIZE_THRESHOLDS.medium
          ? fontSize.lg
          : fontSize.md;
    const percentFontSize =
      size > SIZE_THRESHOLDS.medium ? fontSize.sm : fontSize.xs;

    return (
      <View
        style={[styles.container, { width: size, height: size }]}
        testID={testID}
      >
        {/* SVG Progress Circle */}
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill='none'
            stroke={bgTrackColor}
            strokeWidth={strokeWidth}
            data-testid={testID ? `${testID}-track` : undefined}
          />
          {/* Progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill='none'
            stroke={progressColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap='round'
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{
              transition: `stroke-dashoffset ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
            }}
            data-testid={testID ? `${testID}-progress` : undefined}
          />
        </svg>

        {/* Center content */}
        {showValue && (
          <View style={styles.centerContent}>
            <RetaylText
              text={label ?? `${Math.round(clampedValue)}`}
              size={valueFontSize}
              fontWeight='700'
              color={colors.textPrimary}
            />
            {!label && (
              <RetaylText
                text='%'
                size={percentFontSize}
                color={colors.textSecondary}
              />
            )}
          </View>
        )}
      </View>
    );
  },
);

RetaylCircularProgress.displayName = 'RetaylCircularProgress';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RetaylCircularProgress;

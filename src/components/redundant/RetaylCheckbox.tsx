import React, { useCallback, useEffect, useRef } from 'react';
import { fontSize } from '@retayl/utils';
import {
  View,
  StyleSheet,
  Pressable,
  Animated,
  ViewStyle,
  StyleProp,
  TextStyle,
} from 'react-native';
import RetaylText from './RetaylText';
import { FONTFAMILY } from '@retayl/fonts';
import { useTheme } from '@retayl/hooks';

/** Props for the cross-platform RetaylCheckbox component. */
interface RetaylCheckboxProps {
  /** Text label displayed to the right of the checkbox. Optional for standalone use. */
  label?: string;
  /** Whether the checkbox is currently selected. */
  isChecked?: boolean;
  /** Callback invoked when the checkbox is toggled. */
  onToggle?: (newCheckedState: boolean) => void;
  /** Optional margin applied between the checkbox and its label. */
  marginLeft?: number;
  /** Optional style overrides for the label text. */
  textStyle?: StyleProp<TextStyle>;
  /** Optional style overrides for the container. */
  className?: StyleProp<ViewStyle>;
  /** Disables user interaction when true. */
  disabled?: boolean;
  /** Overrides the default label color. */
  textColor?: string;
  /** Accessibility label for screen readers (recommended when no visible label). */
  accessibilityLabel?: string;
}

// Checkbox constants
const CHECKBOX_DEFAULTS = {
  DEFAULT_MARGIN_LEFT: 12, // Space between checkbox and label
} as const;

/**
 * Cross-platform checkbox component that aligns with the web onboarding
 * styling introduced in the TaxesPayments step.
 */
const RetaylCheckbox = React.memo(
  ({
    label,
    isChecked = false,
    onToggle,
    className,
    marginLeft = CHECKBOX_DEFAULTS.DEFAULT_MARGIN_LEFT,
    textStyle,
    disabled = false,
    textColor,
    accessibilityLabel,
  }: RetaylCheckboxProps) => {
    // FIXED: Remove internal state management - use only the prop
    // const [checked, setChecked] = useState(isChecked); // REMOVED

    const scaleValue = useRef(new Animated.Value(isChecked ? 1 : 0)).current;
    const prevIsChecked = useRef(isChecked);

    // FIXED: Use isChecked directly instead of internal checked state
    useEffect(() => {
      // Only animate if the value actually changed
      if (prevIsChecked.current === isChecked) return;

      const targetValue = isChecked ? 1 : 0;
      prevIsChecked.current = isChecked; // Update the ref

      const animation = Animated.spring(scaleValue, {
        toValue: targetValue,
        friction: 10,
        useNativeDriver: true,
      });

      animation.start();

      // FIXED: Proper cleanup - stop animation on unmount
      return () => {
        animation.stop();
      };
    }, [isChecked, scaleValue]); // FIXED: Use isChecked instead of checked

    const handleToggle = useCallback(() => {
      if (disabled) return;

      // FIXED: Don't manage internal state, just call the callback
      onToggle?.(!isChecked);
    }, [disabled, isChecked, onToggle]);

    const { colors } = useTheme();
    const checkmarkColor = disabled
      ? colors.disabledText
      : colors.backgroundPrimary;
    const checkboxBorderColor = isChecked
      ? colors.primary
      : colors.borderMedium;
    const checkboxBackgroundColor = isChecked
      ? colors.primary
      : colors.backgroundPrimary;

    // Safely flatten textStyle - cast to Record to avoid RN/CSS type conflicts
    const flattenedTextStyle = textStyle
      ? (StyleSheet.flatten(textStyle) as Record<string, unknown>)
      : {};

    return (
      <View style={[styles.container, className]}>
        <Pressable
          onPress={handleToggle}
          accessibilityRole='checkbox'
          accessibilityState={{ checked: isChecked, disabled }}
          accessibilityLabel={accessibilityLabel || label}
          style={[
            styles.checkboxContainer,
            disabled && styles.disabledContainer,
          ]}
        >
          <View
            style={[
              styles.checkboxBackground,
              {
                backgroundColor: checkboxBackgroundColor,
                borderColor: disabled
                  ? colors.disabledBorder
                  : checkboxBorderColor,
              },
              disabled && { backgroundColor: colors.disabledBackground },
            ]}
          >
            <Animated.View
              style={[
                styles.checkmark,
                {
                  transform: [{ scale: scaleValue }],
                },
              ]}
            >
              <View
                style={[
                  styles.checkmarkStem,
                  { backgroundColor: checkmarkColor },
                ]}
              />
              <View
                style={[
                  styles.checkmarkKick,
                  { backgroundColor: checkmarkColor },
                ]}
              />
            </Animated.View>
          </View>
        </Pressable>
        {label && (
          <RetaylText
            text={label}
            extraStyle={{
              marginLeft,
              color: disabled
                ? colors.textDisabled
                : textColor || colors.textPrimary,
              fontSize: fontSize.sm,
              fontFamily: FONTFAMILY.regular,
              ...flattenedTextStyle,
            }}
          />
        )}
      </View>
    );
  },
);

RetaylCheckbox.displayName = 'RetaylCheckbox';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  checkboxContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
  },
  checkboxBackground: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    width: 12,
    height: 12,
  },
  checkmarkStem: {
    position: 'absolute',
    width: 2,
    height: 8,
    transform: [{ rotate: '45deg' }],
    top: 2,
    left: 6,
  },
  checkmarkKick: {
    position: 'absolute',
    width: 2,
    height: 4,
    transform: [{ rotate: '-45deg' }],
    top: 5,
    left: 3,
  },
  disabledContainer: {
    opacity: 0.5,
  },
});

export default RetaylCheckbox;

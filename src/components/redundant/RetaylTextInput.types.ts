/**
 * RetaylTextInput Types
 *
 * Shared types and constants for RetaylTextInput component
 * Used by both native and web implementations
 */

import type React from 'react';
import type {
  TextStyle,
  ViewStyle,
  DimensionValue,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';
import { fontSize, radius, spacing, zIndex } from '@retayl/utils';
import { FONTFAMILY } from '@retayl/fonts';

// =============================================================================
// CONSTANTS
// =============================================================================

export const TEXT_INPUT_CONSTANTS = {
  MULTILINE_HEIGHT_MULTIPLIER: 2,
  BORDER_WIDTH: 1,
  MAX_DECIMAL_PARTS: 2,
  ICON_PADDING: 17,
  INPUT_PADDING: 10,
  PREFIX_PADDING: 12,
  ERROR_MARGIN_TOP: 5,
  DISABLED_OPACITY: 0.6,
} as const;

// =============================================================================
// SHARED STYLES
// =============================================================================

/**
 * Theme colors interface for style generation
 */
interface ThemeColors {
  inputBackground: string;
  borderLight: string;
  error: string;
  primary: string;
  textPrimary: string;
  textSecondary: string;
  textPlaceholder: string;
  gray500: string;
}

/**
 * Generates shared style values used by both web and native implementations.
 * These are platform-agnostic numeric/string values that can be applied
 * to either CSS or React Native StyleSheet.
 */
export const getSharedStyles = (colors: ThemeColors) => ({
  // Label styles
  label: {
    fontSize: fontSize.sm,
    fontFamily: FONTFAMILY.regular,
    marginBottom: spacing.xs,
  },

  // Info icon wrapper
  infoIconWrapper: {
    marginLeft: spacing.xs / 2,
    zIndex: zIndex.tooltip,
  },

  // Input container
  inputContainer: {
    borderWidth: TEXT_INPUT_CONSTANTS.BORDER_WIDTH,
    borderRadius: radius.md,
    backgroundColor: colors.inputBackground,
  },

  // Input field
  input: {
    fontSize: fontSize.md,
    fontFamily: FONTFAMILY.regular,
    paddingHorizontal: TEXT_INPUT_CONSTANTS.INPUT_PADDING,
    paddingVertical: TEXT_INPUT_CONSTANTS.INPUT_PADDING,
    borderRadius: radius.md,
    color: colors.textPrimary,
  },

  // Icon container
  iconContainer: {
    paddingHorizontal: TEXT_INPUT_CONSTANTS.ICON_PADDING,
  },

  // Error text
  errorText: {
    fontSize: fontSize.xs,
    color: colors.error,
    marginTop: TEXT_INPUT_CONSTANTS.ERROR_MARGIN_TOP,
  },

  // Suffix text
  suffixText: {
    fontSize: fontSize.xs,
    paddingHorizontal: TEXT_INPUT_CONSTANTS.INPUT_PADDING,
    color: colors.textSecondary,
    fontFamily: FONTFAMILY.regular,
  },

  // Prefix container
  prefixContainer: {
    paddingHorizontal: TEXT_INPUT_CONSTANTS.PREFIX_PADDING,
    borderRightWidth: TEXT_INPUT_CONSTANTS.BORDER_WIDTH,
    borderRightColor: colors.borderLight,
  },

  // Prefix text
  prefixText: {
    fontSize: fontSize.md,
    fontFamily: FONTFAMILY.medium,
    color: colors.gray500,
  },

  // Placeholder color
  placeholderColor: colors.textPlaceholder,

  // Border colors for different states
  getBorderColor: (options: {
    hasError: boolean;
    isFocused: boolean;
    defaultColor: string;
  }) => {
    if (options.hasError) return colors.error;
    if (options.isFocused) return colors.primary;
    return options.defaultColor;
  },

  // Label color based on error state
  getLabelColor: (hasError: boolean) =>
    hasError ? colors.error : colors.textSecondary,

  // Input height calculation
  getInputHeight: (baseHeight: number, isMultiline: boolean) =>
    isMultiline
      ? spacing.xl * TEXT_INPUT_CONSTANTS.MULTILINE_HEIGHT_MULTIPLIER
      : baseHeight,
});

export type SharedStyles = ReturnType<typeof getSharedStyles>;

// =============================================================================
// TYPES
// =============================================================================

export type AutoCompleteType =
  | 'additional-name'
  | 'address-line1'
  | 'address-line2'
  | 'cc-number'
  | 'country'
  | 'current-password'
  | 'email'
  | 'family-name'
  | 'given-name'
  | 'honorific-prefix'
  | 'honorific-suffix'
  | 'name'
  | 'new-password'
  | 'off'
  | 'one-time-code'
  | 'postal-code'
  | 'street-address'
  | 'tel'
  | 'username';

export type InputModeType =
  | 'none'
  | 'text'
  | 'decimal'
  | 'numeric'
  | 'tel'
  | 'search'
  | 'email'
  | 'url';

export type AutoCapitalizeType = 'none' | 'sentences' | 'words' | 'characters';

export type ReturnKeyType =
  | 'done'
  | 'go'
  | 'next'
  | 'search'
  | 'send'
  | 'default';

export type TextInputFocusEvent =
  | React.FocusEvent
  | NativeSyntheticEvent<TextInputFocusEventData>;

export interface RetaylTextInputProps {
  /** Placeholder text displayed when input is empty */
  placeholder?: string;
  /** Label displayed above the input */
  fieldLabel?: string;
  /**
   * @deprecated Use `onChangeText` instead. This prop will be removed in a future version.
   */
  onChange?: (text: string) => void;
  /** Callback fired when the text input's text changes */
  onChangeText?: (text: string) => void;
  /** Current value of the input */
  value?: string | number;
  /** Input mode for keyboard type */
  inputMode?: InputModeType;
  /** Width of the container */
  width?: DimensionValue;
  /** Height of the input */
  height?: number;
  /** Additional styles for the input */
  inputStyle?: TextStyle;
  /** Additional styles for the container */
  containerStyle?: ViewStyle;
  /** Custom border color */
  borderColor?: string;
  /** Callback fired when input receives focus */
  onFocus?: (e: TextInputFocusEvent) => void;
  /** Auto focus on mount */
  autoFocus?: boolean;
  /** Read-only mode */
  readOnly?: boolean;
  /** Disabled state - prevents input and shows disabled styling */
  disabled?: boolean;
  /** Maximum character length */
  maxLength?: number;
  /** Enable multiline input */
  multiline?: boolean;
  /** Return key type for keyboard */
  returnKeyType?: ReturnKeyType;
  /** Enable secure text entry (password) */
  secureTextEntry?: boolean;
  /** Icon to display on the right */
  icon?: React.ReactNode;
  /** Auto-complete type */
  autoComplete?: AutoCompleteType;
  /** Auto-capitalize behavior */
  autoCapitalize?: AutoCapitalizeType;
  /** Error state */
  error?: boolean;
  /** Error message to display */
  errorMessage?: string;
  /** Required field indicator */
  required?: boolean;
  /** Suffix text or element */
  suffixText?: string | React.ReactNode;
  /** Prefix text or element */
  prefixText?: string | React.ReactNode;
  /** Callback fired on submit */
  onSubmitEditing?: () => void;
  /** Callback fired when input loses focus */
  onBlur?: (e: TextInputFocusEvent) => void;
  /** Background color for label (deprecated) */
  labelBackgroundColor?: string;
  /** Show info tooltip */
  info?: boolean;
  /** Info tooltip title */
  infoTitle?: string;
  /** Info tooltip message */
  infoMessage?: string;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Accessibility hint */
  accessibilityHint?: string;
  /** Custom input ID */
  inputId?: string;
  /** IDs of elements that describe the input */
  describedById?: string;
  /**
   * Trim leading/trailing whitespace on blur.
   * Defaults to true. Automatically disabled when `disableSanitization` or `secureTextEntry` is true.
   */
  trimWhitespace?: boolean;
  /** Disable input sanitization */
  disableSanitization?: boolean;
}

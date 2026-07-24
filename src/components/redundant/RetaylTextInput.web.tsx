/**
 * RetaylTextInput - Web Implementation
 *
 * Uses native HTML input for full CSS control over placeholder styling.
 * Shares logic with native version via useRetaylTextInput hook.
 */

import React, { useMemo, useRef } from 'react';
import { useTheme } from '@retayl/hooks';
import { fontSize, radius, spacing, zIndex } from '@retayl/utils';
import { FONTFAMILY } from '@retayl/fonts';
import { Eye, EyeOff } from 'lucide-react';
import RetaylText from './RetaylText';
import RetaylTooltip from './RetaylTooltip';
import { useWebStyleTag } from './useWebStyleTag';
import { useRetaylTextInput } from './useRetaylTextInput';
import {
  TEXT_INPUT_CONSTANTS,
  type RetaylTextInputProps,
} from './RetaylTextInput.types';

const RetaylTextInput: React.FC<RetaylTextInputProps> = ({
  fieldLabel,
  placeholder,
  value = '',
  width = '100%',
  height = spacing.xl,
  inputStyle,
  containerStyle,
  borderColor,
  autoFocus,
  maxLength,
  multiline,
  readOnly,
  disabled = false,
  onChange,
  onChangeText,
  onFocus,
  secureTextEntry = false,
  icon,
  autoComplete,
  inputMode = 'text',
  autoCapitalize = 'none',
  error = false,
  errorMessage,
  required = false,
  suffixText,
  prefixText,
  onSubmitEditing,
  onBlur,
  info = false,
  infoTitle,
  infoMessage,
  accessibilityLabel,
  inputId,
  describedById,
  trimWhitespace = true,
  disableSanitization = false,
}) => {
  const { colors } = useTheme();
  const effectiveBorderColor = borderColor || colors.borderLight;

  const {
    secure,
    isFocused,
    resolvedError,
    resolvedErrorText,
    resolvedInputId,
    labelId,
    errorId,
    resolvedAccessibilityLabel,
    describedByIds,
    shouldShowLabel,
    handleFocus,
    handleBlur,
    handleChange,
    toggleSecure,
  } = useRetaylTextInput({
    value,
    required,
    error,
    errorMessage,
    inputId,
    fieldLabel,
    placeholder,
    accessibilityLabel,
    describedById,
    secureTextEntry,
    inputMode,
    autoComplete,
    trimWhitespace,
    disableSanitization,
    onChangeText,
    onChange,
  });

  const hasIcon = icon || secureTextEntry;
  const isPrimitivePrefix =
    typeof prefixText === 'string' || typeof prefixText === 'number';
  const shouldShowInfoIcon = info && infoMessage;
  const resolvedInfoTitle = infoTitle ?? fieldLabel ?? 'Information';

  const resolvedBorderColor = resolvedError
    ? colors.error
    : isFocused
      ? colors.primary
      : effectiveBorderColor;

  const inputHeight = multiline
    ? spacing.xl * TEXT_INPUT_CONSTANTS.MULTILINE_HEIGHT_MULTIPLIER
    : height;

  // Map inputMode to HTML input type
  const htmlInputType = useMemo(() => {
    if (secure) return 'password';
    switch (inputMode) {
      case 'email':
        return 'email';
      case 'tel':
        return 'tel';
      case 'url':
        return 'url';
      case 'numeric':
      case 'decimal':
        return 'text'; // Use text with pattern for better control
      case 'search':
        return 'search';
      default:
        return 'text';
    }
  }, [inputMode, secure]);

  const styles = {
    container: {
      width: typeof width === 'number' ? `${width}px` : width,
      ...containerStyle,
    } as React.CSSProperties,
    labelRow: {
      display: 'flex',
      flexDirection: 'row' as const,
      alignItems: 'center',
      marginBottom: spacing.xs,
    },
    label: {
      fontSize: fontSize.sm,
      fontFamily: FONTFAMILY.regular,
      color: resolvedError ? colors.error : colors.textSecondary,
    },
    infoIconWrapper: {
      marginLeft: spacing.xs / 2,
      zIndex: zIndex.tooltip,
    },
    inputContainer: {
      display: 'flex',
      flexDirection: 'row' as const,
      alignItems: 'center',
      borderWidth: TEXT_INPUT_CONSTANTS.BORDER_WIDTH,
      borderStyle: 'solid' as const,
      borderColor: resolvedBorderColor,
      borderRadius: radius.md,
      backgroundColor: disabled
        ? colors.backgroundSecondary
        : colors.inputBackground,
      height: inputHeight,
      transition: 'border-color 150ms ease, background-color 150ms ease',
      opacity: disabled ? TEXT_INPUT_CONSTANTS.DISABLED_OPACITY : 1,
      cursor: disabled ? 'not-allowed' : 'text',
    },
    input: {
      flex: 1,
      fontSize: fontSize.md,
      padding: TEXT_INPUT_CONSTANTS.INPUT_PADDING,
      borderRadius: radius.md,
      fontFamily: FONTFAMILY.regular,
      backgroundColor: 'transparent',
      border: 'none',
      outline: 'none',
      color: disabled ? colors.textTertiary : colors.textPrimary,
      width: '100%',
      height: '100%',
      cursor: disabled ? 'not-allowed' : 'text',
      ...inputStyle,
    } as React.CSSProperties,
    iconContainer: {
      paddingLeft: TEXT_INPUT_CONSTANTS.ICON_PADDING,
      paddingRight: TEXT_INPUT_CONSTANTS.ICON_PADDING,
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
    },
    errorText: {
      color: colors.error,
      fontSize: fontSize.xs,
      marginTop: 5,
    },
    suffixText: {
      fontSize: fontSize.xs,
      paddingLeft: TEXT_INPUT_CONSTANTS.INPUT_PADDING,
      paddingRight: TEXT_INPUT_CONSTANTS.INPUT_PADDING,
      color: colors.textSecondary,
      fontFamily: FONTFAMILY.regular,
    },
    prefixContainer: {
      height: '100%',
      display: 'flex',
      flexDirection: 'row' as const,
      alignItems: 'center',
    },
    prefixPrimitive: {
      paddingLeft: TEXT_INPUT_CONSTANTS.PREFIX_PADDING,
      paddingRight: TEXT_INPUT_CONSTANTS.PREFIX_PADDING,
      borderRight: `${TEXT_INPUT_CONSTANTS.BORDER_WIDTH}px solid ${colors.borderLight}`,
      height: '100%',
      display: 'flex',
      alignItems: 'center',
    },
    prefixCustom: {
      padding: 0,
    },
    prefixText: {
      fontFamily: FONTFAMILY.medium,
      color: colors.gray500,
    },
  };

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useWebStyleTag({
    id: 'retayl-text-input-placeholder-styles',
    cssText: `
      .retayl-text-input::placeholder {
        color: ${colors.textPlaceholder} !important;
        -webkit-text-fill-color: ${colors.textPlaceholder} !important;
        opacity: 1 !important;
      }

      html.dark .retayl-text-input::placeholder {
        color: ${colors.textPlaceholder} !important;
        -webkit-text-fill-color: ${colors.textPlaceholder} !important;
        opacity: 1 !important;
      }
    `,
  });

  const sharedInputProps = {
    id: resolvedInputId,
    value: value?.toString() ?? '',
    placeholder,
    autoFocus,
    maxLength,
    readOnly,
    disabled,
    autoComplete,
    autoCapitalize,
    'aria-label': resolvedAccessibilityLabel,
    'aria-labelledby': fieldLabel ? labelId : undefined,
    'aria-describedby': describedByIds,
    'aria-invalid': resolvedError || undefined,
    'aria-disabled': disabled || undefined,
    className: 'retayl-text-input',
    style: {
      ...styles.input,
      resize: multiline ? ('none' as const) : undefined,
    },
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (disabled) return;
      handleFocus();
      onFocus?.(e);
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      handleBlur(e.target.value);
      onBlur?.(e);
    },
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      handleChange(e.target.value),
    onKeyDown: (
      e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      if (e.key === 'Enter' && !multiline) {
        onSubmitEditing?.();
      }
    },
  };

  // Cast refs for proper typing with HTML elements
  const textareaRef = inputRef as React.RefObject<HTMLTextAreaElement>;
  const inputElementRef = inputRef as React.RefObject<HTMLInputElement>;

  return (
    <div style={styles.container}>
      {shouldShowLabel && (
        <div style={styles.labelRow}>
          <label id={labelId} htmlFor={resolvedInputId} style={styles.label}>
            {fieldLabel}
            {required && ' *'}
          </label>
          {shouldShowInfoIcon && (
            <div style={styles.infoIconWrapper}>
              <RetaylTooltip
                title={resolvedInfoTitle}
                message={infoMessage}
                accessibilityLabel={resolvedInfoTitle}
              />
            </div>
          )}
        </div>
      )}

      <div
        style={styles.inputContainer}
        className={
          disabled
            ? ''
            : 'hover:bg-surface-hover transition-colors duration-150 dark:hover:bg-surface'
        }
      >
        {prefixText && (
          <div
            style={{
              ...styles.prefixContainer,
              ...(isPrimitivePrefix
                ? styles.prefixPrimitive
                : styles.prefixCustom),
            }}
          >
            {isPrimitivePrefix ? (
              <RetaylText
                text={String(prefixText)}
                size={fontSize.md}
                color={colors.gray500}
                extraStyle={styles.prefixText}
              />
            ) : (
              prefixText
            )}
          </div>
        )}

        {multiline ? (
          <textarea ref={textareaRef} {...sharedInputProps} />
        ) : (
          <input
            ref={inputElementRef}
            type={htmlInputType}
            {...sharedInputProps}
          />
        )}

        {suffixText && (
          <RetaylText
            text={typeof suffixText === 'string' ? suffixText : ''}
            extraStyle={styles.suffixText}
          />
        )}

        {hasIcon && (
          <div
            style={styles.iconContainer}
            onClick={secureTextEntry ? toggleSecure : undefined}
          >
            {secureTextEntry ? (
              secure ? (
                <Eye width={spacing.sm} height={spacing.sm} />
              ) : (
                <EyeOff width={spacing.sm} height={spacing.sm} />
              )
            ) : (
              icon
            )}
          </div>
        )}
      </div>

      {resolvedError && resolvedErrorText && (
        <div id={errorId} role='alert' style={styles.errorText}>
          {resolvedErrorText}
        </div>
      )}
    </div>
  );
};

export default RetaylTextInput;

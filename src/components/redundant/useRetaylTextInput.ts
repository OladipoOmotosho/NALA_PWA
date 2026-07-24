/**
 * useRetaylTextInput Hook
 *
 * Shared logic for RetaylTextInput component
 * Used by both native and web implementations
 */

import { useEffect, useId, useMemo, useState } from 'react';
import { sanitizeByInputType } from '@retayl/hooks';
import {
  TEXT_INPUT_CONSTANTS,
  type InputModeType,
  type AutoCompleteType,
} from './RetaylTextInput.types';

interface UseRetaylTextInputOptions {
  value?: string | number;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
  inputId?: string;
  fieldLabel?: string;
  placeholder?: string;
  accessibilityLabel?: string;
  describedById?: string;
  secureTextEntry?: boolean;
  inputMode?: InputModeType;
  autoComplete?: AutoCompleteType;
  trimWhitespace?: boolean;
  disableSanitization?: boolean;
  onChangeText?: (text: string) => void;
  onChange?: (text: string) => void;
}

export const useRetaylTextInput = (options: UseRetaylTextInputOptions) => {
  const {
    value = '',
    required = false,
    error = false,
    errorMessage,
    inputId,
    fieldLabel,
    placeholder,
    accessibilityLabel,
    describedById,
    secureTextEntry = false,
    inputMode = 'text',
    autoComplete,
    trimWhitespace = true,
    disableSanitization = false,
    onChangeText,
    onChange,
  } = options;

  // State
  const [secure, setSecure] = useState(secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [hasRequiredError, setHasRequiredError] = useState(false);

  // Derived state
  const hasExternalError = Boolean(error || errorMessage);
  const resolvedError = isTouched && (hasExternalError || hasRequiredError);
  const handleTextChange = onChangeText || onChange;

  // ID generation
  const reactGeneratedId = useId();
  const sanitizedGeneratedId = useMemo(
    () => reactGeneratedId.replace(/[:]/g, '-'),
    [reactGeneratedId],
  );
  const resolvedInputId = useMemo(
    () =>
      inputId && inputId.trim().length > 0
        ? inputId
        : `retayl-text-input-${sanitizedGeneratedId}`,
    [inputId, sanitizedGeneratedId],
  );
  const labelId = `${resolvedInputId}-label`;
  const errorId = `${resolvedInputId}-error`;

  // Accessibility
  const resolvedAccessibilityLabel =
    accessibilityLabel ?? fieldLabel ?? placeholder ?? undefined;

  const describedByIds = useMemo(() => {
    const ids: string[] = [];
    if (describedById) ids.push(describedById);
    if (resolvedError && errorMessage) ids.push(errorId);
    return ids.join(' ') || undefined;
  }, [describedById, errorId, resolvedError, errorMessage]);

  // Label visibility
  const shouldShowLabel =
    fieldLabel !== undefined &&
    fieldLabel !== null &&
    typeof fieldLabel === 'string' &&
    fieldLabel.trim() !== '';

  // Error text
  const resolvedErrorText = errorMessage || '';

  // Required validation
  useEffect(() => {
    if (!required) {
      setHasRequiredError(false);
      return;
    }

    const normalizedValue = typeof value === 'string' ? value.trim() : value;
    const isEmpty =
      normalizedValue === '' ||
      normalizedValue === null ||
      normalizedValue === undefined;

    if (isEmpty && !hasExternalError) {
      setHasRequiredError(true);
    } else {
      setHasRequiredError(false);
    }
  }, [value, required, hasExternalError]);

  // Handlers
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (currentValue?: string | number) => {
    setIsFocused(false);
    setIsTouched(true);

    const valueToUse = currentValue ?? value;
    const shouldTrimWhitespace =
      trimWhitespace && !disableSanitization && !secureTextEntry;

    if (shouldTrimWhitespace && typeof valueToUse === 'string') {
      const trimmed = valueToUse.trim();
      if (trimmed !== valueToUse) {
        handleTextChange?.(trimmed);
      }
    }

    const trimmedForValidation =
      typeof valueToUse === 'string' ? valueToUse.trim() : valueToUse;
    if (required && trimmedForValidation === '' && !hasExternalError) {
      setHasRequiredError(true);
    }
  };

  const handleChange = (text: string) => {
    let filteredText = text;
    if (inputMode === 'decimal') {
      filteredText = text.replace(/[^0-9.]/g, '');
      const parts = filteredText.split('.');
      if (parts.length > TEXT_INPUT_CONSTANTS.MAX_DECIMAL_PARTS) {
        filteredText = parts[0] + '.' + parts.slice(1).join('');
      }
    }

    const sanitizedText = disableSanitization
      ? filteredText
      : sanitizeByInputType(filteredText, inputMode, autoComplete);

    handleTextChange?.(sanitizedText);

    const trimmedFilteredText =
      typeof sanitizedText === 'string' ? sanitizedText.trim() : sanitizedText;
    if (required && trimmedFilteredText !== '' && !hasExternalError) {
      setHasRequiredError(false);
    }
  };

  const toggleSecure = () => {
    setSecure(!secure);
  };

  return {
    // State
    secure,
    isFocused,
    isTouched,
    resolvedError,
    resolvedErrorText,

    // IDs
    resolvedInputId,
    labelId,
    errorId,

    // Accessibility
    resolvedAccessibilityLabel,
    describedByIds,

    // Computed
    shouldShowLabel,

    // Handlers
    handleFocus,
    handleBlur,
    handleChange,
    toggleSecure,
  };
};

export default useRetaylTextInput;

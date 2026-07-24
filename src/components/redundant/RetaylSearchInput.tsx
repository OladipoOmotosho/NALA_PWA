import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import {
  radius,
  spacing,
  fontSize,
  iconSize,
  borderWidth,
  opacity,
} from '@retayl/utils';
import { FONTFAMILY } from '@retayl/fonts';
import { useTheme } from '@retayl/hooks';
import type { RetaylSearchInputProps } from './RetaylSearchInput.types';
import { LucideIcon } from './icons/LucideIcon';
import { useWebStyleTag } from './useWebStyleTag';

/**
 * RetaylSearchInput - Platform-agnostic search input component
 *
 * A reusable search input that follows the Retayl design system with:
 * - Consistent styling across all platforms
 * - Built-in search icon
 * - Optional debounced search
 * - Optional clear button
 * - Dark mode support
 * - 48px height matching other inputs
 *
 * @example
 * ```tsx
 * <RetaylSearchInput
 *   value={searchQuery}
 *   onChangeText={setSearchQuery}
 *   placeholder="Search countries..."
 *   autoFocus
 *   debounceMs={300}
 *   showClearButton
 * />
 * ```
 */
const SearchIcon = ({
  size,
  color,
  style,
}: {
  size: number;
  color: string;
  style?: object;
}) => <LucideIcon name='Search' size={size} color={color} style={style} />;

const CloseIcon = ({ size, color }: { size: number; color: string }) => (
  <LucideIcon name='X' size={size} color={color} />
);

// Clear button dimensions
const CLEAR_BUTTON_SIZE = iconSize.md;
const CLEAR_BUTTON_RADIUS = CLEAR_BUTTON_SIZE / 2;
// Clear icon is slightly larger than iconSize.xs (16px) to match visual weight
// against the input text and search icon in tight layouts.
const CLEAR_ICON_SIZE = iconSize.xs + 2; // 18px

const RetaylSearchInput: React.FC<RetaylSearchInputProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  autoFocus = false,
  debounceMs = 0,
  showClearButton = true,
  isLoading = false,
  containerStyle,
  inputStyle,
  disabled = false,
  autoCorrect = false,
  autoCapitalize = 'none',
}) => {
  const { colors } = useTheme();
  const [internalValue, setInternalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reactGeneratedId = useId();
  const sanitizedGeneratedId = useMemo(
    () => reactGeneratedId.replace(/[:]/g, '-'),
    [reactGeneratedId],
  );
  const resolvedInputId = useMemo(
    () => `retayl-search-input-${sanitizedGeneratedId}`,
    [sanitizedGeneratedId],
  );

  useWebStyleTag({
    id: `retayl-search-input-placeholder-styles-${sanitizedGeneratedId}`,
    cssText: `
      #${resolvedInputId}::placeholder {
        color: ${colors.textPlaceholder} !important;
        -webkit-text-fill-color: ${colors.textPlaceholder} !important;
        opacity: 1 !important;
      }

      html.dark #${resolvedInputId}::placeholder {
        color: ${colors.textPlaceholder} !important;
        -webkit-text-fill-color: ${colors.textPlaceholder} !important;
        opacity: 1 !important;
      }
    `,
  });

  // Sync internal value with prop
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Debounced change handler
  const handleChangeText = useCallback(
    (text: string) => {
      setInternalValue(text);

      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // If no debounce, call immediately
      if (debounceMs === 0) {
        onChangeText(text);
        return;
      }

      // Set new debounce timer
      debounceTimerRef.current = setTimeout(() => {
        onChangeText(text);
      }, debounceMs);
    },
    [debounceMs, onChangeText],
  );

  // Clear search
  const handleClear = useCallback(() => {
    setInternalValue('');
    onChangeText('');
  }, [onChangeText]);

  // Focus handlers
  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const showClear = showClearButton && internalValue.length > 0 && !isLoading;

  return (
    <View
      testID='search-input-container'
      style={[
        styles.container,
        {
          backgroundColor: colors.backgroundSecondary,
          borderColor: isFocused ? colors.primary : colors.borderLight,
        },
        disabled && { opacity: opacity.disabled },
        containerStyle,
      ]}
    >
      {/* Search Icon / Loading */}
      {isLoading ? (
        <ActivityIndicator
          testID='loading-indicator'
          size='small'
          color={colors.textSecondary}
          style={styles.searchIcon}
        />
      ) : (
        <SearchIcon
          size={iconSize.sm}
          color={colors.textSecondary}
          style={styles.searchIcon}
        />
      )}

      {/* Text Input */}
      <TextInput
        nativeID={resolvedInputId}
        value={internalValue}
        onChangeText={handleChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        placeholderTextColor={colors.textPlaceholder}
        autoFocus={autoFocus}
        autoCorrect={autoCorrect}
        autoCapitalize={autoCapitalize}
        editable={!disabled}
        style={[
          styles.input,
          {
            color: colors.textPrimary,
          },
          inputStyle,
        ]}
        accessibilityRole='search'
        accessibilityLabel='Search input'
      />

      {/* Clear Button */}
      {showClear && (
        <Pressable
          onPress={handleClear}
          style={({ pressed }) => [
            styles.clearButton,
            pressed && styles.clearButtonPressed,
          ]}
          hitSlop={{
            top: spacing.xs,
            bottom: spacing.xs,
            left: spacing.xs,
            right: spacing.xs,
          }}
          accessibilityRole='button'
          accessibilityLabel='Clear search'
        >
          <CloseIcon size={CLEAR_ICON_SIZE} color={colors.textSecondary} />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: spacing.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm - spacing.xxxs, // 12px = 16 - 4
    borderRadius: radius.md,
    borderWidth: borderWidth.thin,
    gap: spacing.sm,
  },
  searchIcon: {
    flexShrink: 0,
  },
  input: {
    flex: 1,
    fontSize: fontSize.md,
    fontFamily: FONTFAMILY.regular,
    paddingVertical: 0,
    margin: 0,
  },
  clearButton: {
    flexShrink: 0,
    width: CLEAR_BUTTON_SIZE,
    height: CLEAR_BUTTON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: CLEAR_BUTTON_RADIUS,
  },
  clearButtonPressed: {
    opacity: opacity.loading,
  },
});

export default RetaylSearchInput;
export { RetaylSearchInput };

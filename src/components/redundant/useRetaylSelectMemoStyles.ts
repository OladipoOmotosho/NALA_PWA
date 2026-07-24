/**
 * Hook that memoizes all derived style objects for RetaylSelect.
 * Extracted to reduce the main component's line count and complexity.
 */
import { useMemo } from 'react';
import { spacing, applyOpacity, fontWeight } from '@retayl/utils';
import type { DimensionValue, ViewStyle } from 'react-native';
import {
  buildSelectStyles,
  type SelectStyles,
  TRANSITION_DURATION,
} from './RetaylSelectStyles';

/** Theme colors subset needed by the style hook */
interface StyleColors {
  primary: string;
  error: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textPlaceholder: string;
  inputBackground: string;
  backgroundSecondary: string;
  borderLight: string;
  white: string;
}

/** Input parameters for the style hook */
export interface UseSelectMemoStylesParams {
  colors: StyleColors;
  resolvedError: boolean;
  effectiveBorderColor: string;
  readOnly: boolean;
  isLoading: boolean;
  height: number;
  dropdownPosition: { top: number; left: number; width: number };
  dropdownZIndexValue: number;
  width: DimensionValue;
  containerStyle?: ViewStyle;
  showDropdown: boolean;
  searchQuery: string;
  scrollbarStyle: 'styled' | 'hidden' | 'default';
}

/** Return type of the style hook */
export interface UseSelectMemoStylesReturn {
  styles: SelectStyles;
  containerMergedStyle: React.CSSProperties;
  triggerStyle: React.CSSProperties;
  textColorStyle: React.CSSProperties;
  suffixStyle: React.CSSProperties;
  chevronStyle: React.CSSProperties;
  loadingStyle: React.CSSProperties;
  searchInputStyle: React.CSSProperties;
  headerActionStyle: React.CSSProperties;
  headerTextStyle: React.CSSProperties;
  addMoreStyle: React.CSSProperties;
  addMoreTextStyle: React.CSSProperties;
  scrollbarCls: string;
}

/** Maps scrollbar style preference to CSS class name */
const getScrollbarClassName = (
  style: 'styled' | 'hidden' | 'default',
): string => {
  const classMap: Record<string, string> = {
    hidden: 'retayl-scrollbar-hidden',
    styled: 'retayl-scrollbar-styled',
  };
  return classMap[style] ?? '';
};

/** Memoizes trigger-related styles */
const useTriggerStyles = (
  styles: SelectStyles,
  colors: StyleColors,
  showDropdown: boolean,
  resolvedError: boolean,
  effectiveBorderColor: string,
) => {
  const triggerBorderColor = useMemo(() => {
    if (showDropdown) return colors.primary;
    if (resolvedError) return colors.error;
    return effectiveBorderColor;
  }, [
    showDropdown,
    resolvedError,
    colors.primary,
    colors.error,
    effectiveBorderColor,
  ]);

  const triggerStyle = useMemo<React.CSSProperties>(
    () => ({ ...styles.trigger, borderColor: triggerBorderColor }),
    [styles.trigger, triggerBorderColor],
  );

  const textColorStyle = useMemo<React.CSSProperties>(
    () => ({ color: colors.textPrimary }),
    [colors.textPrimary],
  );
  const suffixStyle = useMemo<React.CSSProperties>(
    () => ({ fontSize: `${spacing.xs}px`, color: colors.textSecondary }),
    [colors.textSecondary],
  );
  const chevronStyle = useMemo<React.CSSProperties>(
    () => ({
      transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: `transform ${TRANSITION_DURATION} ease`,
    }),
    [showDropdown],
  );
  const loadingStyle = useMemo<React.CSSProperties>(
    () => ({ color: colors.textSecondary }),
    [colors.textSecondary],
  );

  return {
    triggerStyle,
    textColorStyle,
    suffixStyle,
    chevronStyle,
    loadingStyle,
  };
};

/** Memoizes dropdown header and action styles */
const useDropdownActionStyles = (
  styles: SelectStyles,
  colors: StyleColors,
  searchQuery: string,
) => {
  const searchInputStyle = useMemo<React.CSSProperties>(
    () => ({
      ...styles.searchInput,
      paddingLeft: `${spacing.xl}px`,
      paddingRight: searchQuery ? `${spacing.xl}px` : `${spacing.sm}px`,
    }),
    [styles.searchInput, searchQuery],
  );

  const headerActionStyle = useMemo<React.CSSProperties>(
    () => ({
      ...styles.option,
      backgroundColor: applyOpacity(colors.primary, 'minimal'),
      marginBottom: `${spacing.xs}px`,
    }),
    [styles.option, colors.primary],
  );

  const headerTextStyle = useMemo<React.CSSProperties>(
    () => ({ color: colors.primary, fontWeight: fontWeight.medium }),
    [colors.primary],
  );

  const addMoreStyle = useMemo<React.CSSProperties>(
    () => ({
      ...styles.option,
      backgroundColor: applyOpacity(colors.primary, 'whisper'),
      marginBottom: `${spacing.xs}px`,
    }),
    [styles.option, colors.primary],
  );

  const addMoreTextStyle = useMemo<React.CSSProperties>(
    () => ({ marginLeft: `${spacing.xs}px`, color: colors.primary }),
    [colors.primary],
  );

  return {
    searchInputStyle,
    headerActionStyle,
    headerTextStyle,
    addMoreStyle,
    addMoreTextStyle,
  };
};

/**
 * Memoizes all derived style objects for RetaylSelect.
 *
 * @param params - Theme colors, state flags, and layout measurements
 * @returns All memoized style objects needed by the component tree
 */
export const useSelectMemoStyles = (
  params: UseSelectMemoStylesParams,
): UseSelectMemoStylesReturn => {
  const {
    colors,
    resolvedError,
    effectiveBorderColor,
    readOnly,
    isLoading,
    height,
    dropdownPosition,
    dropdownZIndexValue,
    width,
    containerStyle,
    showDropdown,
    searchQuery,
    scrollbarStyle,
  } = params;

  const styles = useMemo(
    () =>
      buildSelectStyles({
        colors,
        resolvedError,
        effectiveBorderColor,
        readOnly,
        isLoading,
        height,
        dropdownPosition,
        dropdownZIndexValue,
      }),
    [
      colors,
      resolvedError,
      effectiveBorderColor,
      readOnly,
      isLoading,
      height,
      dropdownPosition,
      dropdownZIndexValue,
    ],
  );

  const containerMergedStyle = useMemo<React.CSSProperties>(
    () =>
      ({
        ...styles.container,
        width,
        ...containerStyle,
      }) as React.CSSProperties,
    [styles.container, width, containerStyle],
  );

  const trigger = useTriggerStyles(
    styles,
    colors,
    showDropdown,
    resolvedError,
    effectiveBorderColor,
  );
  const actions = useDropdownActionStyles(styles, colors, searchQuery);
  const scrollbarCls = useMemo(
    () => getScrollbarClassName(scrollbarStyle),
    [scrollbarStyle],
  );

  return {
    styles,
    containerMergedStyle,
    scrollbarCls,
    ...trigger,
    ...actions,
  };
};

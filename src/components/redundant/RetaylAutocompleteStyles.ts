/**
 * RetaylAutocomplete Styles
 *
 * Extracted style definitions for the RetaylAutocomplete component
 * to keep the main component under ESLint max-lines limits.
 *
 * @module components/shared/RetaylAutocompleteStyles
 */

import { useMemo } from 'react';
import {
  radius,
  spacing,
  fontSize,
  getNextZIndex,
  applyOpacity,
} from '@retayl/utils';
import { useTheme } from '@retayl/hooks';
import { FONTFAMILY } from '@retayl/fonts';

const DROPDOWN_MAX_HEIGHT = 280;
const TRANSITION_DURATION = '0.15s';
const BOX_SHADOW = '0 8px 32px rgba(0, 0, 0, 0.12)';
const Z_INDEX_STEP = 100;
const SUBTITLE_MARGIN_TOP = 2;
const CLEAR_BUTTON_PADDING = 2;

/** Position data for the dropdown portal */
export interface DropdownPosition {
  top: number;
  left: number;
  width: number;
}

interface StyleOptions {
  width: string | number;
  error: boolean;
  disabled: boolean;
  dropdownPosition: DropdownPosition;
}

/** Builds layout-related styles (container, label, input wrapper) */
function buildLayoutStyles(
  colors: ReturnType<typeof useTheme>['colors'],
  opts: StyleOptions,
) {
  return {
    container: {
      width: opts.width,
      position: 'relative',
    } as React.CSSProperties,
    labelRow: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: spacing.xs,
    } as React.CSSProperties,
    label: {
      fontSize: fontSize.sm,
      fontFamily: FONTFAMILY.regular,
      color: opts.error ? colors.error : colors.textSecondary,
    } as React.CSSProperties,
    inputWrapper: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    } as React.CSSProperties,
    errorText: {
      fontSize: fontSize.xs,
      color: colors.error,
      marginTop: spacing.xs,
      fontFamily: FONTFAMILY.regular,
    } as React.CSSProperties,
  };
}

/** Builds input and icon styles */
function buildInputStyles(
  colors: ReturnType<typeof useTheme>['colors'],
  opts: StyleOptions,
) {
  return {
    input: {
      width: '100%',
      height: spacing.xl,
      padding: `0 ${spacing.xl}px 0 ${spacing.xl}px`,
      border: `1px solid ${opts.error ? colors.error : colors.borderLight}`,
      borderRadius: radius.md,
      fontSize: fontSize.sm,
      fontFamily: FONTFAMILY.regular,
      color: colors.textPrimary,
      backgroundColor: opts.disabled
        ? colors.backgroundSecondary
        : colors.inputBackground,
      outline: 'none',
      transition: `border-color ${TRANSITION_DURATION} ease`,
      cursor: opts.disabled ? 'not-allowed' : 'text',
    } as React.CSSProperties,
    inputFocused: {
      borderColor: colors.primary,
    } as React.CSSProperties,
    searchIcon: {
      position: 'absolute',
      left: spacing.sm,
      pointerEvents: 'none',
      color: colors.textTertiary,
    } as React.CSSProperties,
    clearButton: {
      position: 'absolute',
      right: spacing.sm,
      cursor: 'pointer',
      color: colors.textTertiary,
      padding: CLEAR_BUTTON_PADDING,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    } as React.CSSProperties,
    loadingIcon: {
      position: 'absolute',
      right: spacing.sm,
      color: colors.textTertiary,
      animation: 'spin 1s linear infinite',
    } as React.CSSProperties,
  };
}

/** Builds dropdown and item styles */
function buildDropdownStyles(
  colors: ReturnType<typeof useTheme>['colors'],
  opts: StyleOptions,
) {
  return {
    dropdown: {
      position: 'fixed',
      top: opts.dropdownPosition.top,
      left: opts.dropdownPosition.left,
      width: opts.dropdownPosition.width,
      maxHeight: DROPDOWN_MAX_HEIGHT,
      backgroundColor: colors.inputBackground,
      border: `1px solid ${colors.borderLight}`,
      borderRadius: radius.lg,
      boxShadow: BOX_SHADOW,
      zIndex: getNextZIndex('modal', Z_INDEX_STEP),
      overflowY: 'auto',
      padding: spacing.xs,
    } as React.CSSProperties,
    item: {
      display: 'flex',
      alignItems: 'center',
      padding: `${spacing.sm}px ${spacing.sm}px`,
      borderRadius: radius.md,
      cursor: 'pointer',
      transition: `background-color ${TRANSITION_DURATION} ease`,
      backgroundColor: 'transparent',
    } as React.CSSProperties,
    itemHovered: {
      backgroundColor: applyOpacity(colors.primary, 'whisper'),
    } as React.CSSProperties,
    itemContent: {
      flex: 1,
      minWidth: 0,
    } as React.CSSProperties,
    itemLabel: {
      fontSize: fontSize.sm,
      fontFamily: FONTFAMILY.regular,
      color: colors.textPrimary,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    } as React.CSSProperties,
    itemSubtitle: {
      fontSize: fontSize.xs,
      fontFamily: FONTFAMILY.regular,
      color: colors.textTertiary,
      marginTop: SUBTITLE_MARGIN_TOP,
    } as React.CSSProperties,
    itemIcon: {
      marginRight: spacing.sm,
      flexShrink: 0,
    } as React.CSSProperties,
    emptyState: {
      padding: spacing.lg,
      textAlign: 'center',
      color: colors.textSecondary,
      fontSize: fontSize.sm,
      fontFamily: FONTFAMILY.regular,
    } as React.CSSProperties,
  };
}

/**
 * Builds memoized styles for the RetaylAutocomplete component.
 *
 * @param options - Style configuration
 * @returns Memoized style objects
 */
export function useAutocompleteStyles(opts: StyleOptions) {
  const { colors } = useTheme();

  return useMemo(
    () => ({
      ...buildLayoutStyles(colors, opts),
      ...buildInputStyles(colors, opts),
      ...buildDropdownStyles(colors, opts),
    }),
    [colors, opts],
  );
}

/**
 * Shared style factory and constants for RetaylSelect component.
 * Extracted to reduce main component file size and improve maintainability.
 */
import type React from 'react';
import {
  radius,
  spacing,
  fontSize,
  applyOpacity,
  fontWeight,
} from '@retayl/utils';
import { FONTFAMILY } from '@retayl/fonts';

// File-local layout constants (avoid magic numbers)
export const DROPDOWN_OFFSET = spacing.xs;
export const DEFAULT_DROPDOWN_HEIGHT = 300;
export const DROPDOWN_PADDING = spacing.xs;
export const DEFAULT_DROPDOWN_LIST_MAX =
  DEFAULT_DROPDOWN_HEIGHT - DROPDOWN_PADDING * 2;

export const SELECT_CONSTANTS = {
  SEARCH_DEBOUNCE: 10,
  FOCUS_DELAY: 100,
  IMAGE_SIZE: '24px',
  CLEAR_BUTTON_PADDING: '2px',
  SPACING_DIVISOR: 2,
} as const;

export const ICON_SIZE = 16;
export const Z_INDEX_STEP = 100;
export const TRANSITION_DURATION = '0.15s';
const BOX_SHADOW_Y = 8;
const BOX_SHADOW_BLUR = 32;
const BOX_SHADOW_ALPHA = 0.12;

export const SCROLLBAR_WIDTH = 8;
export const SCROLLBAR_THUMB_RADIUS = 4;
export const SCROLLBAR_THUMB_ALPHA = 0.2;
export const SCROLLBAR_THUMB_HOVER_ALPHA = 0.3;
export const DARK_SCROLLBAR_THUMB_ALPHA = 0.3;
export const DARK_SCROLLBAR_THUMB_HOVER_ALPHA = 0.4;

export const SEARCH_INPUT_CLASS = 'retayl-select-search-input';
export const SEARCH_PLACEHOLDER_STYLE_ID =
  'retayl-select-search-placeholder-styles';

/** Colors shape expected by the style builder */
interface SelectColors {
  error: string;
  textSecondary: string;
  textPlaceholder: string;
  textPrimary: string;
  textTertiary: string;
  primary: string;
  inputBackground: string;
  backgroundSecondary: string;
  borderLight: string;
  white: string;
}

/** Parameters for building the select styles object */
export interface SelectStylesParams {
  colors: SelectColors;
  resolvedError: boolean;
  effectiveBorderColor: string;
  readOnly: boolean;
  isLoading: boolean;
  height: number;
  dropdownPosition: { top: number; left: number; width: number };
  dropdownZIndexValue: number;
}

/** Return type of buildSelectStyles */
export type SelectStyles = ReturnType<typeof buildSelectStyles>;

/** Builds trigger and container styles */
const buildTriggerStyles = (params: SelectStylesParams) => {
  const {
    colors,
    resolvedError,
    effectiveBorderColor,
    readOnly,
    isLoading,
    height,
  } = params;
  return {
    container: { width: '100%' } as React.CSSProperties,
    labelRow: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: `${spacing.xs}px`,
    } as React.CSSProperties,
    label: {
      fontSize: `${fontSize.sm}px`,
      fontFamily: FONTFAMILY.regular,
      color: resolvedError ? colors.error : colors.textSecondary,
    } as React.CSSProperties,
    trigger: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      height: `${height}px`,
      padding: `0 ${spacing.sm}px`,
      border: `1px solid ${resolvedError ? colors.error : effectiveBorderColor}`,
      borderRadius: `${radius.md}px`,
      backgroundColor: readOnly
        ? colors.backgroundSecondary
        : colors.inputBackground,
      cursor: readOnly || isLoading ? 'not-allowed' : 'pointer',
      transition: `border-color ${TRANSITION_DURATION} ease`,
      outline: 'none',
    } as React.CSSProperties,
  };
};

/** Builds dropdown panel and list styles */
const buildDropdownStyles = (params: SelectStylesParams) => {
  const { colors, dropdownPosition, dropdownZIndexValue } = params;
  return {
    dropdown: {
      position: 'fixed',
      top: `${dropdownPosition.top}px`,
      left: `${dropdownPosition.left}px`,
      width: `${dropdownPosition.width}px`,
      maxHeight: `${DEFAULT_DROPDOWN_HEIGHT}px`,
      backgroundColor: colors.inputBackground,
      border: `1px solid ${colors.borderLight}`,
      borderRadius: `${radius.lg}px`,
      boxShadow: `0 ${BOX_SHADOW_Y}px ${BOX_SHADOW_BLUR}px rgba(0, 0, 0, ${BOX_SHADOW_ALPHA})`,
      zIndex: dropdownZIndexValue,
      paddingTop: `${DROPDOWN_PADDING}px`,
      paddingBottom: `${DROPDOWN_PADDING}px`,
      overflow: 'hidden',
    } as React.CSSProperties,
    dropdownList: {
      maxHeight: `${DEFAULT_DROPDOWN_LIST_MAX}px`,
      overflowY: 'auto',
      paddingBottom: `${spacing.md}px`,
    } as React.CSSProperties,
    dropdownHeader: {
      padding: `${spacing.sm}px`,
      borderBottom: `1px solid ${colors.borderLight}`,
      fontSize: `${fontSize.md}px`,
      fontWeight: fontWeight.semiBold,
      color: colors.textPrimary,
      backgroundColor: colors.backgroundSecondary,
    } as React.CSSProperties,
    searchContainer: {
      padding: `${spacing.sm}px`,
      borderBottom: `1px solid ${colors.borderLight}`,
    } as React.CSSProperties,
    searchInput: {
      width: '100%',
      padding: `${spacing.xs}px ${spacing.sm}px`,
      border: `1px solid ${colors.borderLight}`,
      borderRadius: `${radius.sm}px`,
      fontSize: `${fontSize.sm}px`,
      fontFamily: FONTFAMILY.regular,
      outline: 'none',
      backgroundColor: colors.white,
    } as React.CSSProperties,
    searchInputWrapper: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    } as React.CSSProperties,
    searchIcon: {
      position: 'absolute',
      left: `${spacing.xs}px`,
      pointerEvents: 'none',
      color: colors.textSecondary,
    } as React.CSSProperties,
    clearButton: {
      position: 'absolute',
      right: `${spacing.xs}px`,
      cursor: 'pointer',
      color: colors.textSecondary,
      padding: SELECT_CONSTANTS.CLEAR_BUTTON_PADDING,
    } as React.CSSProperties,
    emptyState: {
      padding: `${spacing.lg}px`,
      textAlign: 'center',
      color: colors.textSecondary,
      fontSize: `${fontSize.sm}px`,
    } as React.CSSProperties,
  };
};

/** Builds option item styles */
const buildOptionStyles = (colors: SelectColors) => ({
  option: {
    display: 'flex',
    alignItems: 'center',
    padding: `${spacing.xs}px ${spacing.sm}px`,
    margin: `${spacing.xs / SELECT_CONSTANTS.SPACING_DIVISOR}px 0`,
    cursor: 'pointer',
    transition: `background-color ${TRANSITION_DURATION} ease`,
    fontSize: `${fontSize.sm}px`,
    fontFamily: FONTFAMILY.regular,
    color: colors.textPrimary,
    backgroundColor: 'transparent',
  } as React.CSSProperties,
  optionSelected: {
    backgroundColor: applyOpacity(colors.primary, 'minimal'),
    color: colors.primary,
    fontWeight: fontWeight.medium,
  } as React.CSSProperties,
  optionHover: {
    backgroundColor: applyOpacity(colors.primary, 'whisper'),
  } as React.CSSProperties,
  errorText: {
    fontSize: `${fontSize.xs}px`,
    color: colors.error,
    marginTop: `${spacing.xs}px`,
  } as React.CSSProperties,
  placeholder: {
    color: colors.textPlaceholder,
    fontSize: `${fontSize.sm}px`,
    fontFamily: FONTFAMILY.regular,
  } as React.CSSProperties,
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: `${spacing.xs}px`,
  } as React.CSSProperties,
});

/**
 * Builds the complete styles object for RetaylSelect.
 *
 * @param params - Theme colors, state flags, and layout measurements
 * @returns A record of CSS-in-JS style objects keyed by section name
 */
export const buildSelectStyles = (params: SelectStylesParams) => ({
  ...buildTriggerStyles(params),
  ...buildDropdownStyles(params),
  ...buildOptionStyles(params.colors),
});

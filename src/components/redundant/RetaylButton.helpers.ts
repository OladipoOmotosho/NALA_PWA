import { radius } from '@retayl/utils';

/** Button size constants using design tokens */
export const BUTTON_DEFAULTS = {
  DROPDOWN_MIN_WIDTH: 150,
  CHAR_WIDTH_ESTIMATE: 10,
  PADDING_EXTRA: 32,
  PRESSED_OPACITY: 0.8,
  DIVIDER: 2,
  SECONDARY_BORDER_WIDTH: 1.5,
} as const;

interface VariantStylesInput {
  variant: 'primary' | 'secondary' | 'tertiary';
  effectiveBgColor: string;
  buttonTextColor?: string;
  borderColor?: string;
  borderWidth: number;
  borderRadius: number;
  themeColors: {
    backgroundPrimary: string;
    backgroundSecondary: string;
    primary: string;
    textSecondary: string;
    textOnColor: string;
    borderLight: string;
  };
}

interface VariantStyles {
  bgColor: string;
  textColor: string;
  borderColor: string | undefined;
  borderWidth: number;
  borderRadius: number;
}

/**
 * Resolves variant-specific button styles (primary, secondary, tertiary)
 * @param input - Variant configuration and theme colors
 * @returns Resolved style values for the variant
 */
export const getVariantStyles = (input: VariantStylesInput): VariantStyles => {
  const {
    variant,
    effectiveBgColor,
    buttonTextColor,
    borderColor,
    borderWidth,
    borderRadius,
    themeColors,
  } = input;

  switch (variant) {
    case 'tertiary':
      return {
        bgColor: themeColors.backgroundSecondary,
        textColor: buttonTextColor || themeColors.textSecondary,
        borderColor: undefined,
        borderWidth: 0,
        borderRadius: radius.sm,
      };
    case 'secondary':
      return {
        bgColor: themeColors.backgroundPrimary,
        textColor: buttonTextColor || themeColors.primary,
        borderColor: borderColor || themeColors.borderLight,
        borderWidth: borderColor
          ? borderWidth
          : BUTTON_DEFAULTS.SECONDARY_BORDER_WIDTH,
        borderRadius,
      };
    case 'primary':
    default:
      return {
        bgColor: effectiveBgColor,
        textColor: buttonTextColor || themeColors.textOnColor,
        borderColor,
        borderWidth: borderColor ? borderWidth : 0,
        borderRadius,
      };
  }
};

interface DropdownLayoutInput {
  buttonLeft: number;
  buttonWidth: number;
  buttonRight: number;
  dropdownItems: Array<{ label: string; value: string }> | string[];
  dropdownWidth: number | string;
  dropdownPosition: 'auto' | 'left' | 'right' | 'center';
  windowWidth: number;
}

interface DropdownLayout {
  left: number;
  width: number;
  maxContentWidth: number;
}

/**
 * Calculates dropdown position and dimensions based on button position and available space
 * @param input - Button dimensions, dropdown items, and positioning preferences
 * @returns Calculated dropdown layout
 */
export const calculateDropdownLayout = (
  input: DropdownLayoutInput,
): DropdownLayout => {
  const {
    buttonLeft,
    buttonWidth,
    buttonRight,
    dropdownItems,
    dropdownWidth,
    dropdownPosition,
    windowWidth,
  } = input;

  let maxContentWidth: number = BUTTON_DEFAULTS.DROPDOWN_MIN_WIDTH;
  if (dropdownItems.length > 0) {
    const longestItem = dropdownItems.reduce((longest, current) => {
      const currentText = typeof current === 'string' ? current : current.label;
      const longestText = typeof longest === 'string' ? longest : longest.label;
      return currentText.length > longestText.length ? current : longest;
    });
    const longestText =
      typeof longestItem === 'string' ? longestItem : longestItem.label;
    maxContentWidth = Math.max(
      maxContentWidth,
      longestText.length * BUTTON_DEFAULTS.CHAR_WIDTH_ESTIMATE +
        BUTTON_DEFAULTS.PADDING_EXTRA,
    );
  }

  const dropdownWidthValue: number =
    typeof dropdownWidth === 'number' ? dropdownWidth : maxContentWidth;
  let leftPosition = 0;

  if (dropdownPosition === 'auto') {
    const spaceOnRight = windowWidth - buttonRight;
    const spaceOnLeft = buttonLeft;
    if (dropdownWidthValue > buttonWidth) {
      if (spaceOnRight >= dropdownWidthValue) leftPosition = 0;
      else if (spaceOnLeft >= dropdownWidthValue)
        leftPosition = buttonWidth - dropdownWidthValue;
      else
        leftPosition =
          (buttonWidth - dropdownWidthValue) / BUTTON_DEFAULTS.DIVIDER;
    } else {
      leftPosition =
        (buttonWidth - dropdownWidthValue) / BUTTON_DEFAULTS.DIVIDER;
    }
  } else if (dropdownPosition === 'left') {
    leftPosition = 0;
  } else if (dropdownPosition === 'right') {
    leftPosition = buttonWidth - dropdownWidthValue;
  } else if (dropdownPosition === 'center') {
    leftPosition = (buttonWidth - dropdownWidthValue) / BUTTON_DEFAULTS.DIVIDER;
  }

  return { left: leftPosition, width: dropdownWidthValue, maxContentWidth };
};

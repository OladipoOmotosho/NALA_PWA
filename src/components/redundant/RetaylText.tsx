import React, { useMemo } from 'react';
import { useTheme, useResponsive } from '@retayl/hooks';
import { FONTFAMILY } from '@retayl/assets/fonts';
import {
  fontSize as fontSizeTokens,
  getDeviceTypeFromResponsive,
  getResponsiveFontSize,
} from '@retayl/utils';

type ExtendedCSSProperties = React.CSSProperties & {
  WebkitLineClamp?: string | number;
  WebkitBoxOrient?: string;
};

// Default font size from design tokens (16px)
const _DEFAULT_FONT_SIZE = fontSizeTokens.md;

interface ICustomText {
  text?: string | number | React.ReactNode;
  size?: number; // Accepts raw number for flexibility, but use fontSize tokens from @retayl/utils
  color?: string;
  extraStyle?: React.CSSProperties | Record<string, unknown>;
  fontWeight?:
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900';
  fontFamily?: string;
  className?: string;
  title?: string;
  'aria-label'?: string;
  'aria-current'?: string;
  block?: boolean;
  children?: React.ReactNode;
  numberOfLines?: number;
  // Web-specific props
  style?: React.CSSProperties;
  // SEO-specific props for semantic HTML
  as?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'p'
    | 'span'
    | 'strong'
    | 'em'
    | 'label'
    | 'div';
  id?: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  onPress?: (event: React.MouseEvent<HTMLElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => void;
  tabIndex?: number;
  responsive?: boolean;
  accessibilityRole?: string;
  role?: string;
}

/**
 * Custom Text component for Web (SEO-compatible)
 * Automatically uses semantic HTML elements when `as` prop is provided
 *
 * @param text - Text to display
 * @param size - Font size in pixels (default: 16)
 * @param color - Font color (defaults to theme's textPrimary)
 * @param extraStyle - Additional CSS styles
 * @param fontWeight - Font weight (maps to Matter font family variants)
 * @param fontFamily - Font family (default: Matter Regular)
 * @param className - Additional CSS class names
 * @param as - HTML element to render (default: 'span') - Use h1-h6, p for SEO
 * @param block - If true, display as block element
 * @returns React.FC
 */

const weightToMatterFont: Partial<
  Record<NonNullable<ICustomText['fontWeight']>, string>
> = {
  normal: FONTFAMILY.regular,
  bold: FONTFAMILY.bold,
  '100': FONTFAMILY.light,
  '200': FONTFAMILY.light,
  '300': FONTFAMILY.light,
  '400': FONTFAMILY.regular,
  '500': FONTFAMILY.medium,
  '600': FONTFAMILY.semibold,
  '700': FONTFAMILY.bold,
  '800': FONTFAMILY.heavy,
  '900': FONTFAMILY.heavy,
};

const isMatterFamily = (family?: string): boolean =>
  typeof family === 'string' && family.toLowerCase().startsWith('matter');

/** Parses a CSS fontSize value to a number */
const parseFontSizeValue = (
  value: string | number | undefined,
): number | undefined => {
  if (value === undefined) return undefined;
  return typeof value === 'number' ? value : parseInt(value as string, 10);
};

/** Resolves effective font properties from flattened style and props */
function resolveEffectiveFont(
  flattenedStyle: React.CSSProperties,
  size: number | undefined,
  fontFamily: string,
  fontWeight: NonNullable<ICustomText['fontWeight']>,
) {
  const effectiveFontSize = parseFontSizeValue(flattenedStyle.fontSize) ?? size;
  const effectiveFontFamily =
    (typeof flattenedStyle.fontFamily === 'string'
      ? flattenedStyle.fontFamily
      : undefined) ?? fontFamily;
  const effectiveFontWeight =
    (flattenedStyle.fontWeight as ICustomText['fontWeight']) ?? fontWeight;

  const hasMatter = isMatterFamily(effectiveFontFamily);
  const mappedFont = hasMatter
    ? weightToMatterFont[effectiveFontWeight]
    : undefined;
  const resolvedFamily = mappedFont ?? effectiveFontFamily;
  const applyWeight = !hasMatter || !mappedFont || !resolvedFamily;

  return {
    effectiveFontSize,
    resolvedFamily,
    effectiveFontWeight,
    applyWeight,
  };
}

/** Strips font properties from style (we handle them explicitly) */
function sanitizeStyle(style: React.CSSProperties): React.CSSProperties {
  const result = { ...style };
  delete result.fontFamily;
  delete result.fontWeight;
  delete result.fontSize;
  return result;
}

/** Builds the combined style object for the text element */
function buildCombinedStyle(
  resolvedFamily: string,
  adjustedFontSize: number | undefined,
  textColor: string,
  block: boolean,
  applyWeight: boolean,
  effectiveFontWeight: NonNullable<ICustomText['fontWeight']>,
  extraStyle: React.CSSProperties | Record<string, unknown>,
  sanitized: React.CSSProperties,
  numberOfLines?: number,
): ExtendedCSSProperties {
  const combined: ExtendedCSSProperties = {
    fontFamily: resolvedFamily,
    ...(adjustedFontSize !== null && adjustedFontSize !== undefined
      ? { fontSize: `${adjustedFontSize}px` }
      : {}),
    color: textColor,
    display: block ? 'block' : undefined,
    ...(applyWeight && effectiveFontWeight
      ? { fontWeight: effectiveFontWeight }
      : {}),
    ...extraStyle,
    ...sanitized,
  };

  if (numberOfLines && numberOfLines > 0) {
    combined.display = block ? 'block' : '-webkit-box';
    combined.overflow = 'hidden';
    combined.WebkitLineClamp = String(numberOfLines);
    combined.WebkitBoxOrient = 'vertical';
  }

  return combined;
}

/** Resolves display content from children or text prop */
function resolveContent(
  children: React.ReactNode,
  text: ICustomText['text'],
): React.ReactNode {
  const hasCustomChildren =
    children !== undefined && children !== null && children !== false;
  return hasCustomChildren ? children : text;
}

const RetaylText: React.FC<ICustomText> = ({
  text,
  size,
  color,
  extraStyle = {},
  fontWeight = '400',
  fontFamily = FONTFAMILY.regular,
  block = false,
  as: Component = 'span',
  className = '',
  id,
  title,
  'aria-label': ariaLabel,
  style,
  onClick,
  onPress,
  children,
  numberOfLines,
  responsive = true,
  ...props
}) => {
  const { colors: themeColors } = useTheme();
  const { isDesktopOrLaptop, isTablet, isLargeMobile, isMicroScreen } =
    useResponsive();

  const deviceType = useMemo(
    () =>
      getDeviceTypeFromResponsive({
        isDesktopOrLaptop,
        isTablet,
        isLargeMobile,
        isMicroScreen,
      }),
    [isDesktopOrLaptop, isTablet, isLargeMobile, isMicroScreen],
  );

  const flattenedStyle = style ? { ...style } : {};
  const {
    effectiveFontSize,
    resolvedFamily,
    effectiveFontWeight,
    applyWeight,
  } = resolveEffectiveFont(flattenedStyle, size, fontFamily, fontWeight);
  const sanitized = sanitizeStyle(flattenedStyle);

  const adjustedFontSize = (() => {
    if (effectiveFontSize === null || effectiveFontSize === undefined) {
      return undefined;
    }
    return responsive
      ? getResponsiveFontSize(effectiveFontSize, deviceType)
      : effectiveFontSize;
  })();

  const combinedStyle = buildCombinedStyle(
    resolvedFamily,
    adjustedFontSize,
    color ?? themeColors.textPrimary,
    block,
    applyWeight,
    effectiveFontWeight,
    extraStyle,
    sanitized,
    numberOfLines,
  );

  return React.createElement(
    Component,
    {
      id,
      title,
      'aria-label': ariaLabel,
      className,
      style: combinedStyle,
      onClick: onClick || onPress,
      ...props,
    },
    resolveContent(children, text),
  );
};

export default RetaylText;

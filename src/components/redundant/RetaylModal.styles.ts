/**
 * RetaylModal Style Builders
 *
 * Individual style builders for RetaylModal and RetaylModalContent.
 * Each builder is small and focused to stay under max-lines-per-function.
 *
 * @module components/shared/RetaylModal.styles
 */

import {
  spacing,
  fontSize,
  radius,
  lineHeight,
  duration,
  easing,
  getBoxShadow,
} from '@retayl/utils';
import { FONTFAMILY } from '@retayl/fonts';

// =============================================================================
// TYPES
// =============================================================================

interface ModalColors {
  overlayDark: string;
  backgroundPrimary: string;
  backgroundSecondary: string;
  borderLight: string;
  textPrimary: string;
  textSecondary: string;
  textInverse: string;
  primary: string;
  error: string;
  successLight: string;
  errorLight: string;
  warningLight: string;
  infoLight: string;
}

// =============================================================================
// OVERLAY STYLES (used by RetaylModal)
// =============================================================================

/** Builds overlay styles for the modal backdrop */
export function buildOverlayStyles(params: {
  colors: Pick<ModalColors, 'overlayDark'>;
  zIndex: number;
  overlayStyle?: React.CSSProperties;
}): React.CSSProperties {
  return {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${spacing.lg}px`,
    backgroundColor: params.colors.overlayDark,
    zIndex: params.zIndex,
    ...params.overlayStyle,
  };
}

// =============================================================================
// MODAL CONTAINER STYLES (used by RetaylModal)
// =============================================================================

/** Builds the modal container (card) styles */
export function buildModalStyles(params: {
  colors: Pick<ModalColors, 'backgroundPrimary' | 'borderLight'>;
  modalWidth: number | string;
  height?: number | string;
  scrollable: boolean;
  animationStyles: React.CSSProperties;
  containerStyle?: React.CSSProperties;
}): React.CSSProperties {
  return {
    backgroundColor: params.colors.backgroundPrimary,
    borderRadius: `${radius.lg}px`,
    border: `1px solid ${params.colors.borderLight}`,
    width: params.modalWidth,
    maxWidth: '95vw',
    maxHeight: params.height ?? '90vh',
    overflow: params.scrollable ? 'auto' : 'hidden',
    position: 'relative',
    boxShadow: getBoxShadow('lg'),
    ...params.animationStyles,
    ...params.containerStyle,
  };
}

// =============================================================================
// CONTENT WRAPPER STYLES (used by RetaylModalContent)
// =============================================================================

/** Builds the inner content wrapper styles */
export function buildContentWrapperStyles(params: {
  isCentered: boolean;
  contentStyle?: React.CSSProperties;
}): React.CSSProperties {
  return {
    padding: `${spacing.xl}px`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: params.isCentered ? 'center' : 'stretch',
    gap: `${spacing.md}px`,
    ...params.contentStyle,
  };
}

// =============================================================================
// HEADER STYLES (used by RetaylModalContent)
// =============================================================================

/** Builds header layout styles */
export function buildHeaderStyles(params: {
  useRowHeader: boolean;
  isCentered: boolean;
}): React.CSSProperties {
  if (params.useRowHeader) {
    return {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: `${spacing.md}px`,
    };
  }
  return {
    display: 'flex',
    flexDirection: 'column',
    alignItems: params.isCentered ? 'center' : 'flex-start',
    gap: `${spacing.sm}px`,
  };
}

// =============================================================================
// CLOSE BUTTON STYLES (used by RetaylModalContent)
// =============================================================================

/** Builds close button styles */
export function buildCloseButtonStyles(): React.CSSProperties {
  return {
    position: 'absolute',
    top: `${spacing.md}px`,
    right: `${spacing.md}px`,
    cursor: 'pointer',
    padding: `${spacing.xs}px`,
    borderRadius: `${radius.sm}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: `background-color ${duration.fast}ms ${easing.standard}`,
    backgroundColor: 'transparent',
    border: 'none',
  };
}
// =============================================================================
// ICON CONTAINER STYLES (used by RetaylModalContent)
// =============================================================================

/** Variant-to-background color map for icon containers */
const VARIANT_ICON_BG_KEYS: Record<string, keyof ModalColors> = {
  success: 'successLight',
  error: 'errorLight',
  confirmation: 'errorLight',
  warning: 'warningLight',
  info: 'infoLight',
};

/** Builds icon container styles based on variant */
export function buildIconContainerStyles(params: {
  colors: Pick<
    ModalColors,
    | 'backgroundSecondary'
    | 'successLight'
    | 'errorLight'
    | 'warningLight'
    | 'infoLight'
  >;
  variant: string;
}): React.CSSProperties {
  const bgKey = VARIANT_ICON_BG_KEYS[params.variant];
  const bg = bgKey
    ? params.colors[bgKey as keyof typeof params.colors]
    : params.colors.backgroundSecondary;

  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    borderRadius: '50%',
    backgroundColor: bg,
    flexShrink: 0,
  };
}

// =============================================================================
// BUTTON CONTAINER STYLES (used by RetaylModalContent)
// =============================================================================

/** Justify-content map for button layouts */
const BUTTON_JUSTIFY_MAP: Record<string, string> = {
  split: 'space-between',
  center: 'center',
};

/** Builds button container styles */
export function buildButtonContainerStyles(params: {
  buttonLayout: string;
  hasButtons: boolean;
}): React.CSSProperties {
  if (!params.hasButtons) return { display: 'none' };
  return {
    display: 'flex',
    flexDirection: params.buttonLayout === 'column' ? 'column' : 'row',
    gap: `${spacing.sm}px`,
    justifyContent: BUTTON_JUSTIFY_MAP[params.buttonLayout] || 'flex-end',
  };
}

// =============================================================================
// TYPOGRAPHY STYLES (used by RetaylModalContent)
// =============================================================================

/** Builds title text styles */
export function buildTitleStyles(
  colors: Pick<ModalColors, 'textPrimary'>,
): React.CSSProperties {
  return {
    fontSize: `${fontSize.xl}px`,
    fontFamily: FONTFAMILY.semibold,
    color: colors.textPrimary,
    lineHeight: lineHeight.snug,
    margin: 0,
  };
}

/** Builds subtitle text styles */
export function buildSubtitleStyles(
  colors: Pick<ModalColors, 'textSecondary'>,
): React.CSSProperties {
  return {
    fontSize: `${fontSize.sm}px`,
    fontFamily: FONTFAMILY.regular,
    color: colors.textSecondary,
    lineHeight: lineHeight.normal,
    margin: 0,
  };
}

/** Builds message text styles */
export function buildMessageStyles(params: {
  colors: Pick<ModalColors, 'textSecondary'>;
  isCentered: boolean;
}): React.CSSProperties {
  return {
    fontSize: `${fontSize.md}px`,
    fontFamily: FONTFAMILY.regular,
    color: params.colors.textSecondary,
    lineHeight: lineHeight.normal,
    textAlign: params.isCentered ? 'center' : 'left',
  };
}

// =============================================================================
// BUTTON VARIANT COLORS (used by RetaylModalContent)
// =============================================================================

/** Builds the variant-to-color map for modal buttons */
export function buildButtonVariantColors(
  colors: Pick<
    ModalColors,
    | 'primary'
    | 'textInverse'
    | 'backgroundSecondary'
    | 'textPrimary'
    | 'error'
    | 'textSecondary'
  >,
): Record<string, { bg: string; text: string }> {
  return {
    primary: { bg: colors.primary, text: colors.textInverse },
    secondary: { bg: colors.backgroundSecondary, text: colors.textPrimary },
    danger: { bg: colors.error, text: colors.textInverse },
    ghost: { bg: 'transparent', text: colors.textSecondary },
  };
}

/** Static icon font size style */
export const iconFontSizeStyle: React.CSSProperties = {
  fontSize: `${fontSize['2xl']}px`,
};

// =============================================================================
// ANIMATION STYLES (used by RetaylModal)
// =============================================================================

/** Builds animation styles based on animation type and state */
export function buildAnimationStyles(
  animationType: string,
  animationDuration: string,
  isAnimating: boolean,
): React.CSSProperties {
  const durationMs = duration[animationDuration as keyof typeof duration];
  const baseTransition = `all ${durationMs}ms ${easing.standard}`;

  switch (animationType) {
    case 'fade':
      return { transition: baseTransition, opacity: isAnimating ? 1 : 0 };
    case 'slide':
      return {
        transition: baseTransition,
        transform: isAnimating
          ? 'scale(1) translateY(0)'
          : 'scale(0.95) translateY(-10px)',
        opacity: isAnimating ? 1 : 0,
      };
    case 'scale':
      return {
        transition: baseTransition,
        transform: isAnimating ? 'scale(1)' : 'scale(0.95)',
        opacity: isAnimating ? 1 : 0,
      };
    default:
      return {};
  }
}

import { useCallback, useMemo } from 'react';
import { type StyleProp, type PressableStateCallbackType } from 'react-native';
import { useTheme } from '@retayl/hooks';
import { getVariantStyles, BUTTON_DEFAULTS } from './RetaylButton.helpers';
import type { ExtendedViewStyle } from './RetaylButton';

type HoverablePressableState = PressableStateCallbackType & {
  hovered?: boolean;
};

interface StyleParams {
  variant: 'primary' | 'secondary' | 'tertiary';
  effectiveBgColor: string;
  buttonTextColor?: string;
  borderColor?: string;
  borderWidth: number;
  borderRadius: number;
  effectiveHeight: number;
  hPadding: number;
  vPadding: number;
  width: number | string;
  disabled: boolean;
  loading: boolean;
  buttonStyle?: StyleProp<ExtendedViewStyle>;
  hoverStyle?: StyleProp<ExtendedViewStyle>;
  pressedStyle?: StyleProp<ExtendedViewStyle>;
  disabledStyle?: StyleProp<ExtendedViewStyle>;
  buttonStyles: {
    button: Record<string, unknown>;
    buttonWithShadow: Record<string, unknown>;
  };
}

/** Resolves width value to a React Native compatible format. */
const resolveWidth = (
  width: number | string,
): number | `${number}%` | undefined => {
  if (typeof width === 'number') return width;
  if (typeof width === 'string' && width.endsWith('px')) {
    const num = Number(width.replace('px', ''));
    return Number.isNaN(num) ? undefined : num;
  }
  if (typeof width === 'string' && width.endsWith('%')) {
    const num = Number(width.replace('%', ''));
    return Number.isNaN(num) ? undefined : `${num}%`;
  }
  return undefined;
};

/** Resolves base background color based on state. */
const resolveBaseBgColor = (
  disabled: boolean,
  themeColors: Record<string, string>,
  variantStyles: { borderColor?: string; bgColor: string },
): string => {
  if (disabled) return themeColors.disabledBackground;
  if (variantStyles.borderColor) return themeColors.backgroundPrimary;
  return variantStyles.bgColor;
};

/** Returns hover styles for a given variant. */
const getHoverStyles = (
  hoverVariant: string,
  themeColors: Record<string, string>,
): ExtendedViewStyle => {
  const hoverBase: ExtendedViewStyle = { transform: [{ translateY: -1 }] };
  if (hoverVariant === 'secondary') {
    hoverBase.backgroundColor = themeColors.backgroundSecondary;
    hoverBase.borderColor = themeColors.primary;
  }
  if (hoverVariant === 'tertiary') {
    hoverBase.backgroundColor = themeColors.backgroundTertiary;
    hoverBase.transform = undefined;
  }
  return hoverBase;
};

/**
 * Resolves button styles based on variant, state, and theme
 */
const useRetaylButtonStyles = (params: StyleParams) => {
  const { colors: themeColors } = useTheme();

  const variantStyles = useMemo(
    () =>
      getVariantStyles({
        variant: params.variant,
        effectiveBgColor: params.effectiveBgColor,
        buttonTextColor: params.buttonTextColor,
        borderColor: params.borderColor,
        borderWidth: params.borderWidth,
        borderRadius: params.borderRadius,
        themeColors,
      }),
    [
      params.variant,
      params.effectiveBgColor,
      params.buttonTextColor,
      params.borderColor,
      params.borderWidth,
      params.borderRadius,
      themeColors,
    ],
  );

  const resolvedWidth = useMemo(
    () => resolveWidth(params.width),
    [params.width],
  );

  const resolveButtonStyle = useCallback(
    (state: PressableStateCallbackType): StyleProp<ExtendedViewStyle> => {
      const { hovered, pressed } = state as HoverablePressableState;
      const base: ExtendedViewStyle = {
        backgroundColor: resolveBaseBgColor(
          params.disabled,
          themeColors,
          variantStyles,
        ),
        height: params.effectiveHeight,
        minHeight: 44,
        paddingHorizontal: params.hPadding,
        paddingVertical: params.vPadding,
        borderColor: params.disabled
          ? themeColors.disabledBorder
          : variantStyles.borderColor,
        borderWidth: variantStyles.borderWidth,
        width: resolvedWidth,
        borderRadius: variantStyles.borderRadius,
        transition: 'all 0.2s ease-in-out',
        opacity:
          pressed || params.loading ? BUTTON_DEFAULTS.PRESSED_OPACITY : 1,
      };
      const resolved: StyleProp<ExtendedViewStyle>[] = [
        params.buttonStyles.button,
        base,
      ];
      if (params.variant === 'primary')
        resolved.push(params.buttonStyles.buttonWithShadow);
      if (params.disabled && params.disabledStyle)
        resolved.push(params.disabledStyle);
      if (!!hovered && !params.disabled && !params.loading) {
        resolved.push(getHoverStyles(params.variant, themeColors));
        if (params.hoverStyle) resolved.push(params.hoverStyle);
      }
      if (pressed && params.pressedStyle) resolved.push(params.pressedStyle);
      if (params.buttonStyle) resolved.push(params.buttonStyle);
      return resolved as unknown as StyleProp<ExtendedViewStyle>;
    },
    [resolvedWidth, params, themeColors, variantStyles],
  );

  const getInteractiveColor = useCallback(
    (hovered: boolean | undefined): string => {
      if (params.disabled) return themeColors.textDisabled;
      if (hovered && params.variant === 'secondary') return themeColors.primary;
      return variantStyles.textColor;
    },
    [params.disabled, params.variant, themeColors, variantStyles.textColor],
  );

  return { resolveButtonStyle, getInteractiveColor, variantStyles };
};

export default useRetaylButtonStyles;

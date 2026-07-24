import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Pressable, type ViewStyle } from 'react-native';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { removeToast, Toast } from '@retayl/redux';
import RetaylText from './RetaylText';
import { useTheme } from '@retayl/hooks';
import {
  fontSize,
  radius,
  spacing,
  NUMERIC_CONSTANTS,
  zIndex,
} from '@retayl/utils';
import { FONTFAMILY } from '@retayl/fonts';

const { GRID_COLUMNS_4 } = NUMERIC_CONSTANTS;

// Toast constants
const TOAST_CONSTANTS = {
  DEFAULT_DURATION: NUMERIC_CONSTANTS.LONG_TIMEOUT,
  MOBILE_BOTTOM_OFFSET: spacing.md, // 24px above safe area
  DESKTOP_TOP_OFFSET: spacing.sm, // 16px from top
  DESKTOP_RIGHT_OFFSET: spacing.sm, // 16px from right
  MOBILE_HORIZONTAL_PADDING: spacing.sm, // 16px horizontal padding for centering
  Z_INDEX: zIndex.toast,
  MAX_WIDTH_DESKTOP: 320, // 320px on desktop
  MOBILE_WIDTH_PERCENT: 0.9, // 90% viewport width on mobile
  MOBILE_BREAKPOINT: NUMERIC_CONSTANTS.MOBILE_BREAKPOINT, // 768px
  PADDING: spacing.sm,
  SHADOW_OFFSET: {
    width: 0,
    height: spacing.xs / GRID_COLUMNS_4,
  },
  SHADOW_OPACITY: 0.1,
  SHADOW_RADIUS: 4,
  ELEVATION: 3,
  GAP: spacing.xs,
  CLOSE_BUTTON_PADDING: spacing.xs / GRID_COLUMNS_4,
} as const;

const ToastItem: React.FC<{ toast: Toast }> = ({ toast }) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile on mount and window resize
    const checkMobile = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < TOAST_CONSTANTS.MOBILE_BREAKPOINT);
      }
    };

    checkMobile();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  const styles = createToastStyles(colors, isMobile);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(removeToast(toast.id));
    }, toast.duration || TOAST_CONSTANTS.DEFAULT_DURATION);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, dispatch]);

  const getToastStyle = () => {
    switch (toast.type) {
      case 'error':
        return {
          backgroundColor: colors.errorLight,
          borderColor: colors.error,
        };
      case 'success':
        return {
          backgroundColor: colors.successLight,
          borderColor: colors.success,
        };
      case 'warning':
        return {
          backgroundColor: colors.warningLight,
          borderColor: colors.warning,
        };
      case 'info':
        return { backgroundColor: colors.infoLight, borderColor: colors.info };
      default:
        return {
          backgroundColor: colors.backgroundSecondary,
          borderColor: colors.borderLight,
        };
    }
  };

  const getTextColor = () => {
    switch (toast.type) {
      case 'error':
        return colors.error;
      case 'success':
        return colors.successDark;
      case 'warning':
        return colors.warningDark;
      case 'info':
        return colors.infoDark;
      default:
        return colors.textPrimary;
    }
  };

  return (
    <Pressable
      style={[styles.toast, getToastStyle()]}
      onPress={() => dispatch(removeToast(toast.id))}
    >
      <RetaylText
        text={toast.message}
        style={
          {
            ...styles.toastText,
            color: getTextColor() as string,
          } as React.CSSProperties
        }
      />
      <Pressable
        style={styles.closeButton}
        onPress={() => dispatch(removeToast(toast.id))}
      >
        <RetaylText
          text='×'
          style={
            {
              ...styles.closeText,
              color: getTextColor() as string,
            } as React.CSSProperties
          }
        />
      </Pressable>
    </Pressable>
  );
};

type ToastSliceState = {
  toast?: {
    toasts?: Toast[];
  };
};

const EMPTY_TOAST_LIST: Toast[] = [];

export const ToastContainer: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile on mount and window resize
    const checkMobile = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < TOAST_CONSTANTS.MOBILE_BREAKPOINT);
      }
    };

    checkMobile();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  const styles = createContainerStyles(isMobile);
  const toasts = useSelector<ToastSliceState, Toast[]>((state) => {
    const slice = state.toast;
    if (!slice || !Array.isArray(slice.toasts) || slice.toasts.length === 0) {
      return EMPTY_TOAST_LIST;
    }

    return slice.toasts;
  }, shallowEqual);

  if (toasts.length === 0) return null;

  return (
    <View style={styles.container}>
      {toasts.map((toast: Toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </View>
  );
};

/** ViewStyle extended with web-only CSS position values (e.g. 'fixed') */
type WebViewStyle = Omit<ViewStyle, 'position'> & {
  position?: ViewStyle['position'] | 'fixed' | 'sticky';
};

const createContainerStyles = (isMobile: boolean) => {
  const container: WebViewStyle = {
    position: 'fixed',
    ...(isMobile
      ? {
          // Mobile: bottom center above safe area
          bottom: TOAST_CONSTANTS.MOBILE_BOTTOM_OFFSET,
          left: TOAST_CONSTANTS.MOBILE_HORIZONTAL_PADDING,
          right: TOAST_CONSTANTS.MOBILE_HORIZONTAL_PADDING,
          alignItems: 'center' as const,
        }
      : {
          // Desktop: top-right corner
          top: TOAST_CONSTANTS.DESKTOP_TOP_OFFSET,
          right: TOAST_CONSTANTS.DESKTOP_RIGHT_OFFSET,
          alignItems: 'flex-end' as const,
        }),
    zIndex: TOAST_CONSTANTS.Z_INDEX,
    gap: TOAST_CONSTANTS.GAP,
  };

  return StyleSheet.create({ container: container as ViewStyle });
};

const createToastStyles = (
  colors: {
    black: string;
    backgroundPrimary: string;
    errorLight: string;
    error: string;
    successLight: string;
    success: string;
    warningLight: string;
    warning: string;
    infoLight: string;
    info: string;
    backgroundSecondary: string;
    borderLight: string;
    textPrimary: string;
    errorDark: string;
    successDark: string;
    warningDark: string;
    infoDark: string;
  },
  isMobile: boolean,
) =>
  StyleSheet.create({
    toast: {
      padding: TOAST_CONSTANTS.PADDING,
      borderRadius: radius.sm,
      borderWidth: 1,
      maxWidth: isMobile
        ? `${TOAST_CONSTANTS.MOBILE_WIDTH_PERCENT * 100}%`
        : TOAST_CONSTANTS.MAX_WIDTH_DESKTOP,
      width: isMobile
        ? `${TOAST_CONSTANTS.MOBILE_WIDTH_PERCENT * 100}%`
        : TOAST_CONSTANTS.MAX_WIDTH_DESKTOP,
      minWidth: isMobile ? undefined : TOAST_CONSTANTS.MAX_WIDTH_DESKTOP,
      shadowColor: colors.black,
      shadowOffset: TOAST_CONSTANTS.SHADOW_OFFSET,
      shadowOpacity: TOAST_CONSTANTS.SHADOW_OPACITY,
      shadowRadius: TOAST_CONSTANTS.SHADOW_RADIUS,
      elevation: TOAST_CONSTANTS.ELEVATION,
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    },
    toastText: {
      fontSize: fontSize.sm,
      fontFamily: FONTFAMILY.regular,
      flex: 1,
      flexShrink: 1,
      flexWrap: 'wrap',
      marginRight: spacing.xs,
    },
    closeButton: {
      padding: TOAST_CONSTANTS.CLOSE_BUTTON_PADDING,
    },
    closeText: {
      fontSize: fontSize.lg,
      fontFamily: FONTFAMILY.medium,
    },
  });

export default ToastContainer;

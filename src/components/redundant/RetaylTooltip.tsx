/**
 * RetaylTooltip - Premium tooltip component
 *
 * A minimal, elegant tooltip inspired by Stripe, Linear, and Notion.
 * Uses ReactDOM.createPortal to render at body level for proper z-index.
 *
 * @module components/shared/RetaylTooltip
 */

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { createPortal } from 'react-dom';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { fontSize, radius, spacing, zIndex, fontWeight } from '@retayl/utils';
import { useTheme } from '@retayl/hooks';
import { Info } from 'lucide-react';
import { FONTFAMILY } from '@retayl/fonts';

// =============================================================================
// CONSTANTS
// =============================================================================

const TOOLTIP_MAX_WIDTH = 280;
const ARROW_SIZE = 6;
const TRIGGER_SIZE = 16;
const TOOLTIP_OFFSET = 8;

/** Fixed tooltip colors — always dark bg with light text regardless of theme */
const TOOLTIP_BG = '#141233';
const TOOLTIP_TEXT = '#FFFFFF';

// =============================================================================
// TYPES
// =============================================================================

interface RetaylTooltipProps {
  message?: string;
  title?: string;
  children?: React.ReactNode;
  accessibilityLabel?: string;
}

interface TooltipPosition {
  top: number;
  left: number;
  isAbove: boolean;
  triggerCenterX: number;
}

// =============================================================================
// TOOLTIP PORTAL (Web Only)
// =============================================================================

interface TooltipPortalProps {
  position: TooltipPosition;
  title?: string;
  message: string;
}

/** Injects keyframes once for tooltip animation */
function ensureKeyframes() {
  const styleId = 'retayl-tooltip-keyframes';
  if (typeof document === 'undefined' || document.getElementById(styleId))
    return;
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    @keyframes tooltipFadeIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
  `;
  document.head.appendChild(style);
}

/** Static content box styles (no theme dependency) */
const CONTENT_STYLE: React.CSSProperties = {
  backgroundColor: TOOLTIP_BG,
  borderRadius: radius.md,
  paddingLeft: spacing.sm,
  paddingRight: spacing.sm,
  paddingTop: spacing.xs + spacing.xxs,
  paddingBottom: spacing.xs + spacing.xxs,
  position: 'relative',
};

/** Static message text style */
const MESSAGE_STYLE: React.CSSProperties = {
  fontSize: fontSize.xs,
  fontWeight: fontWeight.regular,
  color: TOOLTIP_TEXT,
  fontFamily: FONTFAMILY.regular,
};

const TooltipPortal: React.FC<TooltipPortalProps> = ({
  position,
  title,
  message,
}) => {
  useEffect(ensureKeyframes, []);

  const clampedLeft = Math.max(spacing.sm, position.left);
  const arrowLeft = Math.max(
    ARROW_SIZE,
    Math.min(
      position.triggerCenterX - clampedLeft,
      TOOLTIP_MAX_WIDTH - ARROW_SIZE,
    ),
  );

  const tooltipStyle = useMemo<React.CSSProperties>(
    () => ({
      position: 'fixed',
      top: position.isAbove ? 'auto' : position.top,
      bottom: position.isAbove ? window.innerHeight - position.top : 'auto',
      left: clampedLeft,
      maxWidth: TOOLTIP_MAX_WIDTH,
      zIndex: zIndex.tooltip,
      pointerEvents: 'none',
      animation: 'tooltipFadeIn 150ms ease-out forwards',
    }),
    [position.isAbove, position.top, clampedLeft],
  );

  const titleStyle = useMemo<React.CSSProperties>(
    () => ({
      fontSize: fontSize.xs,
      fontWeight: fontWeight.semiBold,
      color: TOOLTIP_TEXT,
      marginBottom: title ? spacing.xxs : 0,
      fontFamily: FONTFAMILY.semibold,
    }),
    [title],
  );

  const arrowStyle = useMemo<React.CSSProperties>(
    () => ({
      position: 'absolute',
      left: arrowLeft,
      marginLeft: -ARROW_SIZE,
      width: 0,
      height: 0,
      borderStyle: 'solid',
      ...(position.isAbove
        ? {
            bottom: -ARROW_SIZE,
            borderWidth: `${ARROW_SIZE}px ${ARROW_SIZE}px 0 ${ARROW_SIZE}px`,
            borderColor: `${TOOLTIP_BG} transparent transparent transparent`,
          }
        : {
            top: -ARROW_SIZE,
            borderWidth: `0 ${ARROW_SIZE}px ${ARROW_SIZE}px ${ARROW_SIZE}px`,
            borderColor: `transparent transparent ${TOOLTIP_BG} transparent`,
          }),
    }),
    [arrowLeft, position.isAbove],
  );

  return createPortal(
    <div style={tooltipStyle} role='tooltip'>
      <div style={CONTENT_STYLE}>
        {title ? <div style={titleStyle}>{title}</div> : null}
        <div style={MESSAGE_STYLE}>{message}</div>
        <div style={arrowStyle} />
      </div>
    </div>,
    document.body,
  );
};

// =============================================================================
// WEB TRIGGER — extracted to reduce main component lines
// =============================================================================

const INLINE_FLEX_STYLE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
};
const FLEX_STYLE = { display: 'flex' as unknown as undefined };

interface WebTriggerProps {
  triggerRef: React.RefObject<HTMLDivElement | null>;
  triggerElement: React.ReactNode;
  hasTriggerChildren: boolean;
  isHovered: boolean;
  ariaLabel: string;
  message: string;
  styles: { trigger: object; triggerHover: object };
  onPress: () => void;
  onHoverEnter: () => void;
  onHoverLeave: () => void;
}

/** Web-specific trigger wrapper with hover and press handling */
const WebTrigger: React.FC<WebTriggerProps> = ({
  triggerRef,
  triggerElement,
  hasTriggerChildren,
  isHovered,
  ariaLabel,
  message,
  styles,
  onPress,
  onHoverEnter,
  onHoverLeave,
}) => {
  const pressableStyle = useCallback(
    ({ pressed }: { pressed: boolean }) => [
      styles.trigger,
      (pressed || isHovered) && styles.triggerHover,
    ],
    [styles, isHovered],
  );

  return (
    <div
      ref={triggerRef}
      style={INLINE_FLEX_STYLE}
      onMouseEnter={onHoverEnter}
      onMouseLeave={onHoverLeave}
    >
      {hasTriggerChildren ? (
        <Pressable
          onPress={onPress}
          accessibilityRole='button'
          accessibilityLabel={ariaLabel}
          accessibilityHint={message}
          style={FLEX_STYLE}
        >
          {triggerElement}
        </Pressable>
      ) : (
        <Pressable
          style={pressableStyle}
          onPress={onPress}
          accessibilityRole='button'
          accessibilityLabel={ariaLabel}
          accessibilityHint={message}
        >
          {triggerElement}
        </Pressable>
      )}
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/** Manages tooltip visibility, position, hover state, and styles */
function useTooltipState(colors: { backgroundTertiary: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<TooltipPosition | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible || Platform.OS !== 'web') return;
    const element = triggerRef.current;
    if (!element?.getBoundingClientRect) return;

    const rect = element.getBoundingClientRect();
    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;
    const isAbove = spaceAbove > spaceBelow && spaceAbove > 100;
    const triggerCenterX = rect.left + rect.width / 2;

    setPosition({
      top: isAbove ? rect.top - TOOLTIP_OFFSET : rect.bottom + TOOLTIP_OFFSET,
      left: triggerCenterX - TOOLTIP_MAX_WIDTH / 2,
      isAbove,
      triggerCenterX,
    });
  }, [isVisible]);

  const handlePress = useCallback(() => setIsVisible((prev) => !prev), []);

  const handleHoverEnter = useCallback(() => {
    setIsHovered(true);
    setIsVisible(true);
  }, []);

  const handleHoverLeave = useCallback(() => {
    setIsHovered(false);
    setIsVisible(false);
  }, []);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        trigger: { padding: spacing.xxs, borderRadius: radius.full },
        triggerHover: { backgroundColor: colors.backgroundTertiary },
      }),
    [colors.backgroundTertiary],
  );

  const nativePressableStyle = useCallback(
    ({ pressed }: { pressed: boolean }) => [
      styles.trigger,
      pressed && styles.triggerHover,
    ],
    [styles],
  );

  return {
    triggerRef,
    isHovered,
    isVisible,
    position,
    styles,
    nativePressableStyle,
    handlePress,
    handleHoverEnter,
    handleHoverLeave,
  };
}

const RetaylTooltip: React.FC<RetaylTooltipProps> = ({
  message,
  title,
  children,
  accessibilityLabel,
}) => {
  const { colors } = useTheme();
  const tooltip = useTooltipState(colors);
  const ariaLabel = accessibilityLabel ?? title ?? 'More information';

  if (!message) {
    return children ? <>{children}</> : null;
  }

  const triggerElement = children ?? (
    <Info
      width={TRIGGER_SIZE}
      height={TRIGGER_SIZE}
      color={colors.textTertiary}
    />
  );

  if (Platform.OS === 'web') {
    return (
      <>
        <WebTrigger
          triggerRef={tooltip.triggerRef}
          triggerElement={triggerElement}
          hasTriggerChildren={Boolean(children)}
          isHovered={tooltip.isHovered}
          ariaLabel={ariaLabel}
          message={message}
          styles={tooltip.styles}
          onPress={tooltip.handlePress}
          onHoverEnter={tooltip.handleHoverEnter}
          onHoverLeave={tooltip.handleHoverLeave}
        />
        {tooltip.isVisible && tooltip.position ? (
          <TooltipPortal
            position={tooltip.position}
            title={title}
            message={message}
          />
        ) : null}
      </>
    );
  }

  return (
    <View>
      <Pressable
        style={tooltip.nativePressableStyle}
        onPress={tooltip.handlePress}
        accessibilityRole='button'
        accessibilityLabel={ariaLabel}
        accessibilityHint={message}
      >
        {triggerElement}
      </Pressable>
    </View>
  );
};

export default RetaylTooltip;

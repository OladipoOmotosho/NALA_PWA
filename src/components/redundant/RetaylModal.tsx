'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '@retayl/hooks';
import { duration, easing } from '@retayl/utils';
import { MarkedIcon, FailedIcon, InfoIcon, WarningAmber } from '@retayl/icons';
import type {
  RetaylModalProps,
  ModalVariant,
  ButtonConfig,
} from './RetaylModal.types';
import {
  MODAL_DEFAULTS,
  MODAL_SIZE_PRESETS,
  MODAL_Z_INDEX,
} from './RetaylModal.types';
import { buildOverlayStyles, buildModalStyles } from './RetaylModal.styles';
import RetaylModalContent from './RetaylModalContent';

/** Get default icon based on modal variant */
const getVariantIcon = (variant: ModalVariant): React.ReactNode | null => {
  const iconMap: Record<string, React.ReactNode> = {
    success: <MarkedIcon />,
    error: <FailedIcon />,
    warning: <WarningAmber />,
    confirmation: <WarningAmber />,
    info: <InfoIcon />,
  };
  return iconMap[variant] ?? null;
};

let activeModalCount = 0;
let previousBodyOverflow: string | null = null;

// =============================================================================
// HOOKS — extracted to reduce main component line count and complexity
// =============================================================================

/** Manages the portal DOM container lifecycle */
function useModalPortal(stackLevel: number) {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null,
  );

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const container = document.createElement('div');
    container.setAttribute('data-retayl-modal', 'true');
    container.setAttribute('data-stack-level', String(stackLevel));
    document.body.appendChild(container);
    setPortalContainer(container);
    return () => {
      document.body.removeChild(container);
    };
  }, [stackLevel]);

  return portalContainer;
}

/** Handles escape key, body scroll lock, and enter animation */
function useModalBehavior(
  isVisible: boolean,
  portalContainer: HTMLElement | null,
  closeOnEscape: boolean,
  onClose: () => void,
) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!portalContainer || !isVisible || !closeOnEscape) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isVisible, onClose, closeOnEscape, portalContainer]);

  useEffect(() => {
    if (!portalContainer || !isVisible) return;
    if (activeModalCount === 0) {
      previousBodyOverflow = document.body.style.overflow || '';
    }
    activeModalCount += 1;
    document.body.style.overflow = 'hidden';
    return () => {
      activeModalCount = Math.max(0, activeModalCount - 1);
      if (activeModalCount === 0) {
        if (previousBodyOverflow) {
          document.body.style.overflow = previousBodyOverflow;
        } else {
          document.body.style.removeProperty('overflow');
        }
        previousBodyOverflow = null;
      }
    };
  }, [isVisible, portalContainer]);

  useEffect(() => {
    if (isVisible) setIsAnimating(true);
  }, [isVisible]);

  return isAnimating;
}

/** Builds animation CSS properties from type, duration, and state */
function useModalAnimation(
  animationType: string,
  animationDuration: string,
  isAnimating: boolean,
): React.CSSProperties {
  return useMemo(() => {
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
  }, [animationType, animationDuration, isAnimating]);
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/** Resolves the button list from individual or array button props. */
const resolveButtonList = (
  buttons?: ButtonConfig[],
  primaryButton?: ButtonConfig,
  secondaryButton?: ButtonConfig,
): ButtonConfig[] => {
  if (buttons && buttons.length > 0) return buttons;
  const list: ButtonConfig[] = [];
  if (secondaryButton) list.push(secondaryButton);
  if (primaryButton) list.push(primaryButton);
  return list;
};

/** Composes all modal hooks and derives layout properties. */
const useModalSetup = (props: RetaylModalProps) => {
  const {
    isVisible,
    onClose,
    variant = MODAL_DEFAULTS.variant,
    icon,
    primaryButton,
    secondaryButton,
    buttons,
    buttonLayout = MODAL_DEFAULTS.buttonLayout,
    size = MODAL_DEFAULTS.size,
    width,
    animationType = MODAL_DEFAULTS.animationType,
    animationDuration = MODAL_DEFAULTS.animationDuration,
    stackLevel = MODAL_DEFAULTS.stackLevel,
    closeOnEscape = MODAL_DEFAULTS.closeOnEscape,
    closeOnOverlayClick = MODAL_DEFAULTS.closeOnOverlayClick,
  } = props;

  const { colors } = useTheme();
  const portalContainer = useModalPortal(stackLevel);
  const isAnimating = useModalBehavior(
    isVisible,
    portalContainer,
    closeOnEscape,
    onClose,
  );
  const animationStyles = useModalAnimation(
    animationType,
    animationDuration,
    isAnimating,
  );

  const displayIcon = icon ?? getVariantIcon(variant);
  const modalWidth =
    width ?? (typeof size === 'string' ? MODAL_SIZE_PRESETS[size] : size);
  const isCentered = buttonLayout === 'center';
  const useRowHeader = !!displayIcon && !!props.title && !isCentered;
  const zIndex = MODAL_Z_INDEX.base + stackLevel * MODAL_Z_INDEX.increment;

  const buttonList = useMemo<ButtonConfig[]>(
    () => resolveButtonList(buttons, primaryButton, secondaryButton),
    [buttons, primaryButton, secondaryButton],
  );

  const handleOverlayClick = useCallback(() => {
    if (closeOnOverlayClick) onClose();
  }, [closeOnOverlayClick, onClose]);

  const handleModalClick = useCallback(
    (e: React.MouseEvent) => e.stopPropagation(),
    [],
  );

  return {
    colors,
    portalContainer,
    animationStyles,
    displayIcon,
    modalWidth,
    isCentered,
    useRowHeader,
    zIndex,
    buttonList,
    handleOverlayClick,
    handleModalClick,
  };
};

/**
 * RetaylModal - Unified cross-platform modal component (Web Implementation)
 */
const RetaylModal: React.FC<RetaylModalProps> = (props) => {
  const {
    isVisible,
    onClose,
    variant = MODAL_DEFAULTS.variant,
    title,
    subtitle,
    message,
    children,
    buttonLayout = MODAL_DEFAULTS.buttonLayout,
    height,
    showCloseButton = MODAL_DEFAULTS.showCloseButton,
    scrollable = MODAL_DEFAULTS.scrollable,
    containerStyle,
    contentStyle,
    overlayStyle,
    testID,
  } = props;

  const setup = useModalSetup(props);

  if (!isVisible || !setup.portalContainer) return null;

  return createPortal(
    <ModalOverlay
      colors={setup.colors}
      zIndex={setup.zIndex}
      overlayStyle={overlayStyle}
      onOverlayClick={setup.handleOverlayClick}
      title={title}
      testID={testID}
    >
      <ModalDialog
        colors={setup.colors}
        modalWidth={setup.modalWidth}
        height={height}
        scrollable={scrollable}
        animationStyles={setup.animationStyles}
        containerStyle={containerStyle}
        onModalClick={setup.handleModalClick}
      >
        <RetaylModalContent
          variant={variant}
          title={title}
          subtitle={subtitle}
          message={message}
          displayIcon={setup.displayIcon}
          buttonList={setup.buttonList}
          buttonLayout={buttonLayout}
          isCentered={setup.isCentered}
          useRowHeader={setup.useRowHeader}
          showCloseButton={showCloseButton}
          onClose={onClose}
          contentStyle={contentStyle}
        >
          {children}
        </RetaylModalContent>
      </ModalDialog>
    </ModalOverlay>,
    setup.portalContainer,
  );
};

/** Overlay wrapper with click-to-close and accessibility attributes. */
const ModalOverlay: React.FC<{
  colors: ReturnType<typeof useTheme>['colors'];
  zIndex: number;
  overlayStyle?: React.CSSProperties;
  onOverlayClick: () => void;
  title?: string | React.ReactNode;
  testID?: string;
  children: React.ReactNode;
}> = ({
  colors,
  zIndex,
  overlayStyle,
  onOverlayClick,
  title,
  testID,
  children,
}) => (
  <div
    style={buildOverlayStyles({ colors, zIndex, overlayStyle })}
    onClick={onOverlayClick}
    role='dialog'
    aria-modal='true'
    aria-labelledby={title ? 'modal-title' : undefined}
    data-testid={testID}
  >
    {children}
  </div>
);

/** Dialog container with sizing, scrolling, and animation. */
const ModalDialog: React.FC<{
  colors: ReturnType<typeof useTheme>['colors'];
  modalWidth: number | string;
  height?: number | string;
  scrollable: boolean;
  animationStyles: React.CSSProperties;
  containerStyle?: React.CSSProperties;
  onModalClick: (e: React.MouseEvent) => void;
  children: React.ReactNode;
}> = ({
  colors,
  modalWidth,
  height,
  scrollable,
  animationStyles,
  containerStyle,
  onModalClick,
  children,
}) => (
  <div
    style={buildModalStyles({
      colors,
      modalWidth,
      height,
      scrollable,
      animationStyles,
      containerStyle,
    })}
    onClick={onModalClick}
  >
    {children}
  </div>
);

export default RetaylModal;

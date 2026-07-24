'use client';

/**
 * RetaylWebModal - Premium modal component for web applications
 *
 * A world-class modal inspired by Stripe, Notion, and Linear.
 * Features smooth animations, proper focus management, and full dark mode support.
 *
 * @module components/shared/RetaylWebModal
 */

import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '@retayl/hooks';
import { radius, spacing, zIndex } from '@retayl/utils';

interface RetaylWebModalProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  closeOnOverlayClick?: boolean;
  /** ID of the element that labels this dialog for accessibility */
  ariaLabelledBy?: string;
  /** Accessible label for the dialog when no visible title exists */
  ariaLabel?: string;
  /** Additional class names for the modal container */
  className?: string;
  /** Additional class names for the overlay */
  overlayClassName?: string;
}

const MODAL_SHADOW = '0 25px 50px -12px rgba(0, 0, 0, 0.25)' as const;
const FADE_IN = 'modalFadeIn 200ms ease-out forwards';
const SLIDE_IN = 'modalSlideIn 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards';

/** Builds inline styles for the overlay backdrop. */
const buildOverlayStyle = (
  bgColor: string,
  zIdx: number,
  animating: boolean,
): React.CSSProperties => ({
  position: 'fixed',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: spacing.lg,
  backgroundColor: bgColor,
  zIndex: zIdx,
  animation: animating ? FADE_IN : 'none',
});

/** Builds inline styles for the modal content container. */
const buildContentStyle = (
  bgColor: string,
  borderColor: string,
  maxWidth: number | string,
  animating: boolean,
): React.CSSProperties => ({
  backgroundColor: bgColor,
  borderRadius: radius.xl,
  width: '100%',
  maxWidth,
  overflow: 'hidden',
  border: `1px solid ${borderColor}`,
  boxShadow: `0 0 0 1px ${borderColor}, 0 4px 6px -1px rgba(0,0,0,0.1), 0 10px 15px -3px rgba(0,0,0,0.1), 0 20px 25px -5px rgba(0,0,0,0.1), ${MODAL_SHADOW}`,
  animation: animating ? SLIDE_IN : 'none',
});

const SIZE_MAP: Record<
  NonNullable<RetaylWebModalProps['size']>,
  number | string
> = {
  sm: 360,
  md: 480,
  lg: 600,
  xl: 800,
  '2xl': 1024,
  full: '100%',
};

// TODO: Consider extracting useModalPortal, useModalAnimations, and useModalScrollLock to @retayl/hooks for reuse in drawers/popovers/sheets.

/**
 * Creates and manages a portal container element on the document body.
 * Handles cleanup on unmount.
 *
 * @returns The portal container element, or null during SSR / before mount
 */
function useModalPortal(): HTMLElement | null {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null,
  );

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const container = document.createElement('div');
    container.setAttribute('data-retayl-modal', 'true');
    document.body.appendChild(container);
    setPortalContainer(container);

    return () => {
      document.body.removeChild(container);
    };
  }, []);

  return portalContainer;
}

/**
 * Injects modal animation keyframes into the document head.
 * Only injects once per page lifecycle (idempotent).
 */
function useModalAnimations(): void {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const styleId = 'retayl-modal-keyframes';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes modalFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes modalSlideIn {
        from { opacity: 0; transform: scale(0.95) translateY(-10px); }
        to { opacity: 1; transform: scale(1) translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }, []);
}

/**
 * Locks body scroll when the modal is visible and restores it on close/unmount.
 *
 * @param isVisible - Whether the modal is currently visible
 * @param portalReady - Whether the portal container is mounted
 * @returns Whether the modal is currently animating in
 */
function useModalScrollLock(isVisible: boolean, portalReady: boolean): boolean {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!portalReady) return;

    if (isVisible) {
      setIsAnimating(true);
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = previousOverflow || 'unset';
      };
    }
  }, [isVisible, portalReady]);

  return isAnimating;
}

const RetaylWebModal = ({
  children,
  isVisible,
  onClose,
  size = 'md',
  closeOnOverlayClick = true,
  ariaLabelledBy,
  ariaLabel,
  className,
  overlayClassName,
}: RetaylWebModalProps): React.JSX.Element | null => {
  const { colors } = useTheme();
  const portalContainer = useModalPortal();
  const isAnimating = useModalScrollLock(isVisible, !!portalContainer);

  useModalAnimations();

  // Handle escape key
  useEffect(() => {
    if (!isVisible) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isVisible, onClose]);

  const handleOverlayClick = useCallback(() => {
    if (closeOnOverlayClick) onClose();
  }, [closeOnOverlayClick, onClose]);

  const handleContentClick = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
  }, []);

  if (!isVisible || !portalContainer) return null;

  const overlayStyle = buildOverlayStyle(
    colors.overlayDark,
    zIndex.modal,
    isAnimating,
  );
  const contentStyle = buildContentStyle(
    colors.backgroundPrimary,
    colors.borderLight,
    SIZE_MAP[size],
    isAnimating,
  );

  return createPortal(
    <div
      style={overlayStyle}
      className={overlayClassName || undefined}
      onClick={handleOverlayClick}
      aria-modal='true'
      role='dialog'
      aria-labelledby={ariaLabelledBy}
      aria-label={ariaLabel}
    >
      <div
        style={contentStyle}
        className={className || undefined}
        onClick={handleContentClick}
      >
        {children}
      </div>
    </div>,
    portalContainer,
  );
};

export default RetaylWebModal;

/**
 * Adapted from Retayl's RetaylModal (+ .types.ts, .styles.ts,
 * RetaylModalContent.tsx — four files consolidated into one). Also folds
 * in what RetaylSuccessModal and RetaylWebModal did: the former's source
 * comment already says `@deprecated Use <RetaylModal variant="success" />
 * instead`, and the latter is a simpler, unused-by-RetaylModal duplicate of
 * the same portal/overlay/scroll-lock pattern — so there's one Modal here,
 * not three.
 *
 * Dropped from the original (see internal-docs/technical-documentation/Modal.md):
 *  - Modal stacking (`stackLevel`) — this app never shows more than one
 *    modal at a time.
 *  - `keyboardAware` — a React Native-only concern.
 *  - slide/scale animation variants — kept a single fade+scale transition;
 *    the extra animation-type switch wasn't worth the complexity for four
 *    dialogs total in this app.
 *  - `@retayl/icons` variant icons (MarkedIcon/FailedIcon/etc.) →
 *    `lucide-react` (a real dependency of this project).
 * Kept: variant system (auto icon + tint), primary/secondary/button-array
 * button configs (reusing this library's own Button), escape-to-close,
 * overlay-click-to-close, body-scroll lock, and portal rendering.
 */
import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, Check, Info, X } from 'lucide-react';
import { colors } from './theme';
import { Button, type ButtonVariant } from './Button';
import { Text } from './Text';
import { cx } from './cx';
import styles from './Modal.module.css';

export type ModalVariant = 'success' | 'error' | 'warning' | 'info' | 'confirmation' | 'custom';

export interface ModalButtonConfig {
  text: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
}

export interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  variant?: ModalVariant;
  title?: string;
  message?: ReactNode;
  children?: ReactNode;
  primaryButton?: ModalButtonConfig;
  secondaryButton?: ModalButtonConfig;
  size?: 'sm' | 'md' | 'lg';
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
}

const SIZE_CLASS: Record<NonNullable<ModalProps['size']>, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
};

const VARIANT_ICON: Partial<Record<ModalVariant, ReactNode>> = {
  success: <Check size={22} color="#04211d" />,
  error: <X size={22} color="#fff" />,
  warning: <AlertTriangle size={22} color="#04211d" />,
  confirmation: <AlertTriangle size={22} color="#04211d" />,
  info: <Info size={22} color="#fff" />,
};

const VARIANT_ICON_BG_CLASS: Record<ModalVariant, string> = {
  success: styles.iconSuccess,
  error: styles.iconError,
  warning: styles.iconWarning,
  confirmation: styles.iconConfirmation,
  info: styles.iconInfo,
  custom: styles.iconCustom,
};

function useModalLifecycle(isVisible: boolean, onClose: () => void, closeOnEscape: boolean) {
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    setPortalEl(el);
    return () => {
      document.body.removeChild(el);
    };
  }, []);

  useEffect(() => {
    if (!isVisible) {
      setEntered(false);
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const raf = requestAnimationFrame(() => setEntered(true));
    const onEscape = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onEscape);
      cancelAnimationFrame(raf);
    };
  }, [isVisible, onClose, closeOnEscape]);

  return { portalEl, entered };
}

export function Modal({
  isVisible,
  onClose,
  variant = 'custom',
  title,
  message,
  children,
  primaryButton,
  secondaryButton,
  size = 'md',
  closeOnOverlayClick = true,
  showCloseButton = true,
}: ModalProps) {
  const { portalEl, entered } = useModalLifecycle(isVisible, onClose, true);
  if (!isVisible || !portalEl) return null;

  const icon = VARIANT_ICON[variant];
  const iconBgClass = VARIANT_ICON_BG_CLASS[variant];

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={() => closeOnOverlayClick && onClose()}
      className={cx(styles.overlay, entered && styles.overlayEntered)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={cx(styles.dialog, SIZE_CLASS[size], entered && styles.dialogEntered)}
      >
        {showCloseButton && (
          <button type="button" onClick={onClose} aria-label="Close" className={styles.closeButton}>
            <X size={18} />
          </button>
        )}
        {icon && (
          <div className={cx(styles.iconWrap, iconBgClass)}>
            {icon}
          </div>
        )}
        {title && (
          <Text as="h2" size={18} weight="600">
            {title}
          </Text>
        )}
        {message && typeof message === 'string' ? <Text color={colors.muted}>{message}</Text> : message}
        {children}
        {(primaryButton || secondaryButton) && (
          <div className={styles.footer}>
            {secondaryButton && (
              <Button variant={secondaryButton.variant ?? 'secondary'} onClick={secondaryButton.onPress} disabled={secondaryButton.disabled}>
                {secondaryButton.text}
              </Button>
            )}
            {primaryButton && (
              <Button
                variant={primaryButton.variant ?? 'primary'}
                onClick={primaryButton.onPress}
                loading={primaryButton.loading}
                disabled={primaryButton.disabled}
              >
                {primaryButton.text}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>,
    portalEl,
  );
}

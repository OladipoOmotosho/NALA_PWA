import type { ReactNode } from 'react';
import type { Duration } from '@retayl/utils';

// Platform-agnostic types
type DimensionValue = string | number;
type ViewStyle = Record<string, unknown>;

/**
 * Button configuration for modal actions
 */
export interface ButtonConfig {
  /** Button text label */
  text: string;
  /** Click/press handler */
  onPress: () => void;
  /** Button style variant */
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  /** Show loading spinner */
  loading?: boolean;
  /** Disable button interaction */
  disabled?: boolean;
  /** Custom button width */
  width?: DimensionValue;
  /** Optional icon to display with button */
  icon?: ReactNode;
  /** Test ID for automated testing */
  testID?: string;
}

/**
 * Modal variant types with semantic meaning
 */
export type ModalVariant =
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'confirmation'
  | 'custom';

/**
 * Modal size presets
 */
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'auto';

/**
 * Animation types supported by the modal
 */
export type AnimationType = 'fade' | 'slide' | 'scale' | 'none';

/**
 * Button layout options
 */
export type ButtonLayout = 'row' | 'column' | 'split' | 'center';

/**
 * Main RetaylModal props interface
 * Works across web and React Native platforms
 */
export interface RetaylModalProps {
  // ========== Core Props ==========
  /** Controls modal visibility */
  isVisible: boolean;
  /** Called when modal should close */
  onClose: () => void;

  // ========== Variant System ==========
  /** Modal variant - auto-styles icon and colors */
  variant?: ModalVariant;

  // ========== Content ==========
  /** Modal title (string or custom ReactNode) */
  title?: string | ReactNode;
  /** Subtitle text (smaller, secondary text) */
  subtitle?: string;
  /** Main message content (string or custom ReactNode) */
  message?: string | ReactNode;
  /** Icon to display (auto-selected per variant if not provided) */
  icon?: ReactNode | string;
  /** Custom children content */
  children?: ReactNode;

  // ========== Buttons ==========
  /** Primary action button (shorthand for single button) */
  primaryButton?: ButtonConfig;
  /** Secondary/cancel button (shorthand for cancel action) */
  secondaryButton?: ButtonConfig;
  /** Advanced: Array of buttons for complex cases (3+ buttons) */
  buttons?: ButtonConfig[];
  /** Layout direction for buttons */
  buttonLayout?: ButtonLayout;

  // ========== Sizing ==========
  /** Size preset for modal */
  size?: ModalSize;
  /** Custom width (overrides size preset) */
  width?: DimensionValue;
  /** Custom height (usually auto, but can override) */
  height?: DimensionValue;

  // ========== Animation ==========
  /** Animation type when modal appears/disappears */
  animationType?: AnimationType;
  /** Animation duration from design system tokens */
  animationDuration?: Duration;

  // ========== Stacking ==========
  /** Stack level for nested modals (auto-calculated, but can override) */
  stackLevel?: number;

  // ========== Behavior ==========
  /** Allow closing modal by clicking overlay/backdrop */
  closeOnOverlayClick?: boolean;
  /** Allow closing modal with ESC key (web only) */
  closeOnEscape?: boolean;
  /** Show X close button in top-right */
  showCloseButton?: boolean;
  /** Enable scrolling for long content */
  scrollable?: boolean;
  /** Enable keyboard avoiding view (native only) */
  keyboardAware?: boolean;

  // ========== Styling ==========
  /** Custom styles for modal container */
  containerStyle?: ViewStyle;
  /** Custom styles for modal content area */
  contentStyle?: ViewStyle;
  /** Custom styles for overlay/backdrop */
  overlayStyle?: ViewStyle;

  // ========== Testing ==========
  /** Test ID for automated testing */
  testID?: string;
}

/**
 * Default values for RetaylModal
 */
export const MODAL_DEFAULTS = {
  variant: 'custom' as ModalVariant,
  size: 'md' as ModalSize,
  animationType: 'fade' as AnimationType,
  animationDuration: 'slow' as Duration,
  closeOnOverlayClick: true,
  closeOnEscape: true,
  showCloseButton: true,
  scrollable: true,
  buttonLayout: 'row' as ButtonLayout,
  stackLevel: 0,
  keyboardAware: true,
} as const;

/**
 * Size preset values in pixels
 */
export const MODAL_SIZE_PRESETS = {
  sm: 420,
  md: 500,
  lg: 700,
  xl: 900,
  full: '90vw',
  auto: 'fit-content',
} as const;

/**
 * Z-index base values for modal stacking
 */
export const MODAL_Z_INDEX = {
  base: 1200,
  increment: 100,
} as const;

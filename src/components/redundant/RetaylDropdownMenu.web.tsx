/**
 * RetaylDropdownMenu - Web Version
 *
 * A portal-based dropdown menu for web that doesn't block page interaction.
 * Uses createPortal to render to document.body with proper z-index layering.
 *
 * Key differences from native version:
 * - Uses createPortal instead of Modal (non-blocking)
 * - Click outside and scroll to close
 * - Fixed positioning relative to viewport
 *
 * @module components/shared/RetaylDropdownMenu.web
 *
 * @example
 * ```tsx
 * const [menuOpen, setMenuOpen] = useState(false);
 * const [anchor, setAnchor] = useState(null);
 * const buttonRef = useRef<HTMLDivElement>(null);
 *
 * const handleOpen = () => {
 *   const rect = buttonRef.current?.getBoundingClientRect();
 *   setAnchor({ top: rect.top, left: rect.left, width: rect.width, height: rect.height });
 *   setMenuOpen(true);
 * };
 *
 * <div ref={buttonRef}>
 *   <button onClick={handleOpen}>Actions</button>
 * </div>
 *
 * <RetaylDropdownMenu
 *   visible={menuOpen}
 *   onClose={() => setMenuOpen(false)}
 *   anchorPosition={anchor}
 *   items={[
 *     { id: 'edit', label: 'Edit', onPress: () => handleEdit() },
 *     { id: 'delete', label: 'Delete', onPress: () => handleDelete() },
 *   ]}
 * />
 * ```
 */

import React, { ReactNode, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '@retayl/hooks';
import { spacing, radius, zIndex, fontSize, applyOpacity } from '@retayl/utils';
import { FONTFAMILY } from '@retayl/fonts';
import RetaylText from './RetaylText';

// =============================================================================
// TYPES (shared with native)
// =============================================================================

/**
 * Individual menu item configuration
 *
 * @property id - Unique identifier for the menu item
 * @property label - Display text for the item (used for accessibility)
 * @property onPress - Callback when item is clicked
 * @property icon - Optional icon/content to display (replaces label text if provided)
 * @property leftIcon - Optional icon on the left side
 * @property rightIcon - Optional icon on the right side
 * @property accessibilityLabel - Custom accessibility label
 * @property accessibilityHint - Accessibility hint for screen readers
 * @property disabled - Whether the item is disabled
 * @property isDivider - If true, renders as a visual divider line
 * @property customRender - Custom render function for complex items
 */
export interface DropdownMenuItem {
  id: string;
  label: string;
  onPress: () => void;
  icon?: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  disabled?: boolean;
  isDivider?: boolean;
  customRender?: (colors: ReturnType<typeof useTheme>['colors']) => ReactNode;
}

/**
 * Props for RetaylDropdownMenu component
 *
 * @property visible - Whether the menu is visible
 * @property onClose - Callback when menu should close (click outside, scroll, escape)
 * @property items - Array of menu items to display
 * @property anchorPosition - Position of the trigger element (from getBoundingClientRect)
 * @property width - Menu width in pixels (default: 240)
 * @property maxWidth - Maximum menu width
 * @property minWidth - Minimum menu width
 * @property position - Vertical position relative to anchor ('below' | 'above' | 'auto')
 * @property align - Horizontal alignment ('left' | 'right' | 'center')
 * @property offset - Offset from anchor position { x, y }
 * @property testID - Test ID for testing
 */
export interface RetaylDropdownMenuProps {
  visible: boolean;
  onClose: () => void;
  items: DropdownMenuItem[];
  anchorPosition: {
    top: number;
    left: number;
    width: number;
    height?: number;
  } | null;
  width?: number;
  maxWidth?: number;
  minWidth?: number;
  position?: 'below' | 'above' | 'auto';
  align?: 'left' | 'right' | 'center';
  offset?: { x?: number; y?: number };
  testID?: string;
}

// =============================================================================
// CONSTANTS (aligned with RetaylSelect styling)
// =============================================================================

const DEFAULT_WIDTH = 240;
const DEFAULT_OFFSET = 4;
const SCREEN_PADDING = 16;
const ESTIMATED_ITEM_HEIGHT = 40; // Approximate height for menu items
const TRANSITION_DURATION = '0.15s';

// Box shadow constants
const DROPDOWN_SHADOW_Y = 8;
const DROPDOWN_SHADOW_BLUR = 32;
const DROPDOWN_SHADOW_ALPHA = 0.12;

// Menu width constraints
const DROPDOWN_MIN_WIDTH = 180;
const DROPDOWN_MAX_WIDTH = 400;

// =============================================================================
// COMPONENT
// =============================================================================

export const RetaylDropdownMenu: React.FC<RetaylDropdownMenuProps> = ({
  visible,
  onClose,
  items,
  anchorPosition,
  width = DEFAULT_WIDTH,
  maxWidth,
  minWidth,
  position = 'below',
  align = 'left',
  offset = { x: 0, y: DEFAULT_OFFSET },
  testID = 'dropdown-menu',
}) => {
  const { colors } = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);

  // Calculate menu width
  const resolvedMinWidth = minWidth ?? DROPDOWN_MIN_WIDTH;
  const resolvedMaxWidth = maxWidth ?? DROPDOWN_MAX_WIDTH;

  let constrainedWidth = width;
  constrainedWidth = Math.max(constrainedWidth, resolvedMinWidth);
  constrainedWidth = Math.min(constrainedWidth, resolvedMaxWidth);
  const menuWidth = constrainedWidth;

  // Close on outside click
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    },
    [onClose],
  );

  // Close on scroll OUTSIDE the menu (not inside)
  const handleScroll = useCallback(
    (event: Event) => {
      // Don't close if scrolling inside the menu
      if (
        menuRef.current &&
        event.target instanceof Node &&
        menuRef.current.contains(event.target)
      ) {
        return;
      }
      onClose();
    },
    [onClose],
  );

  // Close on Escape key
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    },
    [onClose],
  );

  // Set up event listeners
  useEffect(() => {
    if (!visible) return;

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [visible, handleClickOutside, handleScroll, handleKeyDown]);

  if (!visible || !anchorPosition || typeof document === 'undefined') {
    return null;
  }

  // Calculate vertical position
  const calculateVerticalPosition = (): number => {
    const anchorBottom = anchorPosition.top + (anchorPosition.height || 0);
    const spaceBelow = window.innerHeight - anchorBottom;
    const estimatedMenuHeight = items.length * ESTIMATED_ITEM_HEIGHT;

    let finalPosition = position;
    if (position === 'auto') {
      finalPosition = spaceBelow >= estimatedMenuHeight ? 'below' : 'above';
    }

    if (finalPosition === 'below') {
      return anchorBottom + (offset.y || 0);
    }
    return anchorPosition.top - estimatedMenuHeight - (offset.y || 0);
  };

  // Calculate horizontal position
  const calculateHorizontalPosition = (): number => {
    const offsetX = offset.x || 0;

    let left = 0;
    switch (align) {
      case 'left':
        left = anchorPosition.left + offsetX;
        break;
      case 'right':
        left = anchorPosition.left + anchorPosition.width - menuWidth + offsetX;
        break;
      case 'center':
        left =
          anchorPosition.left +
          anchorPosition.width / 2 -
          menuWidth / 2 +
          offsetX;
        break;
    }

    // Ensure menu stays within screen bounds
    const maxLeft = window.innerWidth - menuWidth - SCREEN_PADDING;
    const minLeft = SCREEN_PADDING;
    return Math.max(minLeft, Math.min(left, maxLeft));
  };

  const menuTop = calculateVerticalPosition();
  const menuLeft = calculateHorizontalPosition();

  // Handle item click
  const handleItemPress = (item: DropdownMenuItem) => {
    if (item.disabled) return;
    onClose();
    // Small delay to ensure menu closes smoothly before action
    setTimeout(() => item.onPress(), 100);
  };

  // Styles (aligned with RetaylSelect dropdown styling)
  const menuStyle: React.CSSProperties = {
    position: 'fixed',
    top: menuTop,
    left: menuLeft,
    width: menuWidth,
    backgroundColor: colors.inputBackground as string,
    border: `1px solid ${colors.borderLight}`,
    borderRadius: radius.lg,
    boxShadow: `0 ${DROPDOWN_SHADOW_Y}px ${DROPDOWN_SHADOW_BLUR}px rgba(0, 0, 0, ${DROPDOWN_SHADOW_ALPHA})`,
    zIndex: zIndex.dropdown,
    overflow: 'hidden',
    minWidth: resolvedMinWidth,
    maxWidth: resolvedMaxWidth,
  };

  const menuItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    padding: `${spacing.xs}px ${spacing.sm}px`,
    cursor: 'pointer',
    transition: `background-color ${TRANSITION_DURATION} ease`,
    fontFamily: FONTFAMILY.regular,
    fontSize: fontSize.sm,
    color: colors.textPrimary as string,
  };

  const menuItemDisabledStyle: React.CSSProperties = {
    ...menuItemStyle,
    opacity: 0.4,
    cursor: 'not-allowed',
  };

  const dividerStyle: React.CSSProperties = {
    height: 1,
    backgroundColor: colors.borderLight as string,
    margin: `${spacing.xs / 2}px 0`,
  };

  // Render menu content
  const renderContent = () => {
    return items.map((item, index) => {
      // Divider
      if (item.isDivider) {
        return <div key={item.id || `divider-${index}`} style={dividerStyle} />;
      }

      // Custom render
      if (item.customRender) {
        return (
          <div
            key={item.id || `custom-${index}`}
            style={item.disabled ? menuItemDisabledStyle : menuItemStyle}
            onClick={() => !item.disabled && handleItemPress(item)}
            onMouseEnter={(e) => {
              if (!item.disabled) {
                e.currentTarget.style.backgroundColor = applyOpacity(
                  colors.primary,
                  'whisper',
                ) as string;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            role='menuitem'
            aria-label={item.accessibilityLabel || item.label}
            aria-disabled={item.disabled}
          >
            {item.customRender(colors)}
          </div>
        );
      }

      // Standard menu item
      return (
        <div
          key={item.id || `item-${index}`}
          style={item.disabled ? menuItemDisabledStyle : menuItemStyle}
          onClick={() => !item.disabled && handleItemPress(item)}
          onMouseEnter={(e) => {
            if (!item.disabled) {
              e.currentTarget.style.backgroundColor = applyOpacity(
                colors.primary,
                'whisper',
              ) as string;
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          role='menuitem'
          aria-label={item.accessibilityLabel || item.label}
          aria-disabled={item.disabled}
        >
          {item.leftIcon && (
            <div style={{ marginRight: spacing.xs }}>{item.leftIcon}</div>
          )}
          <div style={{ flex: 1 }}>
            {item.icon || (
              <RetaylText
                text={item.label}
                size={fontSize.sm}
                color={colors.textPrimary}
              />
            )}
          </div>
          {item.rightIcon && (
            <div style={{ marginLeft: spacing.xs }}>{item.rightIcon}</div>
          )}
        </div>
      );
    });
  };

  // Render via portal
  return createPortal(
    <div ref={menuRef} style={menuStyle} data-testid={testID} role='menu'>
      {renderContent()}
    </div>,
    document.body,
  );
};

export default RetaylDropdownMenu;

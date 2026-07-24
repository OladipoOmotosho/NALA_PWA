/**
 * RetaylMultiSelect Component
 *
 * A multi-select dropdown that displays selected items as chips.
 * Always shows placeholder in trigger - selected values shown as chips below.
 *
 * Features:
 * - Searchable dropdown with filtering
 * - Selected items displayed as removable chips
 * - Optional header with action (e.g., "Add new")
 * - Keyboard navigation and accessibility
 * - Dark mode compatible via semantic tokens
 *
 * @module components/shared/RetaylMultiSelect
 */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '@retayl/hooks';
import {
  radius,
  spacing,
  fontSize,
  getNextZIndex,
  applyOpacity,
} from '@retayl/utils';
import { FONTFAMILY } from '@retayl/fonts';
import { ChevronDown, Search, Plus, Check } from 'lucide-react';
import RetaylText from './RetaylText';
import { RetaylChip } from './RetaylChip';

// =============================================================================
// CONSTANTS
// =============================================================================

const DROPDOWN_OFFSET = spacing.xs;
const DEFAULT_DROPDOWN_HEIGHT = 300;
const DROPDOWN_PADDING = spacing.xs;
const ICON_SIZE = 16;
const Z_INDEX_STEP = 100;
const TRIGGER_HEIGHT = spacing.xl;
const SEARCH_THRESHOLD = 10;
const DISABLED_OPACITY = 0.6;
const STYLE_ID = 'retayl-multiselect-styles';
const SEARCH_INPUT_CLASS = 'retayl-multiselect-search';
const SEARCH_CONTAINER_HEIGHT = 56; // approximate height of search container with padding
const HEADER_HEIGHT = 40; // approximate height of header row

// =============================================================================
// TYPES
// =============================================================================

export interface MultiSelectItem {
  value: string;
  label: string;
}

export interface RetaylMultiSelectProps {
  /** Array of all available items */
  items: MultiSelectItem[];
  /** Array of selected values */
  selectedValues: string[];
  /** Callback when selection changes */
  onChange: (values: string[]) => void;
  /** Placeholder text for trigger */
  placeholder?: string;
  /** Field label */
  fieldLabel?: string;
  /** Whether field is required */
  required?: boolean;
  /** Whether field is disabled */
  disabled?: boolean;
  /** Error state */
  error?: boolean;
  /** Error message */
  errorMessage?: string;
  /** Enable search */
  searchable?: boolean;
  /** Search placeholder */
  searchPlaceholder?: string;
  /** Show header with action */
  hasHeader?: boolean;
  /** Header text */
  headerText?: string;
  /** Header click handler */
  onHeaderClick?: () => void;
  /** Loading state */
  isLoading?: boolean;
  /** Container width */
  width?: string | number;
  /** Whether to show selected items as chips below the trigger (default: false) */
  showChips?: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

export const RetaylMultiSelect: React.FC<RetaylMultiSelectProps> = ({
  items,
  selectedValues,
  onChange,
  placeholder = 'Select options',
  fieldLabel,
  required = false,
  disabled = false,
  error = false,
  errorMessage,
  searchable,
  searchPlaceholder = 'Search...',
  hasHeader = false,
  headerText = '',
  onHeaderClick,
  isLoading = false,
  width = '100%',
  showChips = false,
}) => {
  const { colors } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const shouldShowSearch = searchable ?? items.length > SEARCH_THRESHOLD;

  // Filter items based on search
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const query = searchQuery.toLowerCase();
    return items.filter((item) => item.label.toLowerCase().includes(query));
  }, [items, searchQuery]);

  // Get selected item objects
  const selectedItems = useMemo(() => {
    return selectedValues
      .map((value) => items.find((item) => item.value === value))
      .filter((item): item is MultiSelectItem => item !== undefined);
  }, [selectedValues, items]);

  // Update dropdown position
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + DROPDOWN_OFFSET,
      left: rect.left,
      width: rect.width,
    });
  }, []);

  // Handle open/close
  const openDropdown = useCallback(() => {
    if (disabled) return;
    updatePosition();
    setIsOpen(true);
  }, [disabled, updatePosition]);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setSearchQuery('');
  }, []);

  const toggleDropdown = useCallback(() => {
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  }, [isOpen, closeDropdown, openDropdown]);

  // Handle item selection (toggle)
  const handleItemClick = useCallback(
    (value: string) => {
      if (selectedValues.includes(value)) {
        onChange(selectedValues.filter((v) => v !== value));
      } else {
        onChange([...selectedValues, value]);
      }
    },
    [selectedValues, onChange],
  );

  // Handle chip removal
  const handleRemoveItem = useCallback(
    (value: string) => {
      onChange(selectedValues.filter((v) => v !== value));
    },
    [selectedValues, onChange],
  );

  // Click outside handler
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      ) {
        return;
      }
      closeDropdown();
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, closeDropdown]);

  // Focus search on open
  useEffect(() => {
    if (isOpen && shouldShowSearch && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen, shouldShowSearch]);

  // Scroll/resize handler
  useEffect(() => {
    if (!isOpen) return;

    const handleUpdate = () => updatePosition();
    window.addEventListener('scroll', handleUpdate, true);
    window.addEventListener('resize', handleUpdate);

    return () => {
      window.removeEventListener('scroll', handleUpdate, true);
      window.removeEventListener('resize', handleUpdate);
    };
  }, [isOpen, updatePosition]);

  const dropdownZIndex = getNextZIndex('modal', Z_INDEX_STEP);

  // Inject placeholder styles for search input
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const styleContent = `
      .${SEARCH_INPUT_CLASS}::placeholder {
        color: ${colors.textPlaceholder};
      }
    `;
    const existing = document.getElementById(STYLE_ID);
    if (existing) {
      existing.textContent = styleContent;
      const prev =
        parseInt(existing.getAttribute('data-ref-count') ?? '0', 10) || 0;
      existing.setAttribute('data-ref-count', String(prev + 1));
      return () => {
        const currEl = document.getElementById(STYLE_ID);
        if (!currEl) return;
        const curr =
          parseInt(currEl.getAttribute('data-ref-count') ?? '0', 10) || 0;
        if (curr <= 1) {
          currEl.remove();
        } else {
          currEl.setAttribute('data-ref-count', String(curr - 1));
        }
      };
    }

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.setAttribute('data-ref-count', '1');
    style.textContent = styleContent;
    document.head.appendChild(style);

    return () => {
      const currEl = document.getElementById(STYLE_ID);
      if (!currEl) return;
      const curr =
        parseInt(currEl.getAttribute('data-ref-count') ?? '0', 10) || 0;
      if (curr <= 1) {
        currEl.remove();
      } else {
        currEl.setAttribute('data-ref-count', String(curr - 1));
      }
    };
  }, [colors.textPlaceholder]);

  return (
    <div style={{ width }}>
      {/* Field Label */}
      {fieldLabel && (
        <div style={{ marginBottom: spacing.xs }}>
          <RetaylText
            as='label'
            text={fieldLabel}
            size={fontSize.sm}
            color={colors.textSecondary}
          />
          {required && (
            <RetaylText
              as='span'
              text=' *'
              size={fontSize.sm}
              color={colors.error}
            />
          )}
        </div>
      )}

      {/* Trigger */}
      <div
        ref={triggerRef}
        onClick={toggleDropdown}
        className='hover:bg-surface-hover transition-colors duration-150 dark:hover:bg-surface'
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: TRIGGER_HEIGHT,
          padding: `0 ${spacing.sm}px`,
          backgroundColor: disabled
            ? colors.backgroundSecondary
            : colors.inputBackground,
          border: `1px solid ${error ? colors.error : isOpen ? colors.primary : colors.borderLight}`,
          borderRadius: radius.md,
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? DISABLED_OPACITY : 1,
          transition: 'border-color 150ms ease',
        }}
        role='combobox'
        aria-expanded={isOpen}
        aria-haspopup='listbox'
      >
        <RetaylText
          as='span'
          text={isLoading ? 'Loading...' : placeholder}
          size={fontSize.sm}
          color={colors.textPlaceholder}
          style={{ fontFamily: FONTFAMILY.regular }}
        />
        <ChevronDown
          size={ICON_SIZE}
          color={colors.textTertiary}
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 150ms ease',
          }}
        />
      </div>

      {/* Selected Chips */}
      {showChips && selectedItems.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: spacing.xs,
            marginTop: spacing.xs,
          }}
        >
          {selectedItems.map((item) => (
            <RetaylChip
              key={item.value}
              label={item.label}
              removable
              onRemove={() => handleRemoveItem(item.value)}
              disabled={disabled}
              size='sm'
            />
          ))}
        </div>
      )}

      {/* Error Message */}
      {error && errorMessage && (
        <div style={{ marginTop: spacing.xs }}>
          <RetaylText
            as='span'
            text={errorMessage}
            size={fontSize.xs}
            color={colors.error}
          />
        </div>
      )}

      {/* Dropdown Portal */}
      {isOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: 'fixed',
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width,
              maxHeight: DEFAULT_DROPDOWN_HEIGHT,
              backgroundColor: colors.inputBackground,
              border: `1px solid ${colors.borderLight}`,
              borderRadius: radius.lg,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
              zIndex: dropdownZIndex,
              overflow: 'hidden',
              paddingTop: DROPDOWN_PADDING,
              paddingBottom: DROPDOWN_PADDING,
            }}
            role='listbox'
          >
            {/* Header */}
            {hasHeader && headerText && (
              <div
                onClick={() => {
                  onHeaderClick?.();
                  closeDropdown();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.xs,
                  padding: `${spacing.xs}px ${spacing.sm}px`,
                  margin: `${spacing.xs / 2}px 0`,
                  backgroundColor: applyOpacity(colors.primary, 'minimal'),
                  cursor: 'pointer',
                  transition: 'background-color 150ms ease',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = applyOpacity(
                    colors.primary,
                    'whisper',
                  ))
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = applyOpacity(
                    colors.primary,
                    'minimal',
                  ))
                }
              >
                <Plus size={ICON_SIZE} color={colors.primary} />
                <RetaylText
                  as='span'
                  text={headerText}
                  size={fontSize.sm}
                  color={colors.primary}
                  fontWeight='500'
                />
              </div>
            )}

            {/* Search */}
            {shouldShowSearch && (
              <div
                style={{
                  padding: spacing.sm,
                  borderBottom: `1px solid ${colors.borderLight}`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.xs,
                    padding: `${spacing.xs}px ${spacing.sm}px`,
                    backgroundColor: colors.backgroundSecondary,
                    borderRadius: radius.sm,
                  }}
                >
                  <Search size={ICON_SIZE} color={colors.textTertiary} />
                  <input
                    ref={searchInputRef}
                    type='text'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={searchPlaceholder}
                    className={SEARCH_INPUT_CLASS}
                    style={{
                      flex: 1,
                      border: 'none',
                      outline: 'none',
                      backgroundColor: 'transparent',
                      fontSize: fontSize.sm,
                      fontFamily: FONTFAMILY.regular,
                      color: colors.textPrimary,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Options List */}
            <div
              style={{
                maxHeight:
                  DEFAULT_DROPDOWN_HEIGHT -
                  DROPDOWN_PADDING * 2 -
                  (shouldShowSearch ? SEARCH_CONTAINER_HEIGHT : 0) -
                  (hasHeader && headerText ? HEADER_HEIGHT : 0),
                overflowY: 'auto',
                paddingBottom: spacing.md, // extra padding to ensure last item is fully visible
              }}
            >
              {filteredItems.length === 0 ? (
                <div style={{ padding: spacing.md, textAlign: 'center' }}>
                  <RetaylText
                    as='span'
                    text='No options found'
                    size={fontSize.sm}
                    color={colors.textTertiary}
                  />
                </div>
              ) : (
                filteredItems.map((item) => {
                  const isSelected = selectedValues.includes(item.value);
                  return (
                    <div
                      key={item.value}
                      onClick={() => handleItemClick(item.value)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: `${spacing.xs}px ${spacing.sm}px`,
                        margin: `${spacing.xs / 2}px 0`,
                        cursor: 'pointer',
                        backgroundColor: isSelected
                          ? applyOpacity(colors.primary, 'minimal')
                          : 'transparent',
                        transition: 'background-color 150ms ease',
                        fontSize: fontSize.sm,
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = applyOpacity(
                            colors.primary,
                            'whisper',
                          );
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = isSelected
                          ? applyOpacity(colors.primary, 'minimal')
                          : 'transparent';
                      }}
                      role='option'
                      aria-selected={isSelected}
                    >
                      <RetaylText
                        as='span'
                        text={item.label}
                        size={fontSize.sm}
                        color={isSelected ? colors.primary : colors.textPrimary}
                        fontWeight={isSelected ? '500' : '400'}
                      />
                      {isSelected && (
                        <Check size={ICON_SIZE} color={colors.primary} />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default RetaylMultiSelect;

/**
 * RetaylAutocomplete Dropdown & Types
 *
 * Extracted dropdown portal and shared types for the RetaylAutocomplete component.
 *
 * @module components/shared/RetaylAutocompleteDropdown
 */

import React, { useCallback } from 'react';
import { createPortal } from 'react-dom';
import type { useAutocompleteStyles } from './RetaylAutocompleteStyles';

// =============================================================================
// TYPES
// =============================================================================

/** Represents a single item in the autocomplete dropdown */
export interface AutocompleteItem {
  /** Unique identifier for the item */
  value: string;
  /** Display label */
  label: string;
  /** Optional secondary text (e.g., SKU, price) */
  subtitle?: string;
  /** Optional icon or image */
  icon?: React.ReactNode;
  /** Optional metadata for structured data access */
  metadata?: Record<string, string>;
}

/** Props for the RetaylAutocomplete search input component */
export interface RetaylAutocompleteProps {
  /** Placeholder text for the input */
  placeholder?: string;
  /** Label above the input */
  fieldLabel?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Callback when user types (for server-side search) */
  onSearch: (query: string) => void;
  /** Callback when user selects an item */
  onSelect: (item: AutocompleteItem) => void;
  /** Items to display in the dropdown */
  items: AutocompleteItem[];
  /** Whether search is in progress */
  isSearching?: boolean;
  /** Minimum characters before search triggers */
  minSearchLength?: number;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Error state */
  error?: boolean;
  /** Error message to display */
  errorMessage?: string;
  /** Custom width */
  width?: string | number;
  /** Empty state message when no results */
  emptyMessage?: string;
  /** Message shown before user starts typing */
  initialMessage?: string;
  /** Optional CSS class name for the container */
  className?: string;
}

// =============================================================================
// DROPDOWN ITEM
// =============================================================================

/** Renders a single dropdown item row */
const DropdownItem: React.FC<{
  item: AutocompleteItem;
  index: number;
  isHovered: boolean;
  styles: ReturnType<typeof useAutocompleteStyles>;
  setHoveredIndex: (i: number | null) => void;
  handleSelect: (item: AutocompleteItem) => void;
}> = React.memo(function DropdownItem({
  item,
  index,
  isHovered,
  styles,
  setHoveredIndex,
  handleSelect,
}) {
  const onEnter = useCallback(
    () => setHoveredIndex(index),
    [setHoveredIndex, index],
  );
  const onLeave = useCallback(() => setHoveredIndex(null), [setHoveredIndex]);
  const onClick = useCallback(() => handleSelect(item), [handleSelect, item]);

  const itemStyle = isHovered
    ? { ...styles.item, ...styles.itemHovered }
    : styles.item;

  return (
    <div
      style={itemStyle}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
      role='option'
      aria-selected={isHovered}
    >
      {item.icon ? <div style={styles.itemIcon}>{item.icon}</div> : null}
      <div style={styles.itemContent}>
        <div style={styles.itemLabel}>{item.label}</div>
        {item.subtitle ? (
          <div style={styles.itemSubtitle}>{item.subtitle}</div>
        ) : null}
      </div>
    </div>
  );
});

// =============================================================================
// DROPDOWN PORTAL
// =============================================================================

/** Renders the dropdown content inside a portal */
export function AutocompleteDropdown({
  dropdownRef,
  styles,
  dropdownContent,
  items,
  hoveredIndex,
  setHoveredIndex,
  handleSelect,
  emptyMessage,
  initialMessage,
  listboxId,
}: {
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  styles: ReturnType<typeof useAutocompleteStyles>;
  dropdownContent: 'loading' | 'initial' | 'empty' | 'results';
  items: AutocompleteItem[];
  hoveredIndex: number | null;
  setHoveredIndex: (i: number | null) => void;
  handleSelect: (item: AutocompleteItem) => void;
  emptyMessage: string;
  initialMessage: string;
  listboxId: string;
}) {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      ref={dropdownRef}
      style={styles.dropdown}
      role='listbox'
      id={listboxId}
    >
      {dropdownContent === 'loading' ? (
        <div style={styles.emptyState}>Searching...</div>
      ) : null}
      {dropdownContent === 'initial' ? (
        <div style={styles.emptyState}>{initialMessage}</div>
      ) : null}
      {dropdownContent === 'empty' ? (
        <div style={styles.emptyState}>{emptyMessage}</div>
      ) : null}
      {dropdownContent === 'results'
        ? items.map((item, idx) => (
            <DropdownItem
              key={item.value}
              item={item}
              index={idx}
              isHovered={hoveredIndex === idx}
              styles={styles}
              setHoveredIndex={setHoveredIndex}
              handleSelect={handleSelect}
            />
          ))
        : null}
    </div>,
    document.body,
  );
}

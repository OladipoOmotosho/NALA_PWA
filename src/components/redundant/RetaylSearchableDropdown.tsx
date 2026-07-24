import React, { useMemo } from 'react';
import { spacing } from '@retayl/utils';
import RetaylSelect from './RetaylSelect';
import type { BaseItemType } from './RetaylSelect.types';

// Dropdown constants
const DROPDOWN_CONSTANTS = {
  DEFAULT_HEIGHT: spacing.xxl,
} as const;

/**
 * @deprecated Use RetaylSelect instead. This component will be removed in a future version.
 *
 * Migration guide:
 * ```tsx
 * // Old API
 * <RetaylSearchableDropdown
 *   items={users}
 *   getName={(user) => user.name}
 *   onItemSelect={handleSelect}
 * />
 *
 * // New API
 * <RetaylSelect
 *   items={users.map(user => ({ label: user.name, value: user.id }))}
 *   onChange={(value, label) => handleSelect(value)}
 * />
 * ```
 */
interface SearchableDropdownProps<T> {
  items: T[];
  onItemSelect: (item: T) => void;
  placeholder?: string;
  getName: (item: T) => string;
  height?: number;
  maxHeight?: number;
  minHeight?: number;
  selectedItem?: T;
  isLoading?: boolean;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  borderColor?: string;
}

const RetaylSearchableDropdown = <T extends object>({
  items,
  onItemSelect,
  placeholder = 'Search by name',
  getName,
  height = DROPDOWN_CONSTANTS.DEFAULT_HEIGHT,
  selectedItem,
  isLoading = false,
  disabled = false,
  error = false,
  errorMessage,
  borderColor,
}: SearchableDropdownProps<T>) => {
  // Convert items to RetaylSelect format
  const selectItems = useMemo<BaseItemType[]>(() => {
    return items.map((item, index) => ({
      label: getName(item),
      value: index.toString(), // Use index as value since we don't have a proper ID
      // Store original item for retrieval
      _originalItem: item,
    }));
  }, [items, getName]);

  // Find selected item's index
  const selectedValue = useMemo(() => {
    if (!selectedItem) return '';
    const index = items.findIndex((item) => item === selectedItem);
    return index >= 0 ? index.toString() : '';
  }, [selectedItem, items]);

  const handleChange = (value: string, _label: string) => {
    const index = parseInt(value, 10);
    if (index >= 0 && index < items.length) {
      onItemSelect(items[index]);
    }
  };

  return (
    <RetaylSelect
      fieldLabel={placeholder}
      placeholder={placeholder}
      value={selectedValue}
      onChange={handleChange}
      items={selectItems}
      height={height}
      isLoading={isLoading}
      readOnly={disabled}
      error={error}
      errorMessage={errorMessage}
      borderColor={borderColor}
      searchable={true} // Always enable search for compatibility
    />
  );
};

export default RetaylSearchableDropdown;

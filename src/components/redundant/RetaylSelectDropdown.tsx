/**
 * Dropdown portal for RetaylSelect.
 * Renders the search input, header actions, and options list inside a portal.
 */
import React, { useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { spacing, NUMERIC_CONSTANTS } from '@retayl/utils';
import { Pencil, SearchIcon, CloseIcon } from '@retayl/icons';
import type { BaseItemType, AddMoreOptionsProps } from './RetaylSelect.types';
import type { SelectStyles } from './RetaylSelectStyles';
import { ICON_SIZE } from './RetaylSelectStyles';
import RetaylSelectOptionItem from './RetaylSelectOptionItem';

/** Props for the dropdown portal sub-component */
interface RetaylSelectDropdownProps<T extends BaseItemType> {
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  styles: SelectStyles;
  modalTitle?: string;
  shouldShowSearch: boolean;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  searchPlaceholder: string;
  searchInputStyle: React.CSSProperties;
  hasHeader: boolean;
  headerText: string;
  onHeaderClick?: () => void;
  closeDropdown: () => void;
  addMoreOptions?: AddMoreOptionsProps;
  filteredItems: T[];
  currentValue: string;
  hoveredItemValue: string | null;
  onHoverItem: (value: string | null) => void;
  onSelectItem: (value: T['value'], label: string) => void;
  normalizeValue: (input?: T['value'] | null) => string;
  scrollbarClassName: string;
  isSearching: boolean;
  onSearch?: (query: string) => void;
  iconPosition: 'left' | 'right';
  headerActionStyle: React.CSSProperties;
  headerActionTextStyle: React.CSSProperties;
  addMoreStyle: React.CSSProperties;
  addMoreTextStyle: React.CSSProperties;
}

/** Props for the empty state content */
interface OptionsEmptyContentProps {
  isSearching: boolean;
  onSearch?: (query: string) => void;
  searchQuery: string;
  filteredItemsLength: number;
  shouldShowSearch: boolean;
  emptyStyle: React.CSSProperties;
}

/** Renders the empty / searching state content for the options list */
const OptionsEmptyContent = React.memo<OptionsEmptyContentProps>(
  ({
    isSearching,
    onSearch,
    searchQuery,
    filteredItemsLength,
    shouldShowSearch,
    emptyStyle,
  }) => {
    if (isSearching) return <div style={emptyStyle}>Searching...</div>;
    if (onSearch && !searchQuery)
      return <div style={emptyStyle}>Start typing to search products</div>;
    if (
      filteredItemsLength === 0 &&
      shouldShowSearch &&
      searchQuery &&
      onSearch
    ) {
      const tooShort =
        searchQuery.trim().length < NUMERIC_CONSTANTS.SEARCH_MIN_LENGTH;
      return (
        <div style={emptyStyle}>
          {tooShort
            ? `Type at least ${NUMERIC_CONSTANTS.SEARCH_MIN_LENGTH} characters to search`
            : `No results found for "${searchQuery}"`}
        </div>
      );
    }
    if (filteredItemsLength === 0 && shouldShowSearch && searchQuery) {
      return (
        <div style={emptyStyle}>
          No results found for &quot;{searchQuery}&quot;
        </div>
      );
    }
    return null;
  },
);

OptionsEmptyContent.displayName = 'OptionsEmptyContent';

/** Inner content of the dropdown, extracted to keep main component under 75 lines */
const DropdownContent = <T extends BaseItemType>({
  dropdownRef,
  styles,
  modalTitle,
  shouldShowSearch,
  searchInputRef,
  searchQuery,
  onSearchQueryChange,
  searchPlaceholder,
  searchInputStyle,
  hasHeader,
  headerText,
  onHeaderClick,
  closeDropdown,
  addMoreOptions,
  filteredItems,
  currentValue,
  hoveredItemValue,
  onHoverItem,
  onSelectItem,
  normalizeValue,
  scrollbarClassName,
  isSearching,
  onSearch,
  iconPosition,
  headerActionStyle,
  headerActionTextStyle,
  addMoreStyle,
  addMoreTextStyle,
}: RetaylSelectDropdownProps<T>): React.ReactElement => {
  const handleHeaderClick = useCallback(() => {
    closeDropdown();
    onHeaderClick?.();
  }, [closeDropdown, onHeaderClick]);

  const handleAddMoreClick = useCallback(() => {
    closeDropdown();
    addMoreOptions?.onClick();
  }, [closeDropdown, addMoreOptions]);

  const handleClearSearch = useCallback(
    () => onSearchQueryChange(''),
    [onSearchQueryChange],
  );
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      onSearchQueryChange(e.target.value),
    [onSearchQueryChange],
  );
  const pencilStyle = useMemo(() => ({ marginRight: spacing.xs }), []);

  const hasEmptyContent =
    isSearching ||
    (onSearch && !searchQuery) ||
    (filteredItems.length === 0 && shouldShowSearch && searchQuery);

  return (
    <div ref={dropdownRef} style={styles.dropdown}>
      {modalTitle ? (
        <div style={styles.dropdownHeader}>{modalTitle}</div>
      ) : null}
      {shouldShowSearch ? (
        <div style={styles.searchContainer}>
          <div style={styles.searchInputWrapper}>
            <SearchIcon
              width={ICON_SIZE}
              height={ICON_SIZE}
              style={styles.searchIcon}
            />
            <input
              ref={searchInputRef}
              type='text'
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={searchPlaceholder}
              className='retayl-select-search-input'
              style={searchInputStyle}
            />
            {searchQuery ? (
              <CloseIcon
                width={ICON_SIZE}
                height={ICON_SIZE}
                style={styles.clearButton}
                onClick={handleClearSearch}
              />
            ) : null}
          </div>
        </div>
      ) : null}
      {hasHeader ? (
        <div style={headerActionStyle} onClick={handleHeaderClick}>
          <Pencil width={ICON_SIZE} height={ICON_SIZE} style={pencilStyle} />
          <div style={headerActionTextStyle}>{headerText}</div>
        </div>
      ) : null}
      {addMoreOptions ? (
        <div style={addMoreStyle} onClick={handleAddMoreClick}>
          {addMoreOptions.icon || (
            <Pencil width={ICON_SIZE} height={ICON_SIZE} />
          )}
          <div style={addMoreTextStyle}>{addMoreOptions.text}</div>
        </div>
      ) : null}
      <div style={styles.dropdownList} className={scrollbarClassName}>
        {hasEmptyContent ? (
          <OptionsEmptyContent
            isSearching={isSearching}
            onSearch={onSearch}
            searchQuery={searchQuery}
            filteredItemsLength={filteredItems.length}
            shouldShowSearch={shouldShowSearch}
            emptyStyle={styles.emptyState}
          />
        ) : (
          filteredItems.map((item) => (
            <RetaylSelectOptionItem
              key={normalizeValue(item.value)}
              item={item}
              isSelected={normalizeValue(item.value) === currentValue}
              itemKey={normalizeValue(item.value)}
              isHovered={hoveredItemValue === normalizeValue(item.value)}
              onHoverItem={onHoverItem}
              onSelectItem={onSelectItem}
              iconPosition={iconPosition}
              optionStyle={styles.option}
              optionSelectedStyle={styles.optionSelected}
              optionHoverStyle={styles.optionHover}
            />
          ))
        )}
      </div>
    </div>
  );
};

/** Dropdown portal – renders into document.body. Returns null during SSR. */
const RetaylSelectDropdown = <T extends BaseItemType>(
  props: RetaylSelectDropdownProps<T>,
): React.ReactElement | null => {
  if (typeof document === 'undefined') return null;
  return createPortal(<DropdownContent {...props} />, document.body);
};

export default RetaylSelectDropdown;

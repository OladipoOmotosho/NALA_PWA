/**
 * RetaylAutocomplete Component
 *
 * A search input with dropdown suggestions for "type to search, click to add"
 * workflows. Designed for server-side search with debounced queries.
 *
 * @module components/shared/RetaylAutocomplete
 */

import React, { useCallback, useId } from 'react';
import { SearchIcon } from '@retayl/icons';
import { Loader2, X } from 'lucide-react';
import { useAutocompleteStyles } from './RetaylAutocompleteStyles';
import {
  AutocompleteDropdown,
  type AutocompleteItem,
  type RetaylAutocompleteProps,
} from './RetaylAutocompleteDropdown';
import { useAutocompleteState } from './RetaylAutocompleteHooks';

export type { AutocompleteItem, RetaylAutocompleteProps };

const ICON_SIZE = 16;
const DEFAULT_MIN_SEARCH_LENGTH = 2;

/** Renders the search input with icons */
const AutocompleteInput = React.memo(function AutocompleteInput(p: {
  inputRef: React.RefObject<HTMLInputElement | null>;
  query: string;
  isSearching: boolean;
  isOpen: boolean;
  disabled: boolean;
  placeholder: string;
  fieldLabel: string | undefined;
  listboxId: string;
  styles: ReturnType<typeof useAutocompleteStyles>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onClear: () => void;
}) {
  const { onClear } = p;
  const inputStyle = p.isOpen
    ? { ...p.styles.input, ...p.styles.inputFocused }
    : p.styles.input;

  const handleClearKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClear();
      }
    },
    [onClear],
  );

  return (
    <div style={p.styles.inputWrapper}>
      <SearchIcon
        width={ICON_SIZE}
        height={ICON_SIZE}
        style={p.styles.searchIcon}
      />
      <input
        ref={p.inputRef}
        type='text'
        value={p.query}
        onChange={p.onChange}
        onFocus={p.onFocus}
        onKeyDown={p.onKeyDown}
        placeholder={p.placeholder}
        disabled={p.disabled}
        style={inputStyle}
        aria-label={p.fieldLabel || p.placeholder}
        aria-expanded={p.isOpen}
        aria-haspopup='listbox'
        aria-controls={p.listboxId}
        role='combobox'
      />
      {p.isSearching ? (
        <Loader2 size={ICON_SIZE} style={p.styles.loadingIcon} />
      ) : null}
      {!p.isSearching && p.query ? (
        <div
          role='button'
          tabIndex={0}
          aria-label='Clear search'
          style={p.styles.clearButton}
          onClick={p.onClear}
          onKeyDown={handleClearKeyDown}
        >
          <X size={ICON_SIZE} />
        </div>
      ) : null}
    </div>
  );
});

export const RetaylAutocomplete: React.FC<RetaylAutocompleteProps> = ({
  placeholder = 'Search...',
  fieldLabel,
  required = false,
  onSearch,
  onSelect,
  items,
  isSearching = false,
  minSearchLength = DEFAULT_MIN_SEARCH_LENGTH,
  disabled = false,
  error = false,
  errorMessage,
  width = '100%',
  emptyMessage = 'No results found',
  initialMessage = 'Start typing to search',
  className,
}) => {
  const listboxId = useId();
  const s = useAutocompleteState({
    onSearch,
    onSelect,
    items,
    isSearching,
    minSearchLength,
    disabled,
    error,
    width,
  });

  return (
    <div ref={s.containerRef} style={s.styles.container} className={className}>
      {fieldLabel ? (
        <div style={s.styles.labelRow}>
          <label style={s.styles.label}>
            {fieldLabel}
            {required ? ' *' : null}
          </label>
        </div>
      ) : null}
      <AutocompleteInput
        inputRef={s.inputRef}
        query={s.query}
        isSearching={isSearching}
        isOpen={s.dd.isOpen}
        disabled={disabled}
        placeholder={placeholder}
        fieldLabel={fieldLabel}
        listboxId={listboxId}
        styles={s.styles}
        onChange={s.handleChange}
        onFocus={s.handleFocus}
        onKeyDown={s.handleKeyDown}
        onClear={s.handleClear}
      />
      {error && errorMessage ? (
        <div style={s.styles.errorText}>{errorMessage}</div>
      ) : null}
      {s.dd.isOpen ? (
        <AutocompleteDropdown
          dropdownRef={s.dd.dropdownRef}
          styles={s.styles}
          dropdownContent={s.content}
          items={items}
          hoveredIndex={s.dd.hoveredIndex}
          setHoveredIndex={s.dd.setHoveredIndex}
          handleSelect={s.handleSelect}
          emptyMessage={emptyMessage}
          initialMessage={initialMessage}
          listboxId={listboxId}
        />
      ) : null}
    </div>
  );
};

export default RetaylAutocomplete;

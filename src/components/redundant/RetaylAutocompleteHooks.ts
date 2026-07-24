/**
 * RetaylAutocomplete Hooks
 *
 * Internal hooks for search, dropdown, keyboard navigation, and handler
 * wiring used by RetaylAutocomplete. Extracted to keep the main component
 * file under ESLint max-lines.
 *
 * @module components/shared/RetaylAutocompleteHooks
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type React from 'react';
import {
  useAutocompleteStyles,
  type DropdownPosition,
} from './RetaylAutocompleteStyles';
import type { AutocompleteItem } from './RetaylAutocompleteDropdown';

const DROPDOWN_OFFSET = 4;
const SEARCH_DEBOUNCE_MS = 300;
const INITIAL_POSITION: DropdownPosition = { top: 0, left: 0, width: 0 };

/** Manages debounced search queries */
export function useSearchQuery(
  onSearch: (q: string) => void,
  minSearchLength: number,
) {
  const [query, setQuery] = useState('');
  const isSelectingRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const clearTimer = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    };
    if (isSelectingRef.current) {
      isSelectingRef.current = false;
      clearTimer();
      return;
    }
    if (query.length === 0) {
      clearTimer();
      onSearch(query);
      return;
    }
    if (query.length < minSearchLength) {
      clearTimer();
      return;
    }
    clearTimer();
    timeoutRef.current = setTimeout(() => onSearch(query), SEARCH_DEBOUNCE_MS);
    return () => clearTimer();
  }, [query, onSearch, minSearchLength]);

  /** Marks next query change as a selection (skips search) */
  const markSelecting = useCallback(() => {
    isSelectingRef.current = true;
  }, []);

  return { query, setQuery, markSelecting };
}

/** Manages dropdown open/close and position */
export function useDropdownState(
  disabled: boolean,
  containerRef: React.RefObject<HTMLDivElement | null>,
) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [position, setPosition] = useState<DropdownPosition>(INITIAL_POSITION);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPosition({
      top: rect.bottom + DROPDOWN_OFFSET,
      left: rect.left,
      width: rect.width,
    });
  }, [containerRef]);

  const open = useCallback(() => {
    if (disabled) return;
    updatePosition();
    setIsOpen(true);
  }, [disabled, updatePosition]);

  const close = useCallback(() => {
    setIsOpen(false);
    setHoveredIndex(null);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        containerRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      )
        return;
      close();
    };
    const onScroll = (e: Event) => {
      if (
        dropdownRef.current &&
        e.target instanceof Node &&
        dropdownRef.current.contains(e.target)
      )
        return;
      close();
    };
    document.addEventListener('mousedown', onClickOutside);
    window.addEventListener('scroll', onScroll, true);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [isOpen, close, containerRef]);

  return {
    isOpen,
    hoveredIndex,
    setHoveredIndex,
    position,
    dropdownRef,
    open,
    close,
  };
}

/** Resolves dropdown content type based on search state */
export function resolveContent(
  isSearching: boolean,
  queryLen: number,
  minLen: number,
  itemCount: number,
): 'loading' | 'initial' | 'empty' | 'results' {
  if (isSearching) return 'loading';
  if (queryLen < minLen) return 'initial';
  return itemCount === 0 ? 'empty' : 'results';
}

/** Handles keyboard navigation within the dropdown */
export function useKeyboardNav(
  isOpen: boolean,
  hoveredIndex: number | null,
  setHoveredIndex: (i: number | null) => void,
  close: () => void,
  items: AutocompleteItem[],
  onSelect: (item: AutocompleteItem) => void,
) {
  return useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        close();
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        if (hoveredIndex !== null && items[hoveredIndex]) {
          onSelect(items[hoveredIndex]);
        }
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (items.length === 0) return;
        const next =
          hoveredIndex === null || hoveredIndex >= items.length - 1
            ? 0
            : hoveredIndex + 1;
        setHoveredIndex(next);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (items.length === 0) return;
        const prev =
          hoveredIndex === null || hoveredIndex <= 0
            ? items.length - 1
            : hoveredIndex - 1;
        setHoveredIndex(prev);
      }
    },
    [isOpen, hoveredIndex, setHoveredIndex, close, items, onSelect],
  );
}

/** Wires together search, dropdown, and keyboard hooks */
export function useAutocompleteHandlers(
  onSelect: (item: AutocompleteItem) => void,
  setQuery: (q: string) => void,
  markSelecting: () => void,
  ddOpen: () => void,
  ddClose: () => void,
  ddIsOpen: boolean,
  inputRef: React.RefObject<HTMLInputElement | null>,
) {
  const handleFocus = useCallback(() => ddOpen(), [ddOpen]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
      if (!ddIsOpen) ddOpen();
    },
    [setQuery, ddIsOpen, ddOpen],
  );

  const handleSelect = useCallback(
    (item: AutocompleteItem) => {
      onSelect(item);
      markSelecting();
      setQuery('');
      ddClose();
      inputRef.current?.blur();
    },
    [onSelect, markSelecting, setQuery, ddClose, inputRef],
  );

  const handleClear = useCallback(() => {
    setQuery('');
    inputRef.current?.focus();
  }, [setQuery, inputRef]);

  return { handleFocus, handleChange, handleSelect, handleClear };
}

/** Aggregates all autocomplete state and handlers */
export function useAutocompleteState(props: {
  onSearch: (q: string) => void;
  onSelect: (item: AutocompleteItem) => void;
  items: AutocompleteItem[];
  isSearching: boolean;
  minSearchLength: number;
  disabled: boolean;
  error: boolean;
  width: string | number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { query, setQuery, markSelecting } = useSearchQuery(
    props.onSearch,
    props.minSearchLength,
  );
  const dd = useDropdownState(props.disabled, containerRef);
  const { setHoveredIndex } = dd;

  const styleOpts = useMemo(
    () => ({
      width: props.width,
      error: props.error,
      disabled: props.disabled,
      dropdownPosition: dd.position,
    }),
    [props.width, props.error, props.disabled, dd.position],
  );
  const styles = useAutocompleteStyles(styleOpts);

  useEffect(() => {
    setHoveredIndex(null);
  }, [props.items, setHoveredIndex]);

  const handlers = useAutocompleteHandlers(
    props.onSelect,
    setQuery,
    markSelecting,
    dd.open,
    dd.close,
    dd.isOpen,
    inputRef,
  );
  const handleKeyDown = useKeyboardNav(
    dd.isOpen,
    dd.hoveredIndex,
    dd.setHoveredIndex,
    dd.close,
    props.items,
    handlers.handleSelect,
  );
  const content = resolveContent(
    props.isSearching,
    query.length,
    props.minSearchLength,
    props.items.length,
  );

  return {
    inputRef,
    containerRef,
    query,
    styles,
    dd,
    content,
    handleKeyDown,
    ...handlers,
  };
}

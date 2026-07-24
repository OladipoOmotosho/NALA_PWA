/**
 * Custom hook encapsulating RetaylSelect state management.
 * Extracted to reduce the main component's line count and complexity.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { BaseItemType, CustomSelectProps } from './RetaylSelect.types';
import {
  DROPDOWN_OFFSET,
  DEFAULT_DROPDOWN_HEIGHT,
  SELECT_CONSTANTS,
} from './RetaylSelectStyles';

/** Normalizes a select value to a string */
const normalizeValue = <T extends BaseItemType>(
  input?: T['value'] | null,
): string => {
  return input === undefined || input === null ? '' : String(input);
};

/** Return type of the useRetaylSelect hook */
export interface UseRetaylSelectReturn<T extends BaseItemType> {
  normalizeValue: (input?: T['value'] | null) => string;
  currentValue: string;
  selectedItem: T | undefined;
  displayedLabel: string;
  showPlaceholder: boolean;
  resolvedError: boolean;
  showDropdown: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  hoveredItemValue: string | null;
  setHoveredItemValue: (v: string | null) => void;
  dropdownPosition: { top: number; left: number; width: number };
  selectRef: React.RefObject<HTMLDivElement | null>;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  filteredItems: T[];
  shouldShowSearch: boolean;
  closeDropdown: () => void;
  handleSelectItem: (itemValue: T['value'], itemLabel: string) => void;
  handleTriggerClick: () => void;
}

/** Props subset consumed by useRetaylSelect */
type SelectHookProps<T extends BaseItemType> = Pick<
  CustomSelectProps<T>,
  | 'value'
  | 'label'
  | 'items'
  | 'onChange'
  | 'error'
  | 'errorMessage'
  | 'required'
  | 'readOnly'
  | 'isLoading'
  | 'searchable'
  | 'onSearch'
  | 'isSearching'
>;

/** Manages core select value state, refs, and error resolution */
const useSelectValueState = <T extends BaseItemType>(
  props: SelectHookProps<T>,
) => {
  const {
    value,
    label,
    items,
    error = false,
    errorMessage,
    required = false,
    searchable,
  } = props;
  const shouldShowSearch =
    searchable ?? items.length > SELECT_CONSTANTS.SEARCH_DEBOUNCE;
  const normalizeFn = useCallback(
    (input?: T['value'] | null) => normalizeValue<T>(input),
    [],
  );
  const isControlled = value !== undefined;
  const normalizedPropValue = normalizeFn(value);
  const [internalValue, setInternalValue] =
    useState<string>(normalizedPropValue);
  const [internalLabel, setInternalLabel] = useState<string | undefined>(label);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredItemValue, setHoveredItemValue] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const selectRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [isTouched, setIsTouched] = useState(false);
  const [hasRequiredError, setHasRequiredError] = useState(false);
  const hasExternalError = Boolean(error || errorMessage);
  const resolvedError = isTouched && (hasExternalError || hasRequiredError);
  const currentValue = isControlled ? normalizedPropValue : internalValue;
  const selectedItem = items.find(
    (item) => normalizeFn(item.value) === currentValue,
  );
  const displayedLabel = selectedItem?.label ?? internalLabel ?? label ?? '';
  const showPlaceholder = !displayedLabel;

  useEffect(() => {
    if (!required) {
      setHasRequiredError(false);
      return;
    }
    const isEmpty = currentValue === '' || currentValue === null;
    setHasRequiredError(isEmpty && !hasExternalError);
  }, [currentValue, required, hasExternalError]);

  useEffect(() => {
    if (isControlled) setInternalValue(normalizedPropValue);
  }, [isControlled, normalizedPropValue]);
  useEffect(() => {
    if (label !== undefined) setInternalLabel(label);
  }, [label]);

  return {
    normalizeFn,
    isControlled,
    shouldShowSearch,
    internalValue,
    setInternalValue,
    internalLabel,
    setInternalLabel,
    showDropdown,
    setShowDropdown,
    searchQuery,
    setSearchQuery,
    hoveredItemValue,
    setHoveredItemValue,
    dropdownPosition,
    setDropdownPosition,
    selectRef,
    dropdownRef,
    searchInputRef,
    isTouched,
    setIsTouched,
    resolvedError,
    currentValue,
    selectedItem,
    displayedLabel,
    showPlaceholder,
  };
};

/** Manages filtered items and search side-effects */
const useSelectFiltering = <T extends BaseItemType>(
  items: T[],
  searchQuery: string,
  shouldShowSearch: boolean,
  onSearch?: (q: string) => void,
  setHoveredItemValue?: (v: string | null) => void,
) => {
  const filteredItems = useMemo(() => {
    if (onSearch) return items;
    if (!shouldShowSearch || !searchQuery.trim()) return items;
    const query = searchQuery.toLowerCase().trim();
    return items.filter((item) => item.label.toLowerCase().includes(query));
  }, [items, searchQuery, shouldShowSearch, onSearch]);

  useEffect(() => {
    if (onSearch) onSearch(searchQuery);
    setHoveredItemValue?.(null);
  }, [searchQuery, onSearch, setHoveredItemValue]);

  return filteredItems;
};

/** Manages dropdown open/close, outside-click, and scroll listeners */
const useSelectDropdownBehavior = (
  showDropdown: boolean,
  closeDropdown: () => void,
  selectRef: React.RefObject<HTMLDivElement | null>,
  dropdownRef: React.RefObject<HTMLDivElement | null>,
) => {
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        selectRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      )
        return;
      closeDropdown();
    },
    [closeDropdown, selectRef, dropdownRef],
  );

  useEffect(() => {
    if (!showDropdown) return;
    document.addEventListener('mousedown', handleClickOutside);
    const handleScroll = (event: Event) => {
      if (
        dropdownRef.current &&
        event.target instanceof Node &&
        dropdownRef.current.contains(event.target)
      )
        return;
      closeDropdown();
    };
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [showDropdown, handleClickOutside, closeDropdown, dropdownRef]);
};

/**
 * Manages all state, effects, and callbacks for RetaylSelect.
 *
 * @param props - The component props forwarded from RetaylSelect
 * @returns An object containing all state values and handlers
 */
export const useRetaylSelect = <T extends BaseItemType>(
  props: SelectHookProps<T>,
): UseRetaylSelectReturn<T> => {
  const { onChange, readOnly = false, isLoading = false, onSearch } = props;
  const state = useSelectValueState(props);

  const closeDropdown = useCallback(() => {
    state.setShowDropdown(false);
    state.setSearchQuery('');
    state.setHoveredItemValue(null);
    state.setIsTouched(true);
  }, [state]);

  const handleSelectItem = useCallback(
    (itemValue: T['value'], itemLabel: string) => {
      const normalizedNext = state.normalizeFn(itemValue);
      if (!state.isControlled) state.setInternalValue(normalizedNext);
      state.setInternalLabel(itemLabel);
      onChange?.(normalizedNext, itemLabel);
      closeDropdown();
    },
    [state, onChange, closeDropdown],
  );

  const filteredItems = useSelectFiltering(
    props.items,
    state.searchQuery,
    state.shouldShowSearch,
    onSearch,
    state.setHoveredItemValue,
  );

  useSelectDropdownBehavior(
    state.showDropdown,
    closeDropdown,
    state.selectRef,
    state.dropdownRef,
  );

  const handleTriggerClick = useCallback(() => {
    if (readOnly || isLoading) return;
    if (!state.showDropdown && state.selectRef.current) {
      const rect = state.selectRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const shouldShowAbove =
        spaceBelow < DEFAULT_DROPDOWN_HEIGHT &&
        rect.top > DEFAULT_DROPDOWN_HEIGHT;
      state.setDropdownPosition({
        top: shouldShowAbove
          ? rect.top - DEFAULT_DROPDOWN_HEIGHT - DROPDOWN_OFFSET
          : rect.bottom + DROPDOWN_OFFSET,
        left: rect.left,
        width: rect.width,
      });
    }
    const newShowState = !state.showDropdown;
    state.setShowDropdown(newShowState);
    if (newShowState && state.shouldShowSearch) {
      setTimeout(
        () => state.searchInputRef.current?.focus(),
        SELECT_CONSTANTS.FOCUS_DELAY,
      );
    }
  }, [readOnly, isLoading, state]);

  return {
    normalizeValue: state.normalizeFn,
    currentValue: state.currentValue,
    selectedItem: state.selectedItem,
    displayedLabel: state.displayedLabel,
    showPlaceholder: state.showPlaceholder,
    resolvedError: state.resolvedError,
    showDropdown: state.showDropdown,
    searchQuery: state.searchQuery,
    setSearchQuery: state.setSearchQuery,
    hoveredItemValue: state.hoveredItemValue,
    setHoveredItemValue: state.setHoveredItemValue,
    dropdownPosition: state.dropdownPosition,
    selectRef: state.selectRef,
    dropdownRef: state.dropdownRef,
    searchInputRef: state.searchInputRef,
    filteredItems,
    shouldShowSearch: state.shouldShowSearch,
    closeDropdown,
    handleSelectItem,
    handleTriggerClick,
  };
};

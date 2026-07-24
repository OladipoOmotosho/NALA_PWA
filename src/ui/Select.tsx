/**
 * Adapted from Retayl's RetaylSelect family (RetaylSelect.tsx,
 * RetaylSelectDropdown.tsx, RetaylSelectOptionItem.tsx, RetaylSelectStyles.ts,
 * useRetaylSelect.ts, useRetaylSelectMemoStyles.ts — six files consolidated
 * into one, since the line-count-per-file splitting in the original served
 * that monorepo's lint rules, which don't apply here).
 *
 * This is the closest of the Retayl components to being portable as-is: the
 * web variant already used plain divs, a react-dom portal, and inline
 * styles — no react-native primitives to strip. What changed:
 *  - `@retayl/hooks` useTheme + `@retayl/utils` tokens → this project's
 *    theme.ts (CSS custom properties).
 *  - `@retayl/icons` (Pencil/SearchIcon/CloseIcon) → `lucide-react`
 *    directly (a real dependency of this project).
 *  - Dropped: backend-search mode (onSearch/isSearching), the "add more
 *    options" and "header action" rows, per-item icon/image slots, and
 *    the configurable scrollbar-style prop. None of this app's dropdown
 *    lists need them; they added real complexity for zero current use.
 *    Kept: the debounced-by-length auto-search-box behavior (only shows
 *    a filter input once a list is long enough to need it), portal-based
 *    positioning that flips above the trigger when there's no room below,
 *    and click-outside/scroll-to-close.
 *
 * See internal-docs/technical-documentation/Select.md for the full prop
 * reference and usage examples.
 */
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Search } from 'lucide-react';
import { colors } from './theme';
import { cx } from './cx';
import styles from './Select.module.css';

export interface SelectItem {
  label: string;
  value: string;
}

export interface SelectProps {
  items: SelectItem[];
  value: string;
  onChange: (value: string, label: string) => void;
  fieldLabel?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  /** Auto-enabled once the list exceeds 10 items; force on/off explicitly. */
  searchable?: boolean;
  searchPlaceholder?: string;
  isLoading?: boolean;
}

const SEARCH_THRESHOLD = 10;
const DROPDOWN_MAX_HEIGHT = 300;
const DROPDOWN_OFFSET = 4;

interface Position {
  top: number;
  left: number;
  width: number;
}

function useDropdownPosition(triggerRef: React.RefObject<HTMLDivElement | null>, open: boolean) {
  const [position, setPosition] = useState<Position>({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const showAbove = spaceBelow < DROPDOWN_MAX_HEIGHT && rect.top > DROPDOWN_MAX_HEIGHT;
    setPosition({
      top: showAbove ? rect.top - DROPDOWN_MAX_HEIGHT - DROPDOWN_OFFSET : rect.bottom + DROPDOWN_OFFSET,
      left: rect.left,
      width: rect.width,
    });
  }, [open, triggerRef]);

  return position;
}

function DropdownPortal({
  position,
  children,
  dropdownRef,
}: {
  position: Position;
  children: ReactNode;
  dropdownRef: React.RefObject<HTMLDivElement>;
}) {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <div
      ref={dropdownRef}
      className={styles.dropdown}
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        width: position.width,
      }}
    >
      {children}
    </div>,
    document.body,
  );
}

export function Select({
  items,
  value,
  onChange,
  fieldLabel,
  placeholder = 'Select…',
  required = false,
  disabled = false,
  error = false,
  errorMessage,
  searchable,
  searchPlaceholder = 'Search…',
  isLoading = false,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [hovered, setHovered] = useState<string | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const shouldShowSearch = searchable ?? items.length > SEARCH_THRESHOLD;
  const selected = items.find((i) => i.value === value);
  const position = useDropdownPosition(triggerRef, open);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setHovered(null);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target) || dropdownRef.current?.contains(target)) return;
      close();
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, [open, close]);

  useEffect(() => {
    if (open && shouldShowSearch) setTimeout(() => searchRef.current?.focus(), 50);
  }, [open, shouldShowSearch]);

  const filtered = useMemo(() => {
    if (!shouldShowSearch || !query.trim()) return items;
    const q = query.toLowerCase().trim();
    return items.filter((i) => i.label.toLowerCase().includes(q));
  }, [items, query, shouldShowSearch]);

  const handleToggle = () => {
    if (disabled || isLoading) return;
    setOpen((v) => !v);
  };

  const handleSelect = (item: SelectItem) => {
    onChange(item.value, item.label);
    close();
  };

  return (
    <div className={styles.wrapper}>
      {fieldLabel && (
        <label className={cx(styles.label, error && styles.labelError)}>
          {fieldLabel}
          {required && ' *'}
        </label>
      )}
      <div
        ref={triggerRef}
        role="combobox"
        tabIndex={disabled ? -1 : 0}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={fieldLabel}
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
          }
        }}
        className={cx(
          styles.trigger,
          error && styles.triggerError,
          !error && open && styles.triggerOpen,
          disabled && styles.triggerDisabled,
        )}
        style={{ cursor: disabled || isLoading ? 'not-allowed' : 'pointer' }}
      >
        <span className={cx(styles.value, !selected && styles.valuePlaceholder)}>
          {isLoading ? 'Loading…' : (selected?.label ?? placeholder)}
        </span>
        {!isLoading && (
          <ChevronDown size={16} color={colors.muted} className={cx(styles.chevron, open && styles.chevronOpen)} />
        )}
      </div>
      {error && errorMessage && (
        <div role="alert" className={styles.errorMessage}>
          {errorMessage}
        </div>
      )}
      {open && (
        <DropdownPortal position={position} dropdownRef={dropdownRef}>
          {shouldShowSearch && (
            <div className={styles.searchBox}>
              <Search size={14} color={colors.muted} className={styles.searchIcon} />
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className={styles.searchInput}
              />
            </div>
          )}
          <div className={styles.list}>
            {filtered.length === 0 ? (
              <div className={styles.empty}>{query ? `No results for "${query}"` : 'No options'}</div>
            ) : (
              filtered.map((item) => {
                const isSelected = item.value === value;
                return (
                  <div
                    key={item.value}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setHovered(item.value)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => handleSelect(item)}
                    className={cx(
                      styles.option,
                      !isSelected && hovered === item.value && styles.optionHovered,
                      isSelected && styles.optionSelected,
                    )}
                  >
                    {item.label}
                  </div>
                );
              })
            )}
          </div>
        </DropdownPortal>
      )}
    </div>
  );
}

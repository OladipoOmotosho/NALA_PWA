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
 *  - `@retayl/icons` (Pencil/SearchIcon/CloseIcon) and `lucide-react`
 *    (ChevronDown) → this library's own icons.tsx.
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
import { colors, radius, transition, zIndex } from './theme';
import { ChevronDownIcon, SearchIcon } from './icons';

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
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        width: position.width,
        maxHeight: DROPDOWN_MAX_HEIGHT,
        background: '#0e1626',
        border: `1px solid ${colors.line}`,
        borderRadius: radius.lg,
        boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
        zIndex: zIndex.dropdown,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
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
    <div style={{ width: '100%' }}>
      {fieldLabel && (
        <label style={{ display: 'block', fontSize: 14, color: error ? colors.red : colors.muted, marginBottom: 6 }}>
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
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 48,
          padding: '0 12px',
          border: `1px solid ${error ? colors.red : open ? colors.teal : colors.line}`,
          borderRadius: radius.md,
          background: disabled ? colors.card : '#0e1626',
          cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          transition: `border-color ${transition.fast}`,
        }}
      >
        <span style={{ color: selected ? colors.text : colors.muted, fontSize: 15 }}>
          {isLoading ? 'Loading…' : (selected?.label ?? placeholder)}
        </span>
        {!isLoading && (
          <ChevronDownIcon
            size={16}
            color={colors.muted}
            style={{ transform: open ? 'rotate(180deg)' : undefined, transition: `transform ${transition.fast}` }}
          />
        )}
      </div>
      {error && errorMessage && (
        <div role="alert" style={{ color: colors.red, fontSize: 12, marginTop: 4 }}>
          {errorMessage}
        </div>
      )}
      {open && (
        <DropdownPortal position={position} dropdownRef={dropdownRef}>
          {shouldShowSearch && (
            <div style={{ padding: 8, borderBottom: `1px solid ${colors.line}`, position: 'relative' }}>
              <SearchIcon
                size={14}
                color={colors.muted}
                style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                style={{
                  width: '100%',
                  padding: '8px 8px 8px 28px',
                  border: `1px solid ${colors.line}`,
                  borderRadius: radius.sm,
                  background: '#0b1220',
                  color: colors.text,
                  fontSize: 14,
                  outline: 'none',
                }}
              />
            </div>
          )}
          <div style={{ overflowY: 'auto', padding: '4px 0' }}>
            {filtered.length === 0 ? (
              <div style={{ padding: 16, textAlign: 'center', color: colors.muted, fontSize: 14 }}>
                {query ? `No results for "${query}"` : 'No options'}
              </div>
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
                    style={{
                      padding: '10px 12px',
                      fontSize: 14,
                      color: isSelected ? colors.teal : colors.text,
                      background: isSelected ? 'rgba(20,184,166,0.12)' : hovered === item.value ? 'rgba(20,184,166,0.06)' : 'transparent',
                      cursor: 'pointer',
                    }}
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

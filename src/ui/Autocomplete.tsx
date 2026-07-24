/**
 * Adapted from Retayl's RetaylAutocomplete (+ Dropdown/Hooks/Styles —
 * four files consolidated into one). The original is built for a
 * "type to search (server-side, debounced), click to add" workflow: the
 * query clears back to empty after a selection, because the selected item
 * becomes a separate chip/tag elsewhere, not the input's own value.
 *
 * That's the wrong shape for this app's actual use case (the Parent Asset
 * field): free text where the local, static, ~18-item Details-sheet list
 * is just a helpful suggestion, and the typed text itself IS the field
 * value. So this version is a controlled `value`/`onChangeText` text input
 * with a filtered local suggestion list — no debounce, no server `onSearch`,
 * no `minSearchLength`, since there's nothing async to wait on. Keyboard
 * navigation (↑/↓/Enter/Escape) is kept from the original; it's good UX
 * and cost nothing extra to carry over.
 *
 * See internal-docs/technical-documentation/Autocomplete.md.
 */
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { colors } from './theme';
import { Search } from 'lucide-react';
import { cx } from './cx';
import styles from './Autocomplete.module.css';

export interface AutocompleteProps {
  value: string;
  onChangeText: (text: string) => void;
  suggestions: readonly string[];
  fieldLabel?: string;
  placeholder?: string;
  disabled?: boolean;
}

const MAX_SUGGESTIONS = 8;

export function Autocomplete({ value, onChangeText, suggestions, fieldLabel, placeholder, disabled = false }: AutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const inputId = `autocomplete-${useId()}`;

  const filtered = useMemo(() => {
    const q = value.trim().toLowerCase();
    const pool = q ? suggestions.filter((s) => s.toLowerCase().includes(q)) : suggestions;
    return pool.slice(0, MAX_SUGGESTIONS);
  }, [value, suggestions]);

  const updatePosition = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPosition({ top: rect.bottom + 4, left: rect.left, width: rect.width });
  };

  const openDropdown = () => {
    if (disabled) return;
    updatePosition();
    setOpen(true);
  };
  const closeDropdown = () => {
    setOpen(false);
    setHovered(null);
  };

  useEffect(() => {
    if (!open) return;
    const onOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (containerRef.current?.contains(target) || dropdownRef.current?.contains(target)) return;
      closeDropdown();
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, [open]);

  const select = (s: string) => {
    onChangeText(s);
    closeDropdown();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!open) return;
    if (e.key === 'Escape') closeDropdown();
    else if (e.key === 'Enter' && hovered !== null && filtered[hovered]) {
      e.preventDefault();
      select(filtered[hovered]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHovered((h) => (h === null || h >= filtered.length - 1 ? 0 : h + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHovered((h) => (h === null || h <= 0 ? filtered.length - 1 : h - 1));
    }
  };

  return (
    <div ref={containerRef} className={styles.container}>
      {fieldLabel && (
        <label htmlFor={inputId} className={styles.label}>
          {fieldLabel}
        </label>
      )}
      <div className={styles.inputRow}>
        <Search size={14} color={colors.muted} className={styles.searchIcon} />
        <input
          id={inputId}
          type="text"
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(e) => {
            onChangeText(e.target.value);
            if (!open) openDropdown();
          }}
          onFocus={openDropdown}
          onKeyDown={handleKeyDown}
          className={cx(styles.input, disabled && styles.inputDisabled)}
        />
      </div>
      {open &&
        filtered.length > 0 &&
        createPortal(
          <div
            ref={dropdownRef}
            role="listbox"
            className={styles.dropdown}
            style={{ position: 'fixed', top: position.top, left: position.left, width: position.width }}
          >
            {filtered.map((s, i) => (
              <div
                key={s}
                role="option"
                aria-selected={i === hovered}
                onMouseEnter={() => setHovered(i)}
                onClick={() => select(s)}
                className={cx(styles.option, i === hovered && styles.optionHovered)}
              >
                {s}
              </div>
            ))}
          </div>,
          document.body,
        )}
    </div>
  );
}

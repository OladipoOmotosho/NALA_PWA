/**
 * RetaylStatusDropdown
 *
 * Generic status dropdown for web tables.
 * Uses semantic Tailwind classes for automatic light/dark mode support.
 * No hardcoded colors — all styling flows through CSS variables.
 *
 * @module packages/components/src/lib/shared/RetaylStatusDropdown
 */

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import RetaylStatusBadge from './RetaylStatusBadge';
import type { StatusVariant } from './RetaylStatusBadge';
import { ChevronDown } from 'lucide-react';
import { useTheme } from '@retayl/hooks';

/** Semantic status configuration using design system variants */
export interface StatusConfig {
  /** Semantic variant for automatic theme-aware coloring */
  variant: StatusVariant;
}

/** Generic dropdown option with optional status styling */
export interface DropdownOption<T = string> {
  /** Option value */
  value: T;
  /** Display label */
  label: string;
  /** Optional semantic status config */
  config?: StatusConfig;
}

/** Props for RetaylStatusDropdown */
interface RetaylStatusDropdownProps<T = string> {
  /** Currently selected value */
  currentValue: T;
  /** Available options */
  options: DropdownOption<T>[];
  /** Callback when value changes */
  onValueChange: (newValue: T) => void;
  /** Close dropdown after selection (default: true) */
  closeOnSelect?: boolean;
  /** Disable the dropdown */
  disabled?: boolean;
  /** Placeholder when no value selected */
  placeholder?: string;
  /** Accessibility label */
  ariaLabel?: string;
  /** Element id */
  id?: string;
  /** Positioning preferences */
  positioning?: {
    preferredVertical?: 'above' | 'below' | 'auto';
    offset?: { x?: number; y?: number };
  };
}

/** Estimated height per option for position calculation */
const OPTION_HEIGHT_ESTIMATE = 36;
/** Padding around options list */
const DROPDOWN_PADDING = 8;
/** Gap between trigger and dropdown */
const DROPDOWN_GAP = 4;
/** Chevron icon style — static, avoids recreating per render */
const CHEVRON_STYLE: React.CSSProperties = { opacity: 0.6 };

/** Position result for dropdown placement */
interface DropdownPosition {
  top?: number;
  bottom?: number;
}

/**
 * Calculates vertical position for the dropdown menu.
 *
 * @param triggerRect - Trigger element measurements
 * @param optionCount - Number of options
 * @param preferredVertical - Preferred direction
 * @param offsetY - Vertical offset
 * @returns Position object with top or bottom
 */
function calcVerticalPosition(
  triggerRect: { height: number; bottom: number; top: number },
  optionCount: number,
  preferredVertical: 'above' | 'below' | 'auto',
  offsetY: number,
): DropdownPosition {
  const estHeight = optionCount * OPTION_HEIGHT_ESTIMATE + DROPDOWN_PADDING;
  const spaceBelow = window.innerHeight - triggerRect.bottom;
  const spaceAbove = triggerRect.top;
  const gap = offsetY || DROPDOWN_GAP;

  if (
    preferredVertical === 'above' ||
    (preferredVertical === 'auto' &&
      spaceBelow < estHeight &&
      spaceAbove >= estHeight)
  ) {
    return { bottom: triggerRect.height + gap };
  }
  return { top: triggerRect.height + gap };
}

/** Props for the dropdown trigger button */
interface TriggerProps {
  label: string;
  variant: StatusVariant;
  isOpen: boolean;
  disabled: boolean;
  ariaLabel?: string;
  onToggle: () => void;
}

/**
 * Trigger button — renders a RetaylStatusBadge with a chevron indicator.
 * Uses the shared design system badge for consistent rendering across tables.
 */
const DropdownTrigger: React.FC<TriggerProps> = ({
  label,
  variant,
  isOpen,
  disabled,
  ariaLabel,
  onToggle,
}) => (
  <button
    type='button'
    className='flex items-center gap-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
    onClick={onToggle}
    disabled={disabled}
    aria-label={ariaLabel}
    aria-haspopup='listbox'
    aria-expanded={isOpen}
  >
    <RetaylStatusBadge label={label} variant={variant} size='sm' />
    <ChevronDown
      size={12}
      className='text-text-secondary'
      style={CHEVRON_STYLE}
      aria-hidden='true'
    />
  </button>
);

/** Props for individual dropdown option row */
interface DropdownItemProps<T extends string> {
  option: DropdownOption<T>;
  isSelected: boolean;
  onSelect: (value: T) => void;
}

/**
 * Individual dropdown option row.
 * Extracted to keep the main component under complexity limits.
 */
const DropdownItem = <T extends string>({
  option,
  isSelected,
  onSelect,
}: DropdownItemProps<T>) => {
  const variant: StatusVariant = option.config?.variant ?? 'neutral';

  const handleClick = useCallback(() => {
    onSelect(option.value);
  }, [onSelect, option.value]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect(option.value);
      }
    },
    [onSelect, option.value],
  );

  return (
    <div
      className={`px-3 py-1.5 cursor-pointer transition-colors hover:bg-background-secondary ${
        isSelected ? 'bg-background-secondary' : ''
      }`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role='option'
      aria-selected={isSelected}
      tabIndex={0}
    >
      <RetaylStatusBadge label={option.label} variant={variant} size='sm' />
    </div>
  );
};

/**
 * Hook to manage dropdown open/close state and positioning.
 */
function useDropdownState(
  containerRef: React.RefObject<HTMLDivElement | null>,
  dropdownRef: React.RefObject<HTMLDivElement | null>,
  optionCount: number,
  preferredVertical: 'above' | 'below' | 'auto',
  offsetY: number,
) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<DropdownPosition>({});

  const updatePosition = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPosition(
      calcVerticalPosition(rect, optionCount, preferredVertical, offsetY),
    );
  }, [containerRef, optionCount, preferredVertical, offsetY]);

  useEffect(() => {
    if (!isOpen) return;
    updatePosition();

    const onClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        !dropdownRef.current?.contains(target) &&
        !containerRef.current?.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', onClickOutside);
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, updatePosition, containerRef, dropdownRef]);

  return { isOpen, setIsOpen, position };
}

/**
 * RetaylStatusDropdown — generic status dropdown for web tables.
 *
 * Uses Tailwind semantic classes for compact, theme-aware rendering.
 * CSS variables auto-switch between light and dark mode.
 *
 * @example
 * ```tsx
 * const options = [
 *   { value: 'Active', label: 'Active', config: { variant: 'success' } },
 *   { value: 'Inactive', label: 'Inactive', config: { variant: 'error' } },
 * ];
 * <RetaylStatusDropdown
 *   currentValue="Active"
 *   options={options}
 *   onValueChange={(v) => handleChange(v)}
 * />
 * ```
 */
const RetaylStatusDropdown = <T extends string = string>({
  currentValue,
  options,
  onValueChange,
  closeOnSelect = true,
  disabled = false,
  placeholder = 'Select...',
  ariaLabel,
  id,
  positioning = {},
}: RetaylStatusDropdownProps<T>) => {
  const { colors } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { preferredVertical = 'auto', offset = {} } = positioning;

  const { isOpen, setIsOpen, position } = useDropdownState(
    containerRef,
    dropdownRef,
    options.length,
    preferredVertical,
    offset.y ?? DROPDOWN_GAP,
  );

  const handleSelect = useCallback(
    (value: T) => {
      onValueChange(value);
      if (closeOnSelect) setIsOpen(false);
    },
    [onValueChange, closeOnSelect, setIsOpen],
  );

  const toggleOpen = useCallback(() => {
    if (!disabled) setIsOpen((prev) => !prev);
  }, [disabled, setIsOpen]);

  const currentOption = options.find((opt) => opt.value === currentValue);
  const currentVariant: StatusVariant =
    currentOption?.config?.variant ?? 'neutral';

  const dropdownStyles = useMemo<React.CSSProperties>(
    () => ({
      minWidth: '160px',
      backgroundColor: colors.backgroundPrimary,
      borderColor: colors.borderLight,
      ...position,
    }),
    [colors.backgroundPrimary, colors.borderLight, position],
  );

  return (
    <div className='relative inline-block' ref={containerRef} id={id}>
      <DropdownTrigger
        label={currentOption?.label || placeholder}
        variant={currentVariant}
        isOpen={isOpen}
        disabled={disabled}
        ariaLabel={ariaLabel}
        onToggle={toggleOpen}
      />
      {isOpen ? (
        <div
          ref={dropdownRef}
          className='absolute rounded-lg shadow-lg border border-border-light z-50 py-1 overflow-y-auto'
          style={dropdownStyles}
          role='listbox'
          aria-label='Status options'
        >
          {options.map((option) => (
            <DropdownItem
              key={String(option.value)}
              option={option}
              isSelected={option.value === currentValue}
              onSelect={handleSelect}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default RetaylStatusDropdown;
export type { RetaylStatusDropdownProps };

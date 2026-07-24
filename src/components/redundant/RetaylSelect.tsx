/**
 * RetaylSelect – generic dropdown select component for web.
 * State logic: useRetaylSelect hook.
 * Memoized styles: useRetaylSelectMemoStyles hook.
 * Dropdown portal: RetaylSelectDropdown component.
 * Style definitions: RetaylSelectStyles module.
 */
import React, { useEffect, useMemo } from 'react';
import { spacing, getNextZIndex } from '@retayl/utils';
import { useTheme } from '@retayl/hooks';
import { ChevronDown } from 'lucide-react';
import type { BaseItemType, CustomSelectProps } from './RetaylSelect.types';
import { useWebStyleTag } from './useWebStyleTag';
import {
  ICON_SIZE,
  Z_INDEX_STEP,
  SEARCH_INPUT_CLASS,
  SEARCH_PLACEHOLDER_STYLE_ID,
  SCROLLBAR_WIDTH,
  SCROLLBAR_THUMB_RADIUS,
  SCROLLBAR_THUMB_ALPHA,
  SCROLLBAR_THUMB_HOVER_ALPHA,
  DARK_SCROLLBAR_THUMB_ALPHA,
  DARK_SCROLLBAR_THUMB_HOVER_ALPHA,
} from './RetaylSelectStyles';
import RetaylSelectDropdown from './RetaylSelectDropdown';
import { useRetaylSelect } from './useRetaylSelect';
import { useSelectMemoStyles } from './useRetaylSelectMemoStyles';

export type {
  BaseItemType,
  CustomSelectProps,
  AddMoreOptionsProps,
  IconPosition,
} from './RetaylSelect.types';

/** Resolves dropdown z-index based on rendering context */
const getDropdownZIndex = (
  customZIndex?: number,
  context: 'modal' | 'drawer' | 'default' = 'default',
): number => {
  if (customZIndex !== undefined) return customZIndex;
  const ctxMap: Record<string, 'modal' | 'overlay'> = {
    modal: 'modal',
    drawer: 'overlay',
    default: 'modal',
  };
  return getNextZIndex(ctxMap[context] ?? 'modal', Z_INDEX_STEP);
};

const SCROLLBAR_CSS = [
  '.retayl-scrollbar-hidden::-webkit-scrollbar{display:none}',
  '.retayl-scrollbar-hidden{-ms-overflow-style:none;scrollbar-width:none}',
  `.retayl-scrollbar-styled::-webkit-scrollbar{width:${SCROLLBAR_WIDTH}px}`,
  '.retayl-scrollbar-styled::-webkit-scrollbar-track{background:transparent}',
  `.retayl-scrollbar-styled::-webkit-scrollbar-thumb{background:rgba(0,0,0,${SCROLLBAR_THUMB_ALPHA});border-radius:${SCROLLBAR_THUMB_RADIUS}px}`,
  `.retayl-scrollbar-styled::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,${SCROLLBAR_THUMB_HOVER_ALPHA})}`,
  `.retayl-scrollbar-styled{scrollbar-width:thin;scrollbar-color:rgba(0,0,0,${SCROLLBAR_THUMB_ALPHA}) transparent}`,
  `.dark .retayl-scrollbar-styled::-webkit-scrollbar-thumb{background:rgba(255,255,255,${DARK_SCROLLBAR_THUMB_ALPHA})}`,
  `.dark .retayl-scrollbar-styled::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,${DARK_SCROLLBAR_THUMB_HOVER_ALPHA})}`,
  `.dark .retayl-scrollbar-styled{scrollbar-color:rgba(255,255,255,${DARK_SCROLLBAR_THUMB_ALPHA}) transparent}`,
].join('\n');

/** Decrements or removes a ref-counted style element */
const decrementStyleRef = (styleId: string) => {
  const el = document.getElementById(styleId);
  if (!el) return;
  const c = parseInt(el.getAttribute('data-ref-count') ?? '0', 10) || 0;
  if (c <= 1) el.remove();
  else el.setAttribute('data-ref-count', String(c - 1));
};

/** Injects shared scrollbar CSS (ref-counted across instances) */
const useScrollbarStyles = () => {
  useEffect(() => {
    const sid = 'retayl-select-scrollbar-styles';
    const existing = document.getElementById(sid);
    if (existing) {
      const prev =
        parseInt(existing.getAttribute('data-ref-count') ?? '0', 10) || 0;
      existing.setAttribute('data-ref-count', String(prev + 1));
      return () => decrementStyleRef(sid);
    }
    const el = document.createElement('style');
    el.id = sid;
    el.setAttribute('data-ref-count', '1');
    el.textContent = SCROLLBAR_CSS;
    document.head.appendChild(el);
    return () => decrementStyleRef(sid);
  }, []);
};

/** Props for the trigger sub-component */
interface SelectTriggerProps {
  selectRef: React.RefObject<HTMLDivElement | null>;
  triggerStyle: React.CSSProperties;
  onClick: () => void;
  readOnly: boolean;
  showDropdown: boolean;
  fieldLabel?: string;
  resolvedError: boolean;
  showPlaceholder: boolean;
  placeholderStyle: React.CSSProperties;
  textColorStyle: React.CSSProperties;
  isLoading: boolean;
  displayedLabel: string;
  placeholder: string;
  iconContainerStyle: React.CSSProperties;
  suffixText?: string;
  suffixStyle: React.CSSProperties;
  icon?: React.ReactNode;
  chevronStyle: React.CSSProperties;
  chevronColor: string;
  loadingStyle: React.CSSProperties;
}

/** Memoized trigger button */
const SelectTrigger = React.memo<SelectTriggerProps>(
  ({
    selectRef,
    triggerStyle,
    onClick,
    readOnly,
    showDropdown,
    fieldLabel,
    resolvedError,
    showPlaceholder,
    placeholderStyle,
    textColorStyle,
    isLoading,
    displayedLabel,
    placeholder,
    iconContainerStyle,
    suffixText,
    suffixStyle,
    icon,
    chevronStyle,
    chevronColor,
    loadingStyle,
  }) => (
    <div
      ref={selectRef}
      style={triggerStyle}
      onClick={onClick}
      tabIndex={readOnly ? -1 : 0}
      role='combobox'
      aria-expanded={showDropdown}
      aria-haspopup='listbox'
      aria-label={fieldLabel}
      aria-invalid={resolvedError || undefined}
    >
      <div style={showPlaceholder ? placeholderStyle : textColorStyle}>
        {isLoading ? 'Loading...' : displayedLabel || placeholder}
      </div>
      <div style={iconContainerStyle}>
        {suffixText ? <div style={suffixStyle}>{suffixText}</div> : null}
        {!isLoading && icon ? <div>{icon}</div> : null}
        {!isLoading && (
          <ChevronDown
            size={ICON_SIZE}
            color={chevronColor}
            style={chevronStyle}
          />
        )}
        {isLoading ? <div style={loadingStyle}>...</div> : null}
      </div>
    </div>
  ),
);

SelectTrigger.displayName = 'SelectTrigger';

/** Applies default values to select props */
const resolveDefaults = <T extends BaseItemType>(
  props: CustomSelectProps<T>,
) => ({
  placeholder: props.placeholder ?? 'Select an option',
  fieldLabel: props.fieldLabel,
  width: props.width ?? '100%',
  height: props.height ?? spacing.xl,
  containerStyle: props.containerStyle,
  borderColor: props.borderColor,
  readOnly: props.readOnly ?? false,
  errorMessage: props.errorMessage,
  required: props.required ?? false,
  hasHeader: props.hasHeader ?? false,
  headerText: props.headerText ?? '',
  onHeaderClick: props.onHeaderClick,
  suffixText: props.suffixText,
  icon: props.icon,
  iconPosition: props.iconPosition ?? ('right' as const),
  addMoreOptions: props.addMoreOptions,
  isLoading: props.isLoading ?? false,
  searchPlaceholder: props.searchPlaceholder ?? 'Search...',
  modalTitle: props.modalTitle,
  scrollbarStyle: props.scrollbarStyle ?? ('styled' as const),
  dropdownZIndex: props.dropdownZIndex,
  dropdownContext: props.dropdownContext ?? ('default' as const),
  onSearch: props.onSearch,
  isSearching: props.isSearching ?? false,
});

export const RetaylSelect = <T extends BaseItemType>(
  props: CustomSelectProps<T>,
): React.ReactElement => {
  const p = resolveDefaults(props);
  const { colors } = useTheme();
  const borderClr = p.borderColor || colors.borderLight;
  useWebStyleTag({
    id: SEARCH_PLACEHOLDER_STYLE_ID,
    cssText: `.${SEARCH_INPUT_CLASS}::placeholder{color:${colors.textPlaceholder}!important;-webkit-text-fill-color:${colors.textPlaceholder}!important;opacity:1!important}html.dark .${SEARCH_INPUT_CLASS}::placeholder{color:${colors.textPlaceholder}!important;-webkit-text-fill-color:${colors.textPlaceholder}!important;opacity:1!important}`,
  });
  useScrollbarStyles();
  const s = useRetaylSelect<T>(props);
  const zIdx = useMemo(
    () => getDropdownZIndex(p.dropdownZIndex, p.dropdownContext),
    [p.dropdownZIndex, p.dropdownContext],
  );
  const m = useSelectMemoStyles({
    colors,
    resolvedError: s.resolvedError,
    effectiveBorderColor: borderClr,
    readOnly: p.readOnly,
    isLoading: p.isLoading,
    height: p.height,
    dropdownPosition: s.dropdownPosition,
    dropdownZIndexValue: zIdx,
    width: p.width,
    containerStyle: p.containerStyle,
    showDropdown: s.showDropdown,
    searchQuery: s.searchQuery,
    scrollbarStyle: p.scrollbarStyle,
  });
  return (
    <div style={m.containerMergedStyle}>
      {p.fieldLabel ? (
        <div style={m.styles.labelRow}>
          <label style={m.styles.label}>
            {p.fieldLabel}
            {p.required ? ' *' : null}
          </label>
        </div>
      ) : null}
      <SelectTrigger
        selectRef={s.selectRef}
        triggerStyle={m.triggerStyle}
        onClick={s.handleTriggerClick}
        readOnly={p.readOnly}
        showDropdown={s.showDropdown}
        fieldLabel={p.fieldLabel}
        resolvedError={s.resolvedError}
        showPlaceholder={s.showPlaceholder}
        placeholderStyle={m.styles.placeholder}
        textColorStyle={m.textColorStyle}
        isLoading={p.isLoading}
        displayedLabel={s.displayedLabel}
        placeholder={p.placeholder}
        iconContainerStyle={m.styles.iconContainer}
        suffixText={p.suffixText}
        suffixStyle={m.suffixStyle}
        icon={p.icon}
        chevronStyle={m.chevronStyle}
        chevronColor={colors.textTertiary}
        loadingStyle={m.loadingStyle}
      />
      {s.resolvedError && p.errorMessage ? (
        <div style={m.styles.errorText}>{p.errorMessage}</div>
      ) : null}
      {s.showDropdown ? (
        <RetaylSelectDropdown<T>
          dropdownRef={s.dropdownRef}
          styles={m.styles}
          modalTitle={p.modalTitle}
          shouldShowSearch={s.shouldShowSearch}
          searchInputRef={s.searchInputRef}
          searchQuery={s.searchQuery}
          onSearchQueryChange={s.setSearchQuery}
          searchPlaceholder={p.searchPlaceholder}
          searchInputStyle={m.searchInputStyle}
          hasHeader={p.hasHeader}
          headerText={p.headerText}
          onHeaderClick={p.onHeaderClick}
          closeDropdown={s.closeDropdown}
          addMoreOptions={p.addMoreOptions}
          filteredItems={s.filteredItems}
          currentValue={s.currentValue}
          hoveredItemValue={s.hoveredItemValue}
          onHoverItem={s.setHoveredItemValue}
          onSelectItem={s.handleSelectItem}
          normalizeValue={s.normalizeValue}
          scrollbarClassName={m.scrollbarCls}
          isSearching={p.isSearching}
          onSearch={p.onSearch}
          iconPosition={p.iconPosition}
          headerActionStyle={m.headerActionStyle}
          headerActionTextStyle={m.headerTextStyle}
          addMoreStyle={m.addMoreStyle}
          addMoreTextStyle={m.addMoreTextStyle}
        />
      ) : null}
    </div>
  );
};

export default RetaylSelect;

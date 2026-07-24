/**
 * Individual option item for RetaylSelect dropdown.
 * Extracted as a memoized sub-component so each item can define
 * its own useCallback handlers without violating react-perf rules.
 */
import React, { useCallback, useMemo } from 'react';
import { spacing, radius } from '@retayl/utils';
import type { BaseItemType, IconPosition } from './RetaylSelect.types';
import { SELECT_CONSTANTS } from './RetaylSelectStyles';

/** Props for a single option row */
interface RetaylSelectOptionItemProps<T extends BaseItemType> {
  item: T;
  isSelected: boolean;
  itemKey: string;
  isHovered: boolean;
  onHoverItem: (value: string | null) => void;
  onSelectItem: (value: T['value'], label: string) => void;
  iconPosition: IconPosition;
  optionStyle: React.CSSProperties;
  optionSelectedStyle: React.CSSProperties;
  optionHoverStyle: React.CSSProperties;
}

/** Shared static styles for option icons and images */
const ICON_MARGIN_RIGHT = { marginRight: `${spacing.xs}px` };
const ICON_MARGIN_LEFT = { marginLeft: `${spacing.xs}px` };
const FLEX_ONE: React.CSSProperties = { flex: 1 };
const IMAGE_STYLE_RIGHT = {
  width: SELECT_CONSTANTS.IMAGE_SIZE,
  height: SELECT_CONSTANTS.IMAGE_SIZE,
  marginLeft: `${spacing.xs}px`,
  borderRadius: `${radius.sm}px`,
  objectFit: 'cover' as const,
};
const IMAGE_STYLE_LEFT = {
  width: SELECT_CONSTANTS.IMAGE_SIZE,
  height: SELECT_CONSTANTS.IMAGE_SIZE,
  marginRight: `${spacing.xs}px`,
  borderRadius: `${radius.sm}px`,
  objectFit: 'cover' as const,
};

/** Builds the merged style for an option row */
const useMergedOptionStyle = (
  optionStyle: React.CSSProperties,
  optionSelectedStyle: React.CSSProperties,
  optionHoverStyle: React.CSSProperties,
  isSelected: boolean,
  isHovered: boolean,
) =>
  useMemo<React.CSSProperties>(
    () => ({
      ...optionStyle,
      ...(isSelected ? optionSelectedStyle : {}),
      ...(!isSelected && isHovered ? optionHoverStyle : {}),
    }),
    [optionStyle, optionSelectedStyle, optionHoverStyle, isSelected, isHovered],
  );

/** Memoized option row – avoids inline callbacks in the parent map */
function RetaylSelectOptionItemInner<T extends BaseItemType>(
  props: RetaylSelectOptionItemProps<T>,
) {
  const {
    item,
    isSelected,
    itemKey,
    isHovered,
    onHoverItem,
    onSelectItem,
    iconPosition,
    optionStyle,
    optionSelectedStyle,
    optionHoverStyle,
  } = props;

  const handleMouseEnter = useCallback(() => {
    if (!isSelected) onHoverItem(itemKey);
  }, [isSelected, onHoverItem, itemKey]);
  const handleMouseLeave = useCallback(() => onHoverItem(null), [onHoverItem]);
  const handleClick = useCallback(
    () => onSelectItem(item.value, item.label),
    [onSelectItem, item.value, item.label],
  );
  const mergedStyle = useMergedOptionStyle(
    optionStyle,
    optionSelectedStyle,
    optionHoverStyle,
    isSelected,
    isHovered,
  );

  return (
    <div
      style={mergedStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {iconPosition === 'left' && item.icon ? (
        <div style={ICON_MARGIN_RIGHT}>{item.icon}</div>
      ) : null}
      {iconPosition === 'left' && item.image ? (
        <img
          src={item.image as unknown as string}
          alt={item.label}
          style={IMAGE_STYLE_LEFT}
        />
      ) : null}
      <div style={FLEX_ONE}>{item.label}</div>
      {iconPosition === 'right' && item.icon ? (
        <div style={ICON_MARGIN_LEFT}>{item.icon}</div>
      ) : null}
      {iconPosition === 'right' && item.image ? (
        <img
          src={item.image as unknown as string}
          alt={item.label}
          style={IMAGE_STYLE_RIGHT}
        />
      ) : null}
    </div>
  );
}

RetaylSelectOptionItemInner.displayName = 'RetaylSelectOptionItem';

const RetaylSelectOptionItem = React.memo(
  RetaylSelectOptionItemInner,
) as typeof RetaylSelectOptionItemInner;

export default RetaylSelectOptionItem;

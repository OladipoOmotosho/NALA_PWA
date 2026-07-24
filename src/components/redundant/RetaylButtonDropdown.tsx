import React, { useCallback, useMemo, memo } from 'react';
import {
  View,
  Pressable,
  FlatList,
  StyleSheet,
  type DimensionValue,
  type PressableStateCallbackType,
  type StyleProp,
} from 'react-native';
import RetaylText from './RetaylText';
import { constants, fontSize } from '@retayl/utils';
import { FONTFAMILY } from '@retayl/fonts';
import { useTheme } from '@retayl/hooks';
import type { ExtendedViewStyle } from './RetaylButton';

type HoverablePressableState = PressableStateCallbackType & {
  hovered?: boolean;
};

interface DropdownItem {
  label: string;
  value: string;
}

interface DropdownItemRowProps {
  item: DropdownItem;
  itemStyle?: StyleProp<ExtendedViewStyle>;
  textColor: string;
  onPress: (label: string) => void;
}

/** Memoized dropdown item row */
const DropdownItemRow = memo<DropdownItemRowProps>(
  ({ item, itemStyle, textColor, onPress }) => {
    const handlePress = useCallback(
      () => onPress(item.label),
      [onPress, item.label],
    );
    const resolveStyle = useCallback(
      ({ hovered }: HoverablePressableState) => [
        styles.dropdownItem,
        hovered ? styles.dropdownItemHovered : null,
        itemStyle,
      ],
      [itemStyle],
    );
    return (
      <Pressable style={resolveStyle} onPress={handlePress}>
        <RetaylText text={item.label} size={fontSize.sm} color={textColor} />
      </Pressable>
    );
  },
);
DropdownItemRow.displayName = 'DropdownItemRow';

interface RetaylButtonDropdownProps {
  dropdownRef: React.RefObject<React.ElementRef<typeof View> | null>;
  dropdownData: DropdownItem[];
  dropdownLayout: { left: number; width: number; maxContentWidth: number };
  dropdownContainerStyle?: StyleProp<ExtendedViewStyle>;
  dropdownItemStyle?: StyleProp<ExtendedViewStyle>;
  onItemClick?: (label: string) => void;
  onClose: () => void;
  minWidth: number;
}

/** Dropdown menu rendered below a RetaylButton when type is 'buttonDropdown' */
const RetaylButtonDropdown: React.FC<RetaylButtonDropdownProps> = ({
  dropdownRef,
  dropdownData,
  dropdownLayout,
  dropdownContainerStyle,
  dropdownItemStyle,
  onItemClick,
  onClose,
  minWidth,
}) => {
  const { colors: themeColors } = useTheme();

  const containerStyle = useMemo(
    () => [
      styles.dropdown,
      {
        left: dropdownLayout.left,
        width: (dropdownLayout.width !== 0
          ? dropdownLayout.width
          : 'auto') as DimensionValue,
        minWidth: Math.min(minWidth, dropdownLayout.maxContentWidth),
      },
      dropdownContainerStyle,
    ],
    [dropdownLayout, minWidth, dropdownContainerStyle],
  );

  const keyExtractor = useCallback(
    (item: DropdownItem, index: number) => `${item.value}-${index}`,
    [],
  );

  const handleItemPress = useCallback(
    (label: string) => {
      onClose();
      if (onItemClick) onItemClick(label);
    },
    [onClose, onItemClick],
  );

  const renderItem = useCallback(
    ({ item }: { item: DropdownItem }) => (
      <DropdownItemRow
        item={item}
        itemStyle={dropdownItemStyle}
        textColor={themeColors.textSecondary}
        onPress={handleItemPress}
      />
    ),
    [dropdownItemStyle, themeColors.textSecondary, handleItemPress],
  );

  return (
    <View ref={dropdownRef} style={containerStyle}>
      <FlatList
        data={dropdownData}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
    </View>
  );
};

/* eslint-disable retayl/no-hardcoded-colors -- Static StyleSheet with decorative/shadow colors */
/* eslint-disable retayl/enforce-design-token-spacing -- Static StyleSheet with fixed layout values */
const styles = StyleSheet.create({
  dropdown: {
    position: 'absolute',
    top: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: constants.INPUT_BORDER_RADIUS,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    fontSize: 14,
    fontFamily: FONTFAMILY.medium,
    color: '#6B7280',
    maxWidth: 300,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: FONTFAMILY.medium,
    color: '#6B7280',
  },
  dropdownItemHovered: {
    backgroundColor: '#F0F0F0',
    borderRadius: constants.INPUT_BORDER_RADIUS,
  },
});
/* eslint-enable retayl/no-hardcoded-colors */
/* eslint-enable retayl/enforce-design-token-spacing */

export default RetaylButtonDropdown;

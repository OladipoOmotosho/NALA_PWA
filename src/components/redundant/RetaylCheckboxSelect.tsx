import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  ViewStyle,
  DimensionValue,
  FlatList,
  TextStyle,
} from 'react-native';
import { constants, spacing, fontSize, shadows } from '@retayl/utils';
import { useTheme } from '@retayl/hooks';
import RetaylCheckbox from './RetaylCheckbox';
import RetaylText from './RetaylText';
import { FONTFAMILY } from '@retayl/fonts';
import AnimatedLabel from './AnimatedLabel';
import { Addcircle, ArrowDown, Pencil } from '@retayl/icons';

const mapTextStyleToCss = (
  style?: TextStyle,
): React.CSSProperties | undefined => {
  if (!style) return undefined;
  const flattened = StyleSheet.flatten(style);
  if (!flattened) return undefined;

  const cssStyle: React.CSSProperties = {};

  if (typeof flattened.color === 'string') {
    cssStyle.color = flattened.color;
  }
  if (typeof flattened.fontSize === 'number') {
    cssStyle.fontSize = `${flattened.fontSize}px`;
  }
  if (typeof flattened.fontFamily === 'string') {
    cssStyle.fontFamily = flattened.fontFamily;
  }
  if (
    typeof flattened.fontWeight === 'string' ||
    typeof flattened.fontWeight === 'number'
  ) {
    cssStyle.fontWeight =
      flattened.fontWeight as React.CSSProperties['fontWeight'];
  }
  if (typeof flattened.lineHeight === 'number') {
    cssStyle.lineHeight = `${flattened.lineHeight}px`;
  }
  if (typeof flattened.letterSpacing === 'number') {
    cssStyle.letterSpacing = `${flattened.letterSpacing}px`;
  }
  if (typeof flattened.textTransform === 'string') {
    cssStyle.textTransform = flattened.textTransform;
  }
  if (typeof flattened.textDecorationLine === 'string') {
    cssStyle.textDecoration = flattened.textDecorationLine;
  }
  if (typeof flattened.fontStyle === 'string') {
    cssStyle.fontStyle = flattened.fontStyle;
  }
  if (typeof flattened.textAlign === 'string') {
    cssStyle.textAlign =
      flattened.textAlign as React.CSSProperties['textAlign'];
  }

  return Object.keys(cssStyle).length ? cssStyle : undefined;
};

type AddNewGroupProps = {
  text: string;
  onClick: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
};

type CustomSelectProps = {
  placeholder?: string;
  onChange?: (value: string[]) => void;
  value?: string[];
  items: Array<{ label: string; value: string }>;
  width?: DimensionValue;
  height?: number;
  containerStyle?: ViewStyle;
  borderColor?: string;
  autoFocus?: boolean;
  error?: boolean;
  errorMessage?: string;
  required?: boolean;
  readOnly?: boolean;
  hasHeader?: boolean;
  headerText?: string;
  onHeaderClick?: () => void;
  disabledItems?: string[];
  addNewGroup?: AddNewGroupProps;
};

// CheckboxSelect constants
const CHECKBOX_SELECT_DEFAULTS = {
  DEFAULT_HEIGHT: 40, // Default container height
  DIVIDER: 2, // For centering calculations
} as const;

export const RetaylCheckboxSelect = ({
  placeholder = 'Select an option',
  value = [],
  width = '100%',
  height = CHECKBOX_SELECT_DEFAULTS.DEFAULT_HEIGHT,
  containerStyle,
  borderColor,
  onChange,
  readOnly = false,
  error = false,
  errorMessage,
  required = false,
  items,
  hasHeader = false,
  headerText = '',
  onHeaderClick,
  disabledItems = [],
  addNewGroup,
}: CustomSelectProps): React.ReactElement => {
  const { colors } = useTheme();
  const appliedBorderColor = borderColor ?? colors.borderLight;
  const [isFocused, setIsFocused] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>(value);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const addNewGroupTextStyle = mapTextStyleToCss(addNewGroup?.textStyle);

  // Sync state if external `value` prop changes
  useEffect(() => {
    if (!isTouched) {
      setSelectedValues(value);
    }
  }, [value, isTouched]);

  // Notify parent on internal changes
  useEffect(() => {
    if (isTouched) {
      onChange?.(selectedValues);
    }
  }, [selectedValues, isTouched, onChange]);

  const handleSelectItem = (itemValue: string) => {
    if (readOnly || disabledItems.includes(itemValue)) return;

    setIsTouched(true);
    setSelectedValues((prev) =>
      prev.includes(itemValue)
        ? prev.filter((v) => v !== itemValue)
        : [...prev, itemValue],
    );
  };

  const toggleDropdown = () => {
    if (!readOnly) {
      setShowDropdown((prev) => !prev);
      setIsFocused((prev) => !prev);
    }
  };

  const closeDropdown = () => {
    setShowDropdown(false);
    setIsFocused(false);
  };

  const headerClickAction = () => {
    closeDropdown();
    onHeaderClick?.();
  };

  const handleAddNewGroup = () => {
    closeDropdown();
    addNewGroup?.onClick();
  };

  const displayText =
    selectedValues.length > 0
      ? selectedValues
          .map((val) => items.find((item) => item.value === val)?.label)
          .filter(Boolean)
          .join(', ')
      : placeholder;

  return (
    <View>
      <View style={containerStyle}>
        {(isFocused || selectedValues.length > 0) && (
          <View style={styles.placeholderContainer}>
            <AnimatedLabel
              isFocused={isFocused}
              hasValue={selectedValues.length > 0}
              placeholder={placeholder}
              required={required}
            />
          </View>
        )}

        <Pressable
          onPress={toggleDropdown}
          style={[
            styles.selectContainer,
            {
              borderColor: isFocused ? colors.primary : appliedBorderColor,
              width,
              height,
            },
          ]}
        >
          <RetaylText
            text={displayText}
            style={
              !selectedValues.length
                ? { ...styles.placeholder, color: colors.textSecondary }
                : undefined
            }
          />
          <ArrowDown />
        </Pressable>

        {showDropdown && (
          <View
            style={[
              styles.dropdown,
              { width, backgroundColor: colors.backgroundPrimary },
            ]}
          >
            {addNewGroup && (
              <Pressable
                style={[
                  styles.addNewGroupContainer,
                  { borderBottomColor: colors.borderLight },
                  addNewGroup.style,
                ]}
                onPress={handleAddNewGroup}
              >
                <View style={styles.addNewGroupContent}>
                  {addNewGroup.icon || <Addcircle />}
                  <RetaylText
                    text={addNewGroup.text}
                    style={{
                      ...styles.addNewGroupText,
                      color: colors.primary as string,
                      ...(addNewGroupTextStyle || {}),
                    }}
                  />
                </View>
              </Pressable>
            )}

            {hasHeader && (
              <Pressable
                style={[
                  styles.dropdownItem,
                  {
                    flexDirection: 'row',
                    backgroundColor: colors.primaryLight,
                    alignItems: 'center',
                  },
                ]}
                onPress={headerClickAction}
              >
                <View style={{ marginRight: 6 }}>
                  <Pencil />
                </View>
                <RetaylText
                  text={headerText}
                  style={{ color: colors.primary }}
                />
              </Pressable>
            )}

            <FlatList
              data={items}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable
                  style={[
                    styles.dropdownItem,
                    disabledItems.includes(item.value) && styles.disabledItem,
                  ]}
                  onPress={() => handleSelectItem(item.value)}
                >
                  <RetaylCheckbox
                    label={item.label}
                    isChecked={selectedValues.includes(item.value)}
                    onToggle={() => handleSelectItem(item.value)}
                    disabled={disabledItems.includes(item.value)}
                  />
                </Pressable>
              )}
            />
          </View>
        )}
      </View>

      {error && (
        <RetaylText
          style={{ ...styles.errorText, color: colors.error }}
          text={errorMessage}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  placeholderContainer: {
    left: spacing.xs,
    zIndex: 1,
  },
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: constants.INPUT_BORDER_RADIUS,
    paddingHorizontal: spacing.sm,
  },
  dropdown: {
    position: 'absolute',
    top: spacing.md * CHECKBOX_SELECT_DEFAULTS.DIVIDER,
    left: 0,
    right: 0,
    borderRadius: constants.INPUT_BORDER_RADIUS,
    zIndex: 1000,
    ...shadows.md,
  },
  dropdownItem: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  errorText: {
    fontSize: fontSize.sm,
    marginTop: spacing.xs / CHECKBOX_SELECT_DEFAULTS.DIVIDER,
  },
  placeholder: {
    fontFamily: FONTFAMILY.regular,
  },
  disabledItem: {
    opacity: 0.5,
  },
  addNewGroupContainer: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  addNewGroupContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addNewGroupText: {
    marginLeft: spacing.xs,
    fontFamily: FONTFAMILY.medium,
  },
});

export default RetaylCheckboxSelect;

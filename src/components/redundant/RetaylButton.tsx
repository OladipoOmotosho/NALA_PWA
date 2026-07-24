import React, {
  FunctionComponent,
  useState,
  useCallback,
  useMemo,
} from 'react';
import {
  StyleSheet,
  Pressable,
  GestureResponderEvent,
  View,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
  type PressableStateCallbackType,
} from 'react-native';
import RetaylText from './RetaylText';
import { fontSize, buttonFontSize } from '@retayl/utils';
import { useTheme } from '@retayl/hooks';
import RetaylButtonContent from './RetaylButtonContent';
import RetaylButtonDropdown from './RetaylButtonDropdown';
import { BUTTON_DEFAULTS } from './RetaylButton.helpers';
import useRetaylButtonDropdown from './useRetaylButtonDropdown';
import useRetaylButtonStyles from './useRetaylButtonStyles';
import useRetaylButtonProps from './useRetaylButtonProps';

/** Extended ViewStyle allowing additional CSS properties */
export type ExtendedViewStyle = ViewStyle & { [property: string]: unknown };

/** Extended TextStyle allowing additional CSS properties */
export type ExtendedTextStyle = TextStyle & { [property: string]: unknown };

type HoverablePressableState = PressableStateCallbackType & {
  hovered?: boolean;
};

type ICustomButtonProps = {
  type?: 'button' | 'buttonDropdown';
  variant?: 'primary' | 'secondary' | 'tertiary';
  buttonText: string;
  buttonStyle?: StyleProp<ExtendedViewStyle>;
  buttonTextColor?: string;
  buttonTextSize?: number | keyof typeof buttonFontSize;
  width?: number | string;
  height?: number;
  hPadding?: number;
  vPadding?: number;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ComponentType<Record<string, unknown>>;
  rightIcon?: React.ComponentType<Record<string, unknown>>;
  icon?: React.ReactNode;
  borderColor?: string;
  bgColor?: string;
  borderWidth?: number;
  buttonTextStyle?: StyleProp<ExtendedTextStyle>;
  border?: string | number;
  borderRadius?: number;
  fontFamily?: string;
  hoverStyle?: StyleProp<ExtendedViewStyle>;
  pressedStyle?: StyleProp<ExtendedViewStyle>;
  disabledStyle?: StyleProp<ExtendedViewStyle>;
  onClick?: (event: GestureResponderEvent) => void;
  onDropdownItemClick?: (selectedItem: string) => void;
  dropdownItems?: Array<{ label: string; value: string }> | string[];
  dropdownItemStyle?: StyleProp<ExtendedViewStyle>;
  dropdownContainerStyle?: StyleProp<ExtendedViewStyle>;
  dropdownWidth?: number | string;
  dropdownPosition?: 'auto' | 'left' | 'right' | 'center';
  title?: string;
  'aria-label'?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
  fontWeight?: string;
};

const RetaylButton: FunctionComponent<ICustomButtonProps> = (props) => {
  const p = useRetaylButtonProps(props);
  const { colors: themeColors } = useTheme();
  const [showTooltip] = useState(false);

  const dropdown = useRetaylButtonDropdown({
    dropdownItems: p.dropdownItems,
    dropdownWidth: p.dropdownWidth,
    dropdownPosition: p.dropdownPosition,
  });

  const { resolveButtonStyle, getInteractiveColor } = useRetaylButtonStyles({
    variant: p.variant,
    effectiveBgColor: p.effectiveBgColor,
    buttonTextColor: props.buttonTextColor,
    borderColor: props.borderColor,
    borderWidth: p.borderWidth,
    borderRadius: p.borderRadiusProp,
    effectiveHeight: p.effectiveHeight,
    hPadding: p.hPadding,
    vPadding: p.vPadding,
    width: p.width,
    disabled: p.disabled,
    loading: p.loading,
    buttonStyle: props.buttonStyle,
    hoverStyle: props.hoverStyle,
    pressedStyle: props.pressedStyle,
    disabledStyle: props.disabledStyle,
    buttonStyles: styles,
  });

  const { onClick } = props;
  const handlePress = useCallback(
    (event: GestureResponderEvent) => {
      if (p.loading || p.disabled) return;
      if (p.type === 'buttonDropdown') dropdown.toggleDropdown();
      else if (onClick) onClick(event);
    },
    [p.loading, p.disabled, p.type, onClick, dropdown],
  );

  const wrapperStyle = useMemo(() => ({ position: 'relative' as const }), []);
  const ariaLabel = props['aria-label'];

  return (
    <View ref={dropdown.buttonRef} style={wrapperStyle}>
      <Pressable
        onPress={handlePress}
        disabled={p.disabled || p.loading}
        accessibilityLabel={props.accessibilityLabel ?? ariaLabel}
        accessibilityRole='button'
        accessibilityHint={props.accessibilityHint ?? props.title}
        style={resolveButtonStyle}
        testID={props.testID}
      >
        {(pressState) => {
          const { hovered } = pressState as HoverablePressableState;
          return (
            <RetaylButtonContent
              loading={p.loading}
              buttonText={props.buttonText}
              textColor={getInteractiveColor(hovered)}
              effectiveFontSize={p.effectiveFontSize}
              effectiveIconSize={p.effectiveIconSize}
              LeftIcon={props.leftIcon}
              RightIcon={props.rightIcon}
              type={p.type}
              icon={props.icon}
              disabled={p.disabled}
              variant={p.variant}
              fontWeight={props.fontWeight}
              buttonTextStyle={props.buttonTextStyle}
            />
          );
        }}
      </Pressable>
      {showTooltip && p.disabled ? (
        <View style={styles.tooltip}>
          <RetaylText
            text='Complete required fields to continue'
            size={fontSize.xs}
            color={themeColors.textInverse}
          />
        </View>
      ) : null}
      {p.type === 'buttonDropdown' &&
      dropdown.showDropdown &&
      dropdown.dropdownData ? (
        <RetaylButtonDropdown
          dropdownRef={dropdown.dropdownRef}
          dropdownData={dropdown.dropdownData}
          dropdownLayout={dropdown.dropdownLayout}
          dropdownContainerStyle={props.dropdownContainerStyle}
          dropdownItemStyle={props.dropdownItemStyle}
          onItemClick={props.onDropdownItemClick}
          onClose={dropdown.closeDropdown}
          minWidth={BUTTON_DEFAULTS.DROPDOWN_MIN_WIDTH}
        />
      ) : null}
    </View>
  );
};

/* eslint-disable retayl/no-hardcoded-colors -- Static StyleSheet with decorative/shadow colors */
/* eslint-disable retayl/enforce-design-token-spacing -- Static StyleSheet with fixed layout values */
const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    textAlign: 'center',
  },
  buttonWithShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  tooltip: {
    position: 'absolute',
    bottom: '100%',
    left: '50%',
    transform: [{ translateX: -50 }],
    backgroundColor: '#374151',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 8,
    zIndex: 1001,
    minWidth: 200,
    alignItems: 'center',
  },
});
/* eslint-enable retayl/no-hardcoded-colors */
/* eslint-enable retayl/enforce-design-token-spacing */

export default RetaylButton;

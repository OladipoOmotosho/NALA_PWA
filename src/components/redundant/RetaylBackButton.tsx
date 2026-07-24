import React, { FunctionComponent, useMemo } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
  ViewStyle,
} from 'react-native';
import RetaylText from './RetaylText';
import { useTheme } from '@retayl/hooks';
import { FONTFAMILY } from '@retayl/fonts';
import { spacing } from '@retayl/utils';

interface RetaylBackButtonProps {
  style?: ViewStyle;
  /** Custom className for Tailwind responsive overrides (web only) */
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  text: string;
  color?: string;
  fontFamily?: string;
  onClick: (event: GestureResponderEvent) => void;
}

const TEXT_OFFSET = -2.5;

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xxs,
  },
});

const textExtraStyle = { marginTop: TEXT_OFFSET } as const;

/**
 * RetaylBackButton Component
 *
 * A customizable back button component for the Retayl platform.
 */
const RetaylBackButton: FunctionComponent<RetaylBackButtonProps> = ({
  style,
  className: _className,
  leftIcon,
  rightIcon,
  text,
  color,
  fontFamily = FONTFAMILY.regular,
  onClick,
}) => {
  const { colors } = useTheme();
  const buttonStyle = useMemo(() => [styles.button, style], [style]);

  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onClick}>
      {leftIcon}
      <RetaylText
        text={text}
        color={color || colors.textSecondary}
        fontFamily={fontFamily}
        size={16}
        extraStyle={textExtraStyle}
      />
      {rightIcon}
    </TouchableOpacity>
  );
};

export default RetaylBackButton;

import { fontSize, spacing, lineHeight } from '@retayl/utils';
import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Pressable, Animated } from 'react-native';
import { useTheme } from '@retayl/hooks';
import RetaylText from './RetaylText';

const RetaylRadio = ({
  label,
  isSelected = false,
  onSelect,
}: {
  onSelect: (newSelectedState: boolean) => void;
  label: string;
  isSelected?: boolean;
}) => {
  const [selected, setSelected] = useState(isSelected);
  const scaleValue = useRef(new Animated.Value(isSelected ? 1 : 0)).current;
  const { colors } = useTheme();

  useEffect(() => {
    Animated.spring(scaleValue, {
      toValue: selected ? 1 : 0,
      friction: 10,
      useNativeDriver: true,
    }).start();

    return () => {
      scaleValue.setValue(selected ? 1 : 0);
    };
  }, [selected, scaleValue]);

  const handleSelect = () => {
    const newSelectedState = !selected;
    setSelected(newSelectedState);
    onSelect && onSelect(newSelectedState);
  };

  return (
    <View style={styles.container}>
      <RetaylText
        text={label}
        size={fontSize.md}
        fontWeight={'400'}
        extraStyle={{
          marginRight: spacing.lg,
          lineHeight: lineHeight.normal * fontSize.md,
          color: colors.textPrimary,
        }}
      />
      <Pressable onPress={handleSelect} style={styles.radioContainer}>
        <View
          style={[
            styles.radioBackground,
            {
              backgroundColor: colors.backgroundPrimary,
              borderColor: selected ? colors.borderMedium : colors.borderDark,
              borderWidth: selected ? 1 : 2,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.innerCircle,
              {
                backgroundColor: colors.primary,
                transform: [{ scale: scaleValue }],
              },
            ]}
          />
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 16,
    height: 16,
  },
  radioBackground: {
    width: 16,
    height: 16,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

export default RetaylRadio;

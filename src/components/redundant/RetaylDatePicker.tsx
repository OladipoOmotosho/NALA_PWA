import React, { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import {
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
  DimensionValue,
} from 'react-native';
import RetaylText from './RetaylText';
import { radius, shadows, fontSize, spacing } from '@retayl/utils';
import { FONTFAMILY } from '@retayl/fonts';
import AnimatedLabel from './AnimatedLabel';
import { SxProps, Theme } from '@mui/material/styles';
import { DateTime } from 'luxon';
import { useTheme } from '@retayl/hooks';

type RetaylDatePickerProps = {
  placeholder?: string;
  value?: DateTime | null;
  onChange?: (date: DateTime | null) => void;
  width?: DimensionValue;
  height?: number;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  borderColor?: string;
  autoFocus?: boolean;
  readOnly?: boolean;
  error?: boolean;
  errorMessage?: string;
  required?: boolean;
  minDate?: DateTime;
  maxDate?: DateTime;
  format?: string;
};

const RetaylDatePicker: React.FC<RetaylDatePickerProps> = ({
  placeholder = 'Select Date',
  value = null,
  width = '100%',
  height = spacing.xl,
  containerStyle,
  borderColor: borderColorProp,
  readOnly,
  error = false,
  errorMessage,
  required = false,
  onChange,
  minDate,
  maxDate,
  format = 'MM/dd/yyyy',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isError, setIsError] = useState(error);
  const { colors } = useTheme();
  const borderColor = borderColorProp ?? colors.borderLight;

  const handleDateChange = (newDate: DateTime | null) => {
    onChange?.(newDate);
    if (required && newDate) {
      setIsError(false);
    }
  };

  const getErrorText = () => {
    if (errorMessage) return errorMessage;
    if (required && !value) return 'This field is required';
    return '';
  };

  const inputSx: SxProps<Theme> = {
    width: '100%',
    '& .MuiInputBase-root': {
      height: `${height}px`,
      fontFamily: FONTFAMILY.regular,
      fontSize: '16px',
      backgroundColor: 'transparent',
      border: 'none',
      display: 'flex',
      justifyContent: 'space-between',
      '& fieldset': {
        border: 'none',
      },
      '&:hover fieldset': {
        border: 'none',
      },
      '&.Mui-focused fieldset': {
        border: 'none',
      },
      // Adjust input container to take full width
      '& .MuiInputAdornment-root': {
        marginLeft: 'auto',
      },
    },
    '& .MuiInputBase-input': {
      padding: '10px',
      color: colors.textPrimary,
      // Prevent input from taking full width
      width: 'auto',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
  };

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <View style={containerStyle}>
        {(isFocused || value) && (
          <View style={styles.placeholderContainer}>
            <AnimatedLabel
              isFocused={isFocused}
              hasValue={!!value}
              placeholder={placeholder}
              isError={isError}
              required={required}
            />
          </View>
        )}
        <View
          style={[
            styles.inputContainer,
            {
              borderColor: isError
                ? colors.error
                : isFocused
                  ? colors.primary
                  : borderColor,
              width: width as DimensionValue,
              height,
            } as ViewStyle,
          ]}
        >
          <DatePicker
            value={value}
            onChange={handleDateChange}
            minDate={minDate}
            maxDate={maxDate}
            format={format}
            disabled={readOnly}
            slotProps={{
              textField: {
                placeholder: placeholder + (required ? ' *' : ''),
                onFocus: () => setIsFocused(true),
                onBlur: () => {
                  setIsFocused(false);
                  if (required && !value) {
                    setIsError(true);
                  }
                },
                sx: inputSx,
                fullWidth: true,
              },
            }}
          />
        </View>
        {isError && (
          <RetaylText
            style={styles.errorText}
            text={getErrorText()}
            color={colors.error}
          />
        )}
      </View>
    </LocalizationProvider>
  );
};

const styles = StyleSheet.create({
  placeholderContainer: {
    left: 10,
    width: 'auto',
    zIndex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.md,
    ...shadows.sm,
  },
  errorText: {
    fontSize: fontSize.xs,
    marginTop: spacing.xl,
    position: 'absolute',
  },
});

export default RetaylDatePicker;

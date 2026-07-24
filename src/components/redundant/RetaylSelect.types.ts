import type React from 'react';
import type {
  DimensionValue,
  ImageSourcePropType,
  TextStyle,
  ViewStyle,
} from 'react-native';

export type BaseItemType = {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  image?: ImageSourcePropType;
};

export type IconPosition = 'left' | 'right';

/** Visual variant for the select trigger */
export type SelectVariant = 'default' | 'pill';

export type AddMoreOptionsProps = {
  text: string;
  onClick: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
};

export interface CustomSelectProps<T extends BaseItemType = BaseItemType> {
  placeholder?: string;
  fieldLabel?: string;
  onChange?: (value: string, label: string) => void;
  value?: T['value'];
  label?: string;
  items: T[];
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
  suffixText?: string;
  icon?: React.ReactNode;
  iconPosition?: IconPosition;
  addMoreOptions?: AddMoreOptionsProps;
  isLoading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  modalTitle?: string;
  scrollbarStyle?: 'styled' | 'hidden' | 'default';
  dropdownZIndex?: number;
  dropdownContext?: 'modal' | 'drawer' | 'default';
  // Backend search support
  onSearch?: (query: string) => void;
  isSearching?: boolean;
  /** Visual variant - 'default' for form field, 'pill' for compact control */
  variant?: SelectVariant;
}

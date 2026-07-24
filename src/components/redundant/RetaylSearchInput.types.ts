import type { TextStyle, ViewStyle } from 'react-native';

export interface RetaylSearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  debounceMs?: number;
  showClearButton?: boolean;
  isLoading?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  disabled?: boolean;
  autoCorrect?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

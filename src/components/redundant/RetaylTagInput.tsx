import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  Pressable,
} from 'react-native';
import { FONTFAMILY } from '@retayl/fonts';
import { useTheme } from '@retayl/hooks';
import { fontSize, radius, NUMERIC_CONSTANTS } from '@retayl/utils';
import { Addcircle, ArrowDown, CloseTag } from '@retayl/icons';

// TagInput constants
const TAG_INPUT_CONSTANTS = {
  DEFAULT_TAG_SPACING: 10,
  SUGGESTIONS_MAX_HEIGHT: 150,
  SHADOW_OPACITY: NUMERIC_CONSTANTS.VERY_LOW_OPACITY,
  SHADOW_RADIUS: 10,
  ELEVATION: 3,
  Z_INDEX: 1000,
  TAG_PADDING_VERTICAL: 6,
  TAG_PADDING_HORIZONTAL: 12,
  TAG_MARGIN_RIGHT: 8,
  TAG_MARGIN_BOTTOM: 8,
  SUGGESTION_PADDING: 10,
  ADD_GROUP_MARGIN_LEFT: 8,
  TAG_REMOVE_MARGIN_LEFT: 8,
  INPUT_PADDING_VERTICAL: 12,
  INPUT_PADDING_HORIZONTAL: 10,
  BORDER_WIDTH: 1,
  FULL_PERCENTAGE: '100%',
  COLOR_ARRAY_LENGTH: 3,
} as const;
import RetaylTextInput from './RetaylTextInput';
interface Tag {
  label: string;
  value: string;
}

interface AddNewGroupProps {
  text: string;
  onClick: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
}

interface TagInputProps {
  initialTags?: Tag[] | string[];
  placeholder?: string;
  onTagsChange: (tags: Tag[]) => void;
  containerStyle?: StyleProp<ViewStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  tagStyle?: StyleProp<ViewStyle>;
  tagTextStyle?: StyleProp<TextStyle>;
  removeButtonStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode | React.ReactElement;
  tagPosition?: 'top' | 'bottom' | 'left' | 'right';
  tagSpacing?: number;
  tagScrollViewStyle?: StyleProp<ViewStyle>;
  containerLayoutStyle?: StyleProp<ViewStyle>;
  tagLayoutStyle?: StyleProp<ViewStyle>;
  tagContainerStyle?: StyleProp<ViewStyle>;
  addNewGroup?: AddNewGroupProps;
  predefinedTags?: Tag[]; // Make predefinedTags configurable through props
}

export const RetaylTagInput: React.FC<TagInputProps> = ({
  initialTags = [],
  placeholder = 'Select role(s)*',
  onTagsChange,
  containerStyle,
  tagStyle,
  tagTextStyle,
  removeButtonStyle,
  icon = <CloseTag />,
  tagPosition = 'bottom',
  tagSpacing = TAG_INPUT_CONSTANTS.DEFAULT_TAG_SPACING,
  inputContainerStyle,
  addNewGroup,
  predefinedTags = [
    { label: 'Manager', value: 'manager' },
    { label: 'Admin', value: 'admin' },
    { label: 'Editor', value: 'editor' },
  ],
}) => {
  const { colors } = useTheme();
  const [input, setInput] = useState<string>('');
  const [tags, setTags] = useState<Tag[]>(() =>
    initialTags.length > 0
      ? initialTags.map((tag) =>
          typeof tag === 'string' ? { label: tag, value: tag } : tag,
        )
      : [],
  );
  const [suggestions, setSuggestions] = useState<Tag[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    onTagsChange(tags);
  }, [tags, onTagsChange]);

  const addTag = useCallback(
    (tag: Tag) => {
      if (!tags.some((t) => t.value === tag.value)) {
        setTags((prevTags) => {
          const newTags = [...prevTags, tag];
          if (JSON.stringify(newTags) !== JSON.stringify(prevTags)) {
            return newTags;
          }
          return prevTags;
        });
        setInput('');
        setSuggestions([]);
      }
    },
    [tags],
  );

  const removeTag = useCallback((tag: Tag) => {
    setTags((prevTags) => {
      const newTags = prevTags.filter((t) => t.value !== tag.value);
      if (JSON.stringify(newTags) !== JSON.stringify(prevTags)) {
        return newTags;
      }
      return prevTags;
    });
  }, []);

  const handleInputChange = useCallback(
    (text: string) => {
      setInput(text);
      if (text) {
        const filteredTags = predefinedTags.filter(
          (tag) =>
            tag.label.toLowerCase().includes(text.toLowerCase()) &&
            !tags.some((t) => t.value === tag.value),
        );
        setSuggestions(filteredTags);
      } else {
        // When input is empty, show all available tags
        setSuggestions(
          predefinedTags.filter(
            (tag) => !tags.some((t) => t.value === tag.value),
          ),
        );
      }
    },
    [tags, predefinedTags],
  );

  const handleAddNewGroup = () => {
    setShowDropdown(false);
    addNewGroup?.onClick();
  };

  // Handle input field or arrow click
  const handleInputPress = () => {
    setShowDropdown(true);
    if (!input) {
      // Show all available tags when dropdown is opened
      setSuggestions(
        predefinedTags.filter(
          (tag) => !tags.some((t) => t.value === tag.value),
        ),
      );
    }
  };

  // Handle clicking outside the component
  const handleOutsidePress = () => {
    setShowDropdown(false);
  };

  const getPositionStyles = useCallback(() => {
    const containerLayoutStyle: ViewStyle = {
      flexDirection: ['left', 'right'].includes(tagPosition) ? 'row' : 'column',
    };

    const tagLayoutStyle: ViewStyle = {
      marginTop: tagPosition === 'bottom' ? tagSpacing : 0,
      marginBottom: tagPosition === 'top' ? tagSpacing : 0,
      marginLeft: tagPosition === 'right' ? tagSpacing : 0,
      marginRight: tagPosition === 'left' ? tagSpacing : 0,
    };

    const tagScrollViewStyle: ViewStyle = {
      maxHeight: ['top', 'bottom'].includes(tagPosition) ? undefined : '100%',
      maxWidth: ['left', 'right'].includes(tagPosition) ? '100%' : undefined,
    };

    const tagContainerStyle: ViewStyle = {
      flexDirection: ['left', 'right'].includes(tagPosition) ? 'row' : 'column',
      flexWrap: ['left', 'right'].includes(tagPosition) ? 'nowrap' : 'wrap',
    };

    return {
      containerLayoutStyle,
      tagLayoutStyle,
      tagScrollViewStyle,
      tagContainerStyle,
    };
  }, [tagPosition, tagSpacing]);

  const {
    containerLayoutStyle,
    tagLayoutStyle,
    tagScrollViewStyle,
    tagContainerStyle,
  } = getPositionStyles();

  const styles = StyleSheet.create({
    container: {
      padding: 0,
    },
    inputContainer: {
      flex: 1,
    },
    input: {
      paddingVertical: TAG_INPUT_CONSTANTS.INPUT_PADDING_VERTICAL,
      paddingHorizontal: TAG_INPUT_CONSTANTS.INPUT_PADDING_HORIZONTAL,
      fontFamily: FONTFAMILY.regular,
      fontSize: fontSize.sm,
    },
    suggestionsContainer: {
      backgroundColor: colors.backgroundPrimary,
      borderRadius: radius.sm,
      shadowColor: colors.black,
      shadowOpacity: TAG_INPUT_CONSTANTS.SHADOW_OPACITY,
      shadowRadius: TAG_INPUT_CONSTANTS.SHADOW_RADIUS,
      elevation: TAG_INPUT_CONSTANTS.ELEVATION,
      maxHeight: TAG_INPUT_CONSTANTS.SUGGESTIONS_MAX_HEIGHT,
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      zIndex: TAG_INPUT_CONSTANTS.Z_INDEX,
    },
    suggestionItem: {
      padding: TAG_INPUT_CONSTANTS.SUGGESTION_PADDING,
    },
    suggestionText: {
      color: colors.textPrimary,
      fontSize: fontSize.sm,
    },
    tagScrollView: {
      flex: 1,
    },
    tagContainer: {
      flexDirection: 'row',
      width: 'auto',
    },
    tag: {
      backgroundColor: colors.backgroundTertiary,
      borderRadius: radius.lg,
      paddingVertical: TAG_INPUT_CONSTANTS.TAG_PADDING_VERTICAL,
      paddingHorizontal: TAG_INPUT_CONSTANTS.TAG_PADDING_HORIZONTAL,
      marginRight: TAG_INPUT_CONSTANTS.TAG_MARGIN_RIGHT,
      marginBottom: TAG_INPUT_CONSTANTS.TAG_MARGIN_BOTTOM,
      flexDirection: 'row',
      alignItems: 'center',
    },
    tagText: {
      fontFamily: FONTFAMILY.medium,
      fontSize: fontSize.sm,
    },
    tagRemove: {
      marginLeft: TAG_INPUT_CONSTANTS.TAG_REMOVE_MARGIN_LEFT,
    },
    addNewGroupContainer: {
      padding: TAG_INPUT_CONSTANTS.SUGGESTION_PADDING,
      borderBottomWidth: TAG_INPUT_CONSTANTS.BORDER_WIDTH,
      borderColor: colors.borderLight,
    },
    addNewGroupContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    addNewGroupText: {
      marginLeft: TAG_INPUT_CONSTANTS.ADD_GROUP_MARGIN_LEFT,
      color: colors.primary,
      fontFamily: FONTFAMILY.medium,
      fontSize: fontSize.sm,
    },
  });

  const TagList = (
    <ScrollView
      style={[styles.tagScrollView, tagScrollViewStyle]}
      contentContainerStyle={[styles.tagContainer, tagContainerStyle]}
    >
      {tags.map((tag, index) => {
        const backgroundColor = ['#FFF2F2', '#F6F0FF', '#FFF0FA'][
          index % TAG_INPUT_CONSTANTS.COLOR_ARRAY_LENGTH
        ];
        const textColor = ['#9A4848', '#6941C6', '#C11574'][
          index % TAG_INPUT_CONSTANTS.COLOR_ARRAY_LENGTH
        ];
        return (
          <View
            key={tag.value}
            style={[styles.tag, { backgroundColor }, tagStyle]}
          >
            <Text style={[styles.tagText, { color: textColor }, tagTextStyle]}>
              {tag.label}
            </Text>
            <TouchableOpacity onPress={() => removeTag(tag)}>
              <Text style={[styles.tagRemove, removeButtonStyle]}>{icon}</Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </ScrollView>
  );

  return (
    <Pressable onPress={handleOutsidePress} style={{ flex: 1 }}>
      <View style={[styles.container, containerLayoutStyle, containerStyle]}>
        {tagPosition === 'top' && <View style={tagLayoutStyle}>{TagList}</View>}
        {tagPosition === 'left' && (
          <View style={tagLayoutStyle}>{TagList}</View>
        )}

        <View style={[styles.inputContainer, inputContainerStyle]}>
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              handleInputPress();
            }}
          >
            <RetaylTextInput
              placeholder={placeholder}
              value={input}
              onChange={(text: string | number) =>
                handleInputChange(String(text))
              }
              onSubmitEditing={() => addTag({ label: input, value: input })}
              icon={<ArrowDown />}
            />
          </Pressable>

          {showDropdown && (
            <ScrollView style={styles.suggestionsContainer}>
              {addNewGroup && (
                <TouchableOpacity
                  style={[styles.addNewGroupContainer, addNewGroup.style]}
                  onPress={handleAddNewGroup}
                >
                  <View style={styles.addNewGroupContent}>
                    {addNewGroup.icon || <Addcircle />}
                    <Text
                      style={[styles.addNewGroupText, addNewGroup.textStyle]}
                    >
                      {addNewGroup.text}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              {suggestions.map((suggestion) => (
                <TouchableOpacity
                  key={suggestion.value}
                  style={styles.suggestionItem}
                  onPress={() => {
                    addTag(suggestion);
                    setShowDropdown(false);
                  }}
                >
                  <Text style={styles.suggestionText}>{suggestion.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {tagPosition === 'bottom' && (
          <View style={tagLayoutStyle}>{TagList}</View>
        )}
        {tagPosition === 'right' && (
          <View style={tagLayoutStyle}>{TagList}</View>
        )}
      </View>
    </Pressable>
  );
};

export default RetaylTagInput;

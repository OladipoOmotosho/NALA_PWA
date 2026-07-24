import { useEffect } from 'react';
import {
  Pressable,
  Image,
  View,
  Text,
  StyleSheet,
  ImageStyle,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { CameraAlt } from '@retayl/icons';
import { fontSize, spacing, radius } from '@retayl/utils';
import { useTheme } from '@retayl/hooks';

const DEFAULT_IMAGE_SIZE = 54;
const DEFAULT_BORDER_RADIUS = 100;

interface RetaylImageUploaderProps {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  preview: string | null;
  setPreview: (preview: string | null) => void;
  placeholderText?: string;
  imageSize?: number;
  containerStyle?: ViewStyle;
  imageStyle?: ImageStyle;
  borderRadius?: number;
  placeholderStyle?: TextStyle;
  cameraIconContainerStyle?: ViewStyle;
  cameraHolderContainerStyle?: ViewStyle;
  icon?: React.ReactNode;
}

export const RetaylImageUploader = ({
  selectedFile,
  setSelectedFile,
  preview,
  setPreview,
  placeholderText = 'Upload image',
  imageSize = DEFAULT_IMAGE_SIZE,
  containerStyle,
  imageStyle,
  placeholderStyle,
  borderRadius = DEFAULT_BORDER_RADIUS,
  cameraIconContainerStyle,
  cameraHolderContainerStyle,
  icon = <CameraAlt />,
}: RetaylImageUploaderProps) => {
  const { colors } = useTheme();

  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);
    }
  }, [selectedFile, setPreview]);

  const handleFileChange = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files ? target.files[0] : null;
      setSelectedFile(file);
    };
    fileInput.click();
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {preview ? (
        <Image
          source={{ uri: preview }}
          style={[
            styles.image,
            { width: imageSize, height: imageSize, borderRadius: borderRadius },
            imageStyle,
          ]}
        />
      ) : (
        <View
          style={[
            styles.cameraHolderContainer,
            {
              width: imageSize,
              height: imageSize,
              borderRadius,
              backgroundColor: colors.errorLight,
            },
            cameraHolderContainerStyle, // Apply new prop
          ]}
        >
          <Pressable
            onPress={handleFileChange}
            style={[
              styles.cameraIconContainer,
              { backgroundColor: colors.backgroundPrimary },
              cameraIconContainerStyle,
            ]}
          >
            {icon && icon}
          </Pressable>
        </View>
      )}

      <Text
        style={[
          styles.placeholderText,
          { color: colors.textSecondary },
          placeholderStyle,
        ]}
        onPress={handleFileChange}
      >
        {placeholderText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  image: {
    resizeMode: 'cover',
  },
  cameraHolderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: fontSize.xs,
    cursor: 'pointer',
  },
  cameraIconContainer: {
    position: 'absolute',
    padding: spacing.xs,
    borderRadius: radius.md,
  },
});

export default RetaylImageUploader;

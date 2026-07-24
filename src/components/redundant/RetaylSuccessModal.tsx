import RetaylModal from './RetaylModal';
import type { GestureResponderEvent } from 'react-native';

/**
 * @deprecated Use <RetaylModal variant="success" /> instead
 * This component is kept for backward compatibility
 */
interface RetaylSuccessModalProps {
  isVisible?: boolean;
  setIsVisible: (isVisible: boolean) => void;
  message: string;
  onClick?: (event: GestureResponderEvent) => void;
  hideButton?: boolean;
}

/**
 * @deprecated Use <RetaylModal variant="success" /> instead
 *
 * Legacy success modal component - now a thin wrapper around RetaylModal
 * Fixed: This file previously had a naming bug (RetaylFailedModal instead of RetaylSuccessModal)
 *
 * @example
 * // Old way (still works)
 * <RetaylSuccessModal
 *   isVisible={true}
 *   setIsVisible={setIsVisible}
 *   message="Success!"
 * />
 *
 * // New way (recommended)
 * <RetaylModal
 *   variant="success"
 *   isVisible={true}
 *   onClose={() => setIsVisible(false)}
 *   message="Success!"
 *   primaryButton={{ text: 'Done', onPress: handleClose }}
 * />
 */
const RetaylSuccessModal = ({
  isVisible = false,
  setIsVisible,
  message,
  onClick,
  hideButton,
}: RetaylSuccessModalProps) => {
  const onClose = () => setIsVisible(false);

  return (
    <RetaylModal
      variant='success'
      isVisible={isVisible}
      onClose={onClose}
      message={message}
      size='sm'
      primaryButton={
        !hideButton
          ? {
              text: 'Done',
              onPress: () =>
                onClick ? onClick({} as GestureResponderEvent) : onClose(),
            }
          : undefined
      }
    />
  );
};

export default RetaylSuccessModal;

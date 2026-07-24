import React, { useCallback } from 'react';
import { useTheme } from '@retayl/hooks';
import { CloseIcon } from '@retayl/icons';
import RetaylButton from './RetaylButton';
import RetaylText from './RetaylText';
import type { ButtonConfig, ButtonLayout } from './RetaylModal.types';
import {
  buildContentWrapperStyles,
  buildHeaderStyles,
  buildCloseButtonStyles,
  buildIconContainerStyles,
  buildButtonContainerStyles,
  buildTitleStyles,
  buildSubtitleStyles,
  buildMessageStyles,
  buildButtonVariantColors,
  iconFontSizeStyle,
} from './RetaylModal.styles';

interface RetaylModalContentProps {
  variant: string;
  title?: string | React.ReactNode;
  subtitle?: string;
  message?: string | React.ReactNode;
  displayIcon: React.ReactNode | string | null;
  children?: React.ReactNode;
  buttonList: ButtonConfig[];
  buttonLayout: ButtonLayout;
  isCentered: boolean;
  useRowHeader: boolean;
  showCloseButton: boolean;
  onClose: () => void;
  contentStyle?: React.CSSProperties;
}

// =============================================================================
// SUB-COMPONENTS — extracted to reduce complexity and line count
// =============================================================================

/** Renders the modal header with optional icon, title, and subtitle */
const ModalHeader: React.FC<{
  displayIcon: React.ReactNode | string | null;
  title?: string | React.ReactNode;
  subtitle?: string;
  useRowHeader: boolean;
  isCentered: boolean;
  headerStyles: React.CSSProperties;
  iconContainerStyles: React.CSSProperties;
  titleStyles: React.CSSProperties;
  subtitleStyles: React.CSSProperties;
}> = ({
  displayIcon,
  title,
  subtitle,
  useRowHeader,
  headerStyles,
  iconContainerStyles,
  titleStyles,
  subtitleStyles,
}) => {
  if (!displayIcon && !title && !subtitle) return null;

  const iconElement = displayIcon ? (
    <div style={iconContainerStyles}>
      {typeof displayIcon === 'string' ? (
        <RetaylText as='span' text={displayIcon} style={iconFontSizeStyle} />
      ) : (
        displayIcon
      )}
    </div>
  ) : null;

  const titleElement = (() => {
    if (typeof title === 'string') {
      return (
        <RetaylText as='h2' text={title} style={titleStyles} id='modal-title' />
      );
    }
    if (title) return <div id='modal-title'>{title}</div>;
    return null;
  })();

  const subtitleElement = subtitle ? (
    <RetaylText
      as='p'
      text={typeof subtitle === 'string' ? subtitle : ''}
      style={subtitleStyles}
    >
      {typeof subtitle !== 'string' ? subtitle : undefined}
    </RetaylText>
  ) : null;

  return (
    <div style={headerStyles}>
      {iconElement}
      {useRowHeader ? (
        <div>
          {titleElement}
          {subtitleElement}
        </div>
      ) : (
        <>
          {titleElement}
          {subtitleElement}
        </>
      )}
    </div>
  );
};

/** Renders the modal message section */
const ModalMessage: React.FC<{
  message?: string | React.ReactNode;
  messageStyles: React.CSSProperties;
}> = ({ message, messageStyles }) => {
  if (!message) return null;
  if (typeof message === 'string')
    return <div style={messageStyles}>{message}</div>;
  return <div>{message}</div>;
};

/** Renders the modal button list */
const ModalButtons: React.FC<{
  buttonList: ButtonConfig[];
  buttonLayout: string;
  buttonContainerStyles: React.CSSProperties;
  buttonVariantColors: Record<string, { bg: string; text: string }>;
}> = ({
  buttonList,
  buttonLayout,
  buttonContainerStyles,
  buttonVariantColors,
}) => {
  if (buttonList.length === 0) return null;

  return (
    <div style={buttonContainerStyles}>
      {buttonList.map((button) => {
        const btnColors = buttonVariantColors[button.variant ?? 'primary'];
        return (
          <RetaylButton
            key={button.testID ?? button.text}
            buttonText={button.text}
            onClick={button.onPress}
            bgColor={btnColors.bg}
            buttonTextColor={btnColors.text}
            width={
              (button.width ??
                (buttonLayout === 'column' ? '100%' : undefined)) as
                | string
                | number
                | undefined
            }
            loading={button.loading}
            disabled={button.disabled}
            testID={button.testID}
          />
        );
      })}
    </div>
  );
};

// =============================================================================
// MAIN CONTENT COMPONENT
// =============================================================================

/** Computes all styles needed by the modal content. */
const useModalContentStyles = (
  variant: string,
  isCentered: boolean,
  useRowHeader: boolean,
  buttonLayout: ButtonLayout,
  buttonCount: number,
  contentStyle?: React.CSSProperties,
) => {
  const { colors } = useTheme();
  return {
    colors,
    contentWrapperStyles: buildContentWrapperStyles({
      isCentered,
      contentStyle,
    }),
    headerStyles: buildHeaderStyles({ useRowHeader, isCentered }),
    closeButtonStyles: buildCloseButtonStyles(),
    iconContainerStyles: buildIconContainerStyles({ colors, variant }),
    buttonContainerStyles: buildButtonContainerStyles({
      buttonLayout,
      hasButtons: buttonCount > 0,
    }),
    titleStyles: buildTitleStyles(colors),
    subtitleStyles: buildSubtitleStyles(colors),
    messageStyles: buildMessageStyles({ colors, isCentered }),
    buttonVariantColors: buildButtonVariantColors(colors),
  };
};

/**
 * Internal sub-component rendering modal content (header, message, buttons).
 * Extracted to reduce RetaylModal complexity and line count.
 */
const RetaylModalContent: React.FC<RetaylModalContentProps> = ({
  variant,
  title,
  subtitle,
  message,
  displayIcon,
  children,
  buttonList,
  buttonLayout,
  isCentered,
  useRowHeader,
  showCloseButton,
  onClose,
  contentStyle,
}) => {
  const styles = useModalContentStyles(
    variant,
    isCentered,
    useRowHeader,
    buttonLayout,
    buttonList.length,
    contentStyle,
  );

  const handleCloseMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.backgroundColor = styles.colors.backgroundSecondary;
    },
    [styles.colors.backgroundSecondary],
  );

  const handleCloseMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.backgroundColor = 'transparent';
    },
    [],
  );

  return (
    <>
      {showCloseButton ? (
        <button
          style={styles.closeButtonStyles}
          onClick={onClose}
          aria-label='Close modal'
          type='button'
          onMouseEnter={handleCloseMouseEnter}
          onMouseLeave={handleCloseMouseLeave}
        >
          <CloseIcon />
        </button>
      ) : null}

      <div style={styles.contentWrapperStyles}>
        <ModalHeader
          displayIcon={displayIcon}
          title={title}
          subtitle={subtitle}
          useRowHeader={useRowHeader}
          isCentered={isCentered}
          headerStyles={styles.headerStyles}
          iconContainerStyles={styles.iconContainerStyles}
          titleStyles={styles.titleStyles}
          subtitleStyles={styles.subtitleStyles}
        />
        <ModalMessage message={message} messageStyles={styles.messageStyles} />
        {children ? <div>{children}</div> : null}
        <ModalButtons
          buttonList={buttonList}
          buttonLayout={buttonLayout}
          buttonContainerStyles={styles.buttonContainerStyles}
          buttonVariantColors={styles.buttonVariantColors}
        />
      </div>
    </>
  );
};

export default RetaylModalContent;

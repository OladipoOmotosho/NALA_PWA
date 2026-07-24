/**
 * Adapted from Retayl's RetaylText. Simplified significantly (see
 * internal-docs/technical-documentation/Text.md): dropped the Matter
 * font-family weight-mapping (that font isn't bundled here — this project
 * uses the system font stack from styles.css) and the responsive font-size
 * scaling via useResponsive/getResponsiveFontSize (this app is single-column
 * mobile-first already, so there's no breakpoint to scale against).
 */
import type { CSSProperties, ElementType, ReactNode } from 'react';
import { colors, fontSize as fontSizeTokens } from './theme';

type FontWeight = 'normal' | 'bold' | '400' | '500' | '600' | '700';

export interface TextProps {
  children?: ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'label' | 'strong';
  size?: number;
  color?: string;
  weight?: FontWeight;
  block?: boolean;
  /** Truncate to N lines with an ellipsis. */
  numberOfLines?: number;
  style?: CSSProperties;
  className?: string;
  id?: string;
  htmlFor?: string;
}

export function Text({
  children,
  as = 'span',
  size = fontSizeTokens.md,
  color = colors.text,
  weight = '400',
  block = false,
  numberOfLines,
  style,
  className,
  id,
  htmlFor,
}: TextProps) {
  const Component = as as ElementType;
  const clamp: CSSProperties = numberOfLines
    ? {
        display: '-webkit-box',
        WebkitLineClamp: numberOfLines,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }
    : {};

  return (
    <Component
      id={id}
      htmlFor={as === 'label' ? htmlFor : undefined}
      className={className}
      style={{
        fontSize: size,
        color,
        fontWeight: weight,
        display: block ? 'block' : undefined,
        margin: 0,
        ...clamp,
        ...style,
      }}
    >
      {children}
    </Component>
  );
}

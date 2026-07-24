/**
 * Adapted from Retayl's RetaylText. Simplified significantly (see
 * internal-docs/technical-documentation/Text.md): dropped the Matter
 * font-family weight-mapping (that font isn't bundled here — this project
 * uses the system font stack from styles.css) and the responsive font-size
 * scaling via useResponsive/getResponsiveFontSize (this app is single-column
 * mobile-first already, so there's no breakpoint to scale against).
 *
 * Styling: `size`/`color`/`weight` are genuinely per-instance dynamic values
 * (callers pass arbitrary numbers/strings, not a finite enum), so they stay
 * inline — that's the normal, accepted treatment for a low-level typography
 * primitive even in strict CSS-Modules codebases. The structural bits that
 * only ever take one of two states (block or not, clamped or not) are CSS
 * Module modifier classes instead (Text.module.css).
 */
import type { CSSProperties, ElementType, ReactNode } from 'react';
import { colors, fontSize as fontSizeTokens } from './theme';
import { cx } from './cx';
import styles from './Text.module.css';

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

  return (
    <Component
      id={id}
      htmlFor={as === 'label' ? htmlFor : undefined}
      className={cx(styles.text, block && styles.block, !!numberOfLines && styles.clamp, className)}
      style={{
        fontSize: size,
        color,
        fontWeight: weight,
        WebkitLineClamp: numberOfLines,
        ...style,
      }}
    >
      {children}
    </Component>
  );
}

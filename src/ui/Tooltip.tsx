/**
 * Adapted from Retayl's RetaylTooltip. Dropped the react-native
 * Platform.OS branching entirely — this project is web-only, so only the
 * web code path was kept. The hover/position/portal logic is otherwise
 * preserved: it renders through a portal so the tooltip is never clipped
 * by a scrolling/overflow:hidden ancestor (a real risk inside the card
 * sections and the Photo Register grid).
 */
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { colors, radius, spacing, zIndex } from './theme';
import { InfoIcon } from './icons';

export interface TooltipProps {
  message: string;
  title?: string;
  children?: ReactNode;
  'aria-label'?: string;
}

const MAX_WIDTH = 280;
const OFFSET = 8;

interface Position {
  top: number;
  left: number;
  isAbove: boolean;
}

export function Tooltip({ message, title, children, ...aria }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const ariaLabel = aria['aria-label'] ?? title ?? 'More information';

  const computePosition = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;
    const isAbove = spaceAbove > spaceBelow && spaceAbove > 100;
    setPosition({
      top: isAbove ? rect.top - OFFSET : rect.bottom + OFFSET,
      left: Math.max(spacing.sm, rect.left + rect.width / 2 - MAX_WIDTH / 2),
      isAbove,
    });
  }, []);

  useEffect(() => {
    if (visible) computePosition();
  }, [visible, computePosition]);

  const tooltipStyle = useMemo(() => {
    if (!position) return undefined;
    return {
      position: 'fixed' as const,
      top: position.isAbove ? undefined : position.top,
      bottom: position.isAbove ? window.innerHeight - position.top : undefined,
      left: position.left,
      maxWidth: MAX_WIDTH,
      zIndex: zIndex.tooltip,
      pointerEvents: 'none' as const,
    };
  }, [position]);

  return (
    <>
      <span
        ref={triggerRef}
        role="button"
        tabIndex={0}
        aria-label={ariaLabel}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}
      >
        {children ?? <InfoIcon size={16} color={colors.muted} />}
      </span>
      {visible && position && tooltipStyle
        ? createPortal(
            <div style={tooltipStyle} role="tooltip">
              <div
                style={{
                  background: '#141233',
                  borderRadius: radius.md,
                  padding: '8px 12px',
                }}
              >
                {title && <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', marginBottom: 2 }}>{title}</div>}
                <div style={{ fontSize: 12, color: '#fff' }}>{message}</div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

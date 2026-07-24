/**
 * Adapted from Retayl's RetaylRadio. Same treatment as Checkbox: the
 * original's Animated.spring inner-dot scale replaced with a CSS
 * transition; sizes bumped to fit the 48px touch-target convention.
 */
import { colors, minTouchTarget, transition } from './theme';
import { Text } from './Text';

export interface RadioProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

export function Radio({ label, selected, onSelect, disabled = false }: RadioProps) {
  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        minHeight: minTouchTarget,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <input
        type="radio"
        checked={selected}
        disabled={disabled}
        onChange={onSelect}
        aria-label={label}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
      />
      <span
        aria-hidden="true"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 22,
          height: 22,
          borderRadius: '50%',
          border: `2px solid ${selected ? colors.teal : colors.line}`,
          transition: `border-color ${transition.fast}`,
        }}
      >
        <span
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: colors.teal,
            transform: selected ? 'scale(1)' : 'scale(0)',
            transition: `transform ${transition.fast}`,
          }}
        />
      </span>
      <Text as="span">{label}</Text>
    </label>
  );
}

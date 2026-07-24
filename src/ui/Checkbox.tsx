/**
 * Adapted from Retayl's RetaylCheckbox. The original used react-native's
 * Animated.spring for the checkmark scale-in; replaced with a CSS
 * transition (transform + opacity), which is equivalent visually and
 * needs no animation library. Sizes bumped from the original's 16x16 to
 * fit this app's 48px-minimum touch target convention (PRD §9.5).
 */
import { Check } from 'lucide-react';
import { colors, minTouchTarget, radius, transition } from './theme';
import { Text } from './Text';

export interface CheckboxProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  'aria-label'?: string;
}

export function Checkbox({ label, checked, onChange, disabled = false, ...aria }: CheckboxProps) {
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
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        aria-label={aria['aria-label'] ?? label}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
      />
      <span
        aria-hidden="true"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 24,
          height: 24,
          borderRadius: radius.sm,
          border: `1.5px solid ${checked ? colors.teal : colors.line}`,
          background: checked ? colors.teal : 'transparent',
          transition: `background ${transition.fast}, border-color ${transition.fast}`,
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            transform: checked ? 'scale(1)' : 'scale(0)',
            transition: `transform ${transition.fast}`,
            color: '#04211d',
          }}
        >
          <Check size={14} />
        </span>
      </span>
      {label && <Text as="span">{label}</Text>}
    </label>
  );
}

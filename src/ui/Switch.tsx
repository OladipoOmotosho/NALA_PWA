/**
 * NOTE: built fresh, not adapted. Retayl's RetaylSwitch is a 3-line
 * re-export of `./RetaylSwitchBase` — that file wasn't included in the
 * files handed over, so there was no source to tailor here. This follows
 * the same visual language as the adapted Checkbox/Radio (teal accent,
 * CSS-transition thumb) rather than reverse-engineering the missing file.
 * See internal-docs/technical-documentation/Switch.md.
 */
import { colors, transition } from './theme';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  'aria-label'?: string;
}

const TRACK_WIDTH = 48;
const TRACK_HEIGHT = 28;
const THUMB_SIZE = 22;
const THUMB_INSET = (TRACK_HEIGHT - THUMB_SIZE) / 2;

export function Switch({ checked, onChange, disabled = false, ...aria }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={aria['aria-label']}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      style={{
        position: 'relative',
        width: TRACK_WIDTH,
        height: TRACK_HEIGHT,
        minHeight: TRACK_HEIGHT,
        borderRadius: TRACK_HEIGHT / 2,
        border: 'none',
        background: checked ? colors.teal : colors.line,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: `background ${transition.base}`,
        padding: 0,
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: THUMB_INSET,
          left: checked ? TRACK_WIDTH - THUMB_SIZE - THUMB_INSET : THUMB_INSET,
          width: THUMB_SIZE,
          height: THUMB_SIZE,
          borderRadius: '50%',
          background: '#fff',
          transition: `left ${transition.base}`,
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        }}
      />
    </button>
  );
}

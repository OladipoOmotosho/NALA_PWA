/** Shared form controls: gloves-friendly Yes/No segmented control and labelled select. */
import { cx } from '../ui/cx';
import p from '../styles/primitives.module.css';

const SEG_BASE = 'min-h-12 flex-1 rounded-md border border-line bg-input-bg text-base text-text disabled:opacity-60';
const SEG_ACTIVE = 'border-teal bg-teal-dark font-bold';

export function YesNo({
  label,
  value,
  onChange,
  disabled,
  hint,
}: {
  label: string;
  value: boolean | null;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  hint?: string;
}) {
  return (
    <div className={p.field}>
      <span className={p.fieldLabel}>{label}</span>
      <div className="flex gap-2" role="radiogroup" aria-label={label}>
        <button
          type="button"
          className={cx(SEG_BASE, value === true && SEG_ACTIVE)}
          disabled={disabled}
          onClick={() => onChange(true)}
        >
          Yes
        </button>
        <button
          type="button"
          className={cx(SEG_BASE, value === false && SEG_ACTIVE)}
          disabled={disabled}
          onClick={() => onChange(false)}
        >
          No
        </button>
      </div>
      {hint && <span className={p.fieldHint}>{hint}</span>}
    </div>
  );
}

export function Select({
  label,
  value,
  options,
  onChange,
  required,
  disabled,
  hint,
  placeholder = 'Select…',
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  required?: boolean;
  disabled?: boolean;
  hint?: string;
  placeholder?: string;
}) {
  return (
    <label className={p.field}>
      <span className={p.fieldLabel}>
        {label}
        {required && <span className={p.req}> *</span>}
      </span>
      <select value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)}>
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {hint && <span className={p.fieldHint}>{hint}</span>}
    </label>
  );
}

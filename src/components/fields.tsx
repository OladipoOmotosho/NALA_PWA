/** Shared form controls: gloves-friendly Yes/No segmented control and labelled select. */

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
    <div className="field">
      <span className="field-label">{label}</span>
      <div className="segmented" role="radiogroup" aria-label={label}>
        <button
          type="button"
          className={value === true ? 'seg active' : 'seg'}
          disabled={disabled}
          onClick={() => onChange(true)}
        >
          Yes
        </button>
        <button
          type="button"
          className={value === false ? 'seg active' : 'seg'}
          disabled={disabled}
          onClick={() => onChange(false)}
        >
          No
        </button>
      </div>
      {hint && <span className="field-hint">{hint}</span>}
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
    <label className="field">
      <span className="field-label">
        {label}
        {required && <span className="req"> *</span>}
      </span>
      <select value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)}>
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}

/**
 * Adapted from Retayl's RetaylTextInput (.web.tsx + .types.ts + the
 * useRetaylTextInput hook) — that trio is one of the more directly
 * portable pieces since the web variant was already plain HTML input/
 * textarea. Dropped from the original (see internal-docs/technical-documentation/TextInput.md):
 *  - `sanitizeByInputType` from `@retayl/hooks` (workspace-only, not
 *    available) — the decimal-only filter is reimplemented inline since
 *    it's genuinely simple; the rest of the sanitization pass-through
 *    wasn't replicated.
 *  - autoCapitalize/returnKeyType — meaningful on React Native's virtual
 *    keyboard, not on the web DOM.
 * Kept: label, error state + message, required-on-blur validation,
 * prefix/suffix, secure-entry toggle, and the info tooltip (now backed by
 * this library's own Tooltip).
 *
 * Styling: every visual state here (error/focused/disabled/multiline) is a
 * finite condition, so it's expressed as CSS Module modifier classes
 * (TextInput.module.css) — nothing computed at runtime, no inline style.
 */
import { useEffect, useId, useMemo, useState, type ChangeEvent, type FocusEvent, type ReactNode } from 'react';
import { cx } from './cx';
import { Tooltip } from './Tooltip';
import styles from './TextInput.module.css';

export type TextInputMode = 'text' | 'email' | 'tel' | 'url' | 'numeric' | 'decimal' | 'search';

export interface TextInputProps {
  fieldLabel?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  inputMode?: TextInputMode;
  multiline?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
  secureTextEntry?: boolean;
  prefixText?: string;
  suffixText?: string;
  icon?: ReactNode;
  infoMessage?: string;
  maxLength?: number;
  autoFocus?: boolean;
  onBlur?: () => void;
  'aria-label'?: string;
}

function filterDecimal(text: string): string {
  const filtered = text.replace(/[^0-9.]/g, '');
  const parts = filtered.split('.');
  return parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : filtered;
}

const HTML_TYPE: Record<TextInputMode, string> = {
  text: 'text',
  email: 'email',
  tel: 'tel',
  url: 'url',
  numeric: 'text',
  decimal: 'text',
  search: 'search',
};

export function TextInput({
  fieldLabel,
  placeholder,
  value,
  onChangeText,
  inputMode = 'text',
  multiline = false,
  disabled = false,
  readOnly = false,
  required = false,
  error = false,
  errorMessage,
  secureTextEntry = false,
  prefixText,
  suffixText,
  icon,
  infoMessage,
  maxLength,
  autoFocus,
  onBlur,
  ...aria
}: TextInputProps) {
  const reactId = useId();
  const inputId = `ti-${reactId}`;
  const [isFocused, setIsFocused] = useState(false);
  const [touched, setTouched] = useState(false);
  const [secure, setSecure] = useState(secureTextEntry);

  const isEmpty = value.trim() === '';
  const requiredError = touched && required && isEmpty && !error;
  const resolvedError = error || requiredError;
  const resolvedErrorText = errorMessage ?? (requiredError ? 'This field is required' : '');

  useEffect(() => {
    if (!required) setTouched(false);
  }, [required]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const raw = e.target.value;
    onChangeText(inputMode === 'decimal' ? filterDecimal(raw) : raw);
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsFocused(false);
    setTouched(true);
    const trimmed = e.target.value.trim();
    if (trimmed !== e.target.value && !secureTextEntry) onChangeText(trimmed);
    onBlur?.();
  };

  const htmlType = useMemo(() => (secureTextEntry ? (secure ? 'password' : 'text') : HTML_TYPE[inputMode]), [
    secureTextEntry,
    secure,
    inputMode,
  ]);

  const sharedProps = {
    id: inputId,
    value,
    placeholder,
    disabled,
    readOnly,
    autoFocus,
    maxLength,
    onFocus: handleFocus,
    onBlur: handleBlur,
    'aria-label': aria['aria-label'] ?? fieldLabel,
    'aria-invalid': resolvedError || undefined,
    className: cx(styles.input, multiline && styles.multiline, disabled && styles.disabled),
  };

  return (
    <div className={styles.container}>
      {fieldLabel && (
        <div className={styles.labelRow}>
          <label htmlFor={inputId} className={cx(styles.label, resolvedError && styles.error)}>
            {fieldLabel}
            {required && ' *'}
          </label>
          {infoMessage && <Tooltip message={infoMessage} title={fieldLabel} />}
        </div>
      )}
      <div
        className={cx(
          styles.wrapper,
          multiline && styles.multiline,
          isFocused && styles.focused,
          resolvedError && styles.error,
          disabled && styles.disabled,
        )}
      >
        {prefixText && <span className={styles.prefix}>{prefixText}</span>}
        {multiline ? (
          <textarea {...sharedProps} rows={3} onChange={handleChange} />
        ) : (
          <input {...sharedProps} type={htmlType} onChange={handleChange} />
        )}
        {suffixText && <span className={styles.suffix}>{suffixText}</span>}
        {secureTextEntry && (
          <button type="button" onClick={() => setSecure((s) => !s)} className={styles.toggleButton}>
            {secure ? 'Show' : 'Hide'}
          </button>
        )}
        {!secureTextEntry && icon && <span className={styles.iconWrapper}>{icon}</span>}
      </div>
      {resolvedError && resolvedErrorText && (
        <div role="alert" className={styles.errorText}>
          {resolvedErrorText}
        </div>
      )}
    </div>
  );
}

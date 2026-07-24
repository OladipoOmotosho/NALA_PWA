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
 */
import { useEffect, useId, useMemo, useState, type ChangeEvent, type FocusEvent, type ReactNode } from 'react';
import { colors, minTouchTarget, radius, transition } from './theme';
import { Tooltip } from './Tooltip';

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

  const borderColor = resolvedError ? colors.red : isFocused ? colors.teal : colors.line;

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

  const inputStyle = {
    flex: 1,
    minHeight: multiline ? minTouchTarget * 2 : minTouchTarget,
    padding: '10px 12px',
    border: 'none',
    outline: 'none',
    background: 'transparent',
    color: disabled ? colors.muted : colors.text,
    fontSize: 16,
    width: '100%',
    resize: multiline ? ('vertical' as const) : undefined,
  };

  return (
    <div style={{ width: '100%' }}>
      {fieldLabel && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
          <label htmlFor={inputId} style={{ fontSize: 14, color: resolvedError ? colors.red : colors.muted }}>
            {fieldLabel}
            {required && ' *'}
          </label>
          {infoMessage && <Tooltip message={infoMessage} title={fieldLabel} />}
        </div>
      )}
      <div
        style={{
          display: 'flex',
          alignItems: multiline ? 'flex-start' : 'center',
          border: `1px solid ${borderColor}`,
          borderRadius: radius.md,
          background: disabled ? colors.card : '#0e1626',
          opacity: disabled ? 0.6 : 1,
          transition: `border-color ${transition.fast}`,
        }}
      >
        {prefixText && (
          <span style={{ padding: '0 10px', borderRight: `1px solid ${colors.line}`, color: colors.muted, fontSize: 15 }}>
            {prefixText}
          </span>
        )}
        {multiline ? (
          <textarea
            id={inputId}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            autoFocus={autoFocus}
            maxLength={maxLength}
            rows={3}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            aria-label={aria['aria-label'] ?? fieldLabel}
            aria-invalid={resolvedError || undefined}
            style={inputStyle}
          />
        ) : (
          <input
            id={inputId}
            type={htmlType}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            autoFocus={autoFocus}
            maxLength={maxLength}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            aria-label={aria['aria-label'] ?? fieldLabel}
            aria-invalid={resolvedError || undefined}
            style={inputStyle}
          />
        )}
        {suffixText && <span style={{ padding: '0 10px', color: colors.muted, fontSize: 12 }}>{suffixText}</span>}
        {secureTextEntry && (
          <button
            type="button"
            onClick={() => setSecure((s) => !s)}
            style={{ background: 'none', border: 'none', color: colors.muted, padding: '0 12px', cursor: 'pointer' }}
          >
            {secure ? 'Show' : 'Hide'}
          </button>
        )}
        {!secureTextEntry && icon && <span style={{ padding: '0 12px', display: 'flex', alignItems: 'center' }}>{icon}</span>}
      </div>
      {resolvedError && resolvedErrorText && (
        <div role="alert" style={{ color: colors.red, fontSize: 12, marginTop: 4 }}>
          {resolvedErrorText}
        </div>
      )}
    </div>
  );
}

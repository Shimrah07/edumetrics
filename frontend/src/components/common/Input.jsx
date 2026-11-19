import { useState, useId } from 'react';
import './common.css';

/**
 * Reusable accessible Input component with label, validation error,
 * helper text, and password visibility toggle.
 *
 * @param {Object} props
 * @param {string} [props.id] - Element ID (auto-generated if omitted)
 * @param {string} [props.name] - Form field name
 * @param {string} [props.label] - Field label text
 * @param {'text' | 'email' | 'password' | 'number' | 'tel' | 'url'} [props.type='text'] - Input type
 * @param {string} [props.value] - Input value
 * @param {Function} [props.onChange] - Change handler
 * @param {string} [props.placeholder] - Placeholder text
 * @param {string} [props.error] - Validation error message
 * @param {string} [props.helperText] - Supporting guidance text
 * @param {boolean} [props.required=false] - Whether the field is mandatory
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {string} [props.autoComplete] - Autocomplete attribute
 * @param {string} [props.className=''] - Container class name
 * @param {string} [props.inputClassName=''] - Input element class name
 */
export function Input({
  id: customId,
  name,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  autoComplete,
  className = '',
  inputClassName = '',
  ...rest
}) {
  const generatedId = useId();
  const inputId = customId || `input-${generatedId}`;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;

  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === 'password';
  const effectiveType = isPasswordField && showPassword ? 'text' : type;

  // Build aria-describedby for accessibility
  const describedBy = [
    error ? errorId : null,
    helperText ? helperId : null,
  ]
    .filter(Boolean)
    .join(' ') || undefined;

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const inputClasses = [
    'form-input',
    error ? 'form-input--error' : '',
    isPasswordField ? 'form-input--with-toggle' : '',
    inputClassName,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`form-group ${className}`.trim()}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          <span>{label}</span>
          {required && (
            <span className="form-label__required" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <div className="input-wrapper">
        <input
          id={inputId}
          name={name}
          type={effectiveType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-required={required}
          aria-describedby={describedBy}
          className={inputClasses}
          {...rest}
        />

        {isPasswordField && (
          <button
            type="button"
            className="password-toggle-btn"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={disabled ? -1 : 0}
          >
            {showPassword ? (
              // Eye-off icon
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              // Eye icon
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
      </div>

      {error ? (
        <div id={errorId} className="form-error-text" role="alert">
          <svg
            className="form-error-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{error}</span>
        </div>
      ) : helperText ? (
        <div id={helperId} className="form-helper-text">
          {helperText}
        </div>
      ) : null}
    </div>
  );
}

export default Input;

import LoadingSpinner from './LoadingSpinner.jsx';
import './common.css';

/**
 * Reusable Button component supporting multiple variants, sizes, and states.
 *
 * @param {Object} props
 * @param {'button' | 'submit' | 'reset'} [props.type='button'] - Button HTML type
 * @param {'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'} [props.variant='primary'] - Visual style
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Button size
 * @param {boolean} [props.loading=false] - Loading state; disables click and shows spinner
 * @param {string} [props.loadingText] - Optional text displayed while loading
 * @param {boolean} [props.disabled=false] - Whether button is disabled
 * @param {boolean} [props.fullWidth=false] - Whether button expands to full container width
 * @param {React.ReactNode} [props.icon] - Icon placed before text
 * @param {React.ReactNode} [props.iconRight] - Icon placed after text
 * @param {React.ReactNode} props.children - Button content
 * @param {string} [props.className=''] - Additional CSS classes
 */
export function Button({
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingText,
  disabled = false,
  fullWidth = false,
  icon,
  iconRight,
  children,
  className = '',
  ...rest
}) {
  const isDisabled = Boolean(disabled || loading);

  const buttonClasses = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth ? 'btn--full-width' : '',
    loading ? 'btn--loading' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const spinnerVariant =
    variant === 'primary' || variant === 'danger' ? 'white' : 'primary';

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={loading ? 'true' : undefined}
      {...rest}
    >
      {loading ? (
        <>
          <span className="btn__spinner" aria-hidden="true">
            <LoadingSpinner size="sm" variant={spinnerVariant} />
          </span>
          <span>{loadingText || children}</span>
        </>
      ) : (
        <>
          {icon && <span className="btn__icon btn__icon--left" aria-hidden="true">{icon}</span>}
          <span>{children}</span>
          {iconRight && <span className="btn__icon btn__icon--right" aria-hidden="true">{iconRight}</span>}
        </>
      )}
    </button>
  );
}

export default Button;

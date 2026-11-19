import './common.css';

/**
 * Reusable Alert component for system feedback, errors, and announcements.
 *
 * @param {Object} props
 * @param {'info' | 'success' | 'warning' | 'error'} [props.variant='info'] - Alert severity level
 * @param {string} [props.title] - Optional alert title
 * @param {React.ReactNode} props.children - Alert body message
 * @param {Function} [props.onClose] - Optional dismiss callback
 * @param {React.ReactNode} [props.icon] - Optional custom icon
 * @param {string} [props.className=''] - Additional CSS classes
 */
export function Alert({
  variant = 'info',
  title,
  children,
  onClose,
  icon: customIcon,
  className = '',
  ...rest
}) {
  const alertClasses = ['alert', `alert--${variant}`, className]
    .filter(Boolean)
    .join(' ');

  const isError = variant === 'error';

  const defaultIcons = {
    info: (
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
    success: (
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    warning: (
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    error: (
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
  };

  const iconToRender = customIcon || defaultIcons[variant];

  return (
    <div
      className={alertClasses}
      role={isError ? 'alert' : 'status'}
      aria-live={isError ? 'assertive' : 'polite'}
      {...rest}
    >
      {iconToRender && <div className="alert__icon">{iconToRender}</div>}

      <div className="alert__content">
        {title && <div className="alert__title">{title}</div>}
        <div className="alert__message">{children}</div>
      </div>

      {onClose && (
        <button
          type="button"
          className="alert__close"
          onClick={onClose}
          aria-label="Dismiss alert"
        >
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default Alert;

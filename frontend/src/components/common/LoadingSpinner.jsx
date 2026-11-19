import './common.css';

/**
 * Reusable LoadingSpinner component with accessible status announcements.
 *
 * @param {Object} props
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Spinner dimensions
 * @param {'primary' | 'white' | 'muted'} [props.variant='primary'] - Color variant
 * @param {boolean} [props.fullScreen=false] - Whether to render as a full-viewport overlay
 * @param {string} [props.label='Loading...'] - Accessible label for screen readers or visible text
 * @param {boolean} [props.showLabel=false] - Whether to display the text label visibly
 * @param {string} [props.className=''] - Additional CSS classes
 */
export function LoadingSpinner({
  size = 'md',
  variant = 'primary',
  fullScreen = false,
  label = 'Loading...',
  showLabel = false,
  className = '',
}) {
  const rootClasses = [
    'spinner',
    `spinner--${size}`,
    `spinner--${variant}`,
    fullScreen ? 'spinner--fullscreen' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClasses} role="status" aria-live="polite">
      <svg
        className="spinner__svg"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.25"
        />
        <path
          d="M12 3a9 9 0 0 1 9 9"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      {showLabel ? (
        <span className="spinner__label">{label}</span>
      ) : (
        <span className="sr-only">{label}</span>
      )}
    </div>
  );
}

export default LoadingSpinner;

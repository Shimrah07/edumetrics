import './common.css';

/**
 * Reusable Card container for structured surface presentation.
 *
 * @param {Object} props
 * @param {React.ReactNode} [props.title] - Card title heading
 * @param {React.ReactNode} [props.subtitle] - Card subtitle or description
 * @param {React.ReactNode} [props.header] - Custom card header (overrides title/subtitle)
 * @param {React.ReactNode} [props.footer] - Card footer content
 * @param {'flat' | 'sm' | 'md' | 'lg'} [props.elevation='sm'] - Shadow depth
 * @param {'none' | 'sm' | 'md' | 'lg'} [props.padding='md'] - Internal spacing
 * @param {React.ReactNode} props.children - Card body content
 * @param {string} [props.className=''] - Additional CSS classes
 */
export function Card({
  title,
  subtitle,
  header,
  footer,
  elevation = 'sm',
  padding = 'md',
  children,
  className = '',
  ...rest
}) {
  const cardClasses = [
    'card',
    `card--elevation-${elevation}`,
    `card--padding-${padding}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const hasHeader = Boolean(header || title || subtitle);

  return (
    <div className={cardClasses} {...rest}>
      {hasHeader && (
        <div className="card__header">
          {header ? (
            header
          ) : (
            <>
              {title && <h2 className="card__title">{title}</h2>}
              {subtitle && <p className="card__subtitle">{subtitle}</p>}
            </>
          )}
        </div>
      )}

      <div className="card__content">{children}</div>

      {footer && <div className="card__footer">{footer}</div>}
    </div>
  );
}

export default Card;

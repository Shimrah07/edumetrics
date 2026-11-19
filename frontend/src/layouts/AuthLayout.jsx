import { Link, Outlet } from 'react-router-dom';
import './AuthLayout.css';

const CURRENT_YEAR = new Date().getFullYear();

/**
 * Two-column authentication layout for EduMetrics.
 * Provides rich academic institutional branding on desktop and an optimized single-column view on mobile.
 */
export function AuthLayout({ children }) {
  return (
    <div className="auth-layout">
      {/* Left Branding Panel (Desktop) */}
      <aside className="auth-layout__brand" aria-label="EduMetrics Branding and Features">
        <header className="auth-brand__header">
          <Link to="/" className="auth-brand__logo" aria-label="EduMetrics Home">
            <div className="auth-brand__emblem" aria-hidden="true">
              <svg
                className="auth-brand__emblem-svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Academic graduation cap + analytics upward curve */}
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <div className="auth-brand__name">
              Edu<span>Metrics</span>
            </div>
          </Link>
          <p className="auth-brand__tagline">
            Smart Academic Evaluation &amp; Predictive Analytics Platform
          </p>
        </header>

        <div className="auth-brand__body">
          <div className="auth-brand__features-title">Platform Architecture</div>
          <ul className="auth-feature-list">
            <li className="auth-feature-item">
              <div className="auth-feature-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18M9 21V9" />
                </svg>
              </div>
              <div className="auth-feature-text">
                <strong>Multi-Tenant Institutional Isolation</strong>
                <p>Strict schema partitions and role governance across universities, colleges, and schools.</p>
              </div>
            </li>

            <li className="auth-feature-item">
              <div className="auth-feature-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <div className="auth-feature-text">
                <strong>Predictive Student Outcome Analytics</strong>
                <p>Early intervention risk indicators and machine learning performance trajectories.</p>
              </div>
            </li>

            <li className="auth-feature-item">
              <div className="auth-feature-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <div className="auth-feature-text">
                <strong>Argon2id &amp; JWT Security</strong>
                <p>Cryptographically hardened password hashing and stateless, time-bounded token validation.</p>
              </div>
            </li>
          </ul>
        </div>

        <footer className="auth-brand__footer">
          <span>&copy; {CURRENT_YEAR} EduMetrics</span>
          <span>Enterprise Academic Edition</span>
        </footer>
      </aside>

      {/* Right Form Panel */}
      <main className="auth-layout__main">
        {/* Mobile Branding Header */}
        <div className="auth-layout__mobile-header">
          <Link to="/" className="auth-layout__mobile-logo">
            <span className="auth-layout__mobile-name">
              Edu<span>Metrics</span>
            </span>
          </Link>
          <div className="auth-layout__mobile-tagline">
            Smart Academic Evaluation &amp; Predictive Analytics
          </div>
        </div>

        <div className="auth-layout__container">{children || <Outlet />}</div>
      </main>
    </div>
  );
}

export default AuthLayout;

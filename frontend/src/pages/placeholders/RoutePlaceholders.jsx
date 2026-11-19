import { Link, useNavigate } from 'react-router-dom';
import { Card, Button, Alert } from '../../components/common/index.js';
import { useAuth } from '../../hooks/useAuth.js';

/**
 * Temporary page placeholders for EduMetrics route verification.
 * These placeholders will be expanded into dedicated workspaces in Module 2 / Task 07G.
 */

export function LoginPlaceholder() {
  return (
    <div className="app-root">
      <Card title="EduMetrics Login" subtitle="Task 07F Placeholder" elevation="md">
        <p>Login page interface will be implemented in Task 07F.</p>
        <p>
          Need an account? <Link to="/register">Register here</Link>
        </p>
      </Card>
    </div>
  );
}

export function RegisterPlaceholder() {
  return (
    <div className="app-root">
      <Card title="EduMetrics Registration" subtitle="Task 07F Placeholder" elevation="md">
        <p>Registration page interface will be implemented in Task 07F.</p>
        <p>
          Already have an account? <Link to="/login">Sign in here</Link>
        </p>
      </Card>
    </div>
  );
}

export function DashboardPlaceholder() {
  const { user, activeInstitution, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="app-root" style={{ padding: 'var(--space-6) var(--space-4)' }}>
      <div style={{ maxWidth: '640px', width: '100%', margin: '0 auto' }}>
        <Card
          title="EduMetrics Dashboard"
          subtitle="Authenticated Academic Workspace"
          elevation="md"
        >
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
              Welcome back, <strong>{user?.first_name} {user?.last_name || ''}</strong> ({user?.email})
            </p>
            {activeInstitution ? (
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                Active Institution: <strong>{activeInstitution.institution_name}</strong> ({activeInstitution.role})
              </p>
            ) : (
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                No active institutional membership assigned yet.
              </p>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 'var(--space-6)',
              paddingTop: 'var(--space-4)',
              borderTop: '1px solid var(--color-border-subtle)',
            }}
          >
            <Link to="/institutions">
              <Button variant="outline" size="sm">
                Manage Institutions
              </Button>
            </Link>

            <Button
              variant="danger"
              size="sm"
              onClick={handleLogout}
              aria-label="Log out of EduMetrics"
            >
              Sign Out
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export function InstitutionsPlaceholder() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="app-root" style={{ padding: 'var(--space-6) var(--space-4)' }}>
      <div style={{ maxWidth: '640px', width: '100%', margin: '0 auto' }}>
        <Card
          title="Institution Selector"
          subtitle="Multi-Institution Management"
          elevation="md"
        >
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
              User: <strong>{user?.first_name} {user?.last_name || ''}</strong>
            </p>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
              Institutional selection and membership workflows will be expanded in Task 07G.
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 'var(--space-6)',
              paddingTop: 'var(--space-4)',
              borderTop: '1px solid var(--color-border-subtle)',
            }}
          >
            <Link to="/dashboard">
              <Button variant="secondary" size="sm">
                Back to Dashboard
              </Button>
            </Link>

            <Button
              variant="danger"
              size="sm"
              onClick={handleLogout}
              aria-label="Log out of EduMetrics"
            >
              Sign Out
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export function UnauthorizedPlaceholder() {
  return (
    <div className="app-root">
      <Card title="Access Denied" elevation="md">
        <Alert variant="warning" title="Restricted Area">
          You do not have the required institutional membership or role to view this page.
        </Alert>
        <div style={{ marginTop: '1rem' }}>
          <Link to="/dashboard">
            <Button variant="secondary">Return to Dashboard</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

export function NotFoundPlaceholder() {
  return (
    <div className="app-root">
      <Card title="404 — Page Not Found" elevation="md">
        <p>The page you requested does not exist or has been moved.</p>
        <div style={{ marginTop: '1rem' }}>
          <Link to="/">
            <Button variant="primary">Return Home</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

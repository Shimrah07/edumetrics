import { Link } from 'react-router-dom';
import { Card, Button, Alert } from '../../components/common/index.js';

/**
 * Temporary page placeholders for EduMetrics route verification.
 * These placeholders will be replaced with real page components in Task 07F and 07G.
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
  return (
    <div className="app-root">
      <Card title="EduMetrics Dashboard" subtitle="Task 07G Placeholder" elevation="md">
        <p>Authenticated workspace dashboard will be implemented in Task 07G.</p>
        <Link to="/institutions">View Institutions</Link>
      </Card>
    </div>
  );
}

export function InstitutionsPlaceholder() {
  return (
    <div className="app-root">
      <Card title="Institution Selector" subtitle="Task 07G Placeholder" elevation="md">
        <p>Multi-institution management interface will be implemented in Task 07G.</p>
        <Link to="/dashboard">Back to Dashboard</Link>
      </Card>
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

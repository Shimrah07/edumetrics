import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { LoadingSpinner } from '../components/common/index.js';

/**
 * Role-aware route guard for institution-specific workflows.
 *
 * NOTE: Frontend route guards exist strictly for UI navigation and user convenience.
 * They are NOT security boundaries. All data operations, API endpoints, and sensitive
 * resources MUST independently verify authentication, tenant boundaries, and roles
 * on the backend server for every request.
 *
 * @param {Object} props
 * @param {string[]} props.allowedRoles - Roles permitted to access this route (e.g. ['administrator', 'teacher'])
 */
export function RoleProtectedRoute({ allowedRoles = [] }) {
  const { isAuthenticated, isLoading, activeInstitution } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullScreen label="Verifying role permissions..." />;
  }

  // If not authenticated at all, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Must have an active institution membership that is valid and matches an allowed role
  const hasValidActiveMembership =
    activeInstitution &&
    activeInstitution.is_active === true &&
    allowedRoles.includes(activeInstitution.role);

  if (!hasValidActiveMembership) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

export default RoleProtectedRoute;

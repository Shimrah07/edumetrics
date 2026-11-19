import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { LoadingSpinner } from '../components/common/index.js';

/**
 * Route guard for authenticated resources.
 * - Displays a full-screen loading spinner while session restoration is active.
 * - Redirects unauthenticated visitors to /login, preserving the target URL in location state.
 * - Renders child routes via <Outlet /> once authenticated.
 */
export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner fullScreen label="Verifying session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;

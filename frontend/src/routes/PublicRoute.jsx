import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { LoadingSpinner } from '../components/common/index.js';

/**
 * Route guard for public-only auth routes (e.g. /login, /register).
 * - Displays a full-screen loading spinner while session restoration is active.
 * - Redirects already-authenticated users to /dashboard (or previously requested URL).
 * - Renders child routes via <Outlet /> for unauthenticated visitors.
 */
export function PublicRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner fullScreen label="Checking authorization..." />;
  }

  if (isAuthenticated) {
    const fromPath = location.state?.from?.pathname;
    const safeDestination =
      fromPath && fromPath !== '/login' && fromPath !== '/register'
        ? fromPath
        : '/dashboard';

    return <Navigate to={safeDestination} replace />;
  }

  return <Outlet />;
}

export default PublicRoute;

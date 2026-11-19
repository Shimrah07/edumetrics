import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { ProtectedRoute } from './ProtectedRoute.jsx';
import { PublicRoute } from './PublicRoute.jsx';
import { LoadingSpinner } from '../components/common/index.js';
import { LoginPage } from '../pages/auth/LoginPage.jsx';
import { RegisterPage } from '../pages/auth/RegisterPage.jsx';
import {
  DashboardPlaceholder,
  InstitutionsPlaceholder,
  UnauthorizedPlaceholder,
  NotFoundPlaceholder,
} from '../pages/placeholders/RoutePlaceholders.jsx';

/**
 * Root index handler: dynamically redirects to /dashboard if authenticated,
 * or /login if unauthenticated, waiting for session restoration to complete.
 */
function IndexRedirect() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullScreen label="Loading EduMetrics..." />;
  }

  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
}

/**
 * Central routing configuration for EduMetrics.
 */
export function AppRoutes() {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<IndexRedirect />} />

      {/* Public auth routes (accessible only when unauthenticated) */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected routes (accessible only when authenticated) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPlaceholder />} />
        <Route path="/institutions" element={<InstitutionsPlaceholder />} />
        <Route path="/unauthorized" element={<UnauthorizedPlaceholder />} />
      </Route>

      {/* Catch-all 404 handler */}
      <Route path="*" element={<NotFoundPlaceholder />} />
    </Routes>
  );
}

export default AppRoutes;

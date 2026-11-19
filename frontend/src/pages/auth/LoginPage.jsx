import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { AuthLayout } from '../../layouts/AuthLayout.jsx';
import { Card, Input, Button, Alert } from '../../components/common/index.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * EduMetrics User Login Page.
 */
export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      newErrors.email = 'Email address is required.';
    } else if (!EMAIL_REGEX.test(cleanEmail)) {
      newErrors.email = 'Please enter a valid email address (e.g. user@institution.edu).';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await login(email.trim().toLowerCase(), password);

      // Resolve safe post-login redirection path
      const fromPath = location.state?.from?.pathname;
      const safePath =
        fromPath &&
        fromPath.startsWith('/') &&
        !fromPath.startsWith('//') &&
        fromPath !== '/login' &&
        fromPath !== '/register'
          ? fromPath
          : '/dashboard';

      navigate(safePath, { replace: true });
    } catch (err) {
      const status = err.response?.status;
      const detail = err.response?.data?.detail;

      if (status === 401) {
        setGeneralError('Invalid email or password. Please verify your credentials.');
      } else if (status === 403) {
        setGeneralError(
          typeof detail === 'string'
            ? detail
            : 'Your account is currently inactive. Please contact your institution administrator.',
        );
      } else if (status === 422 && Array.isArray(detail)) {
        // Pydantic validation error format
        const errorMsg = detail.map((d) => d.msg).join('; ');
        setGeneralError(`Validation error: ${errorMsg}`);
      } else if (typeof detail === 'string') {
        setGeneralError(detail);
      } else if (!err.response) {
        setGeneralError(
          'Unable to reach authentication server. Please check your network connection.',
        );
      } else {
        setGeneralError('An unexpected authentication error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <Card
        title="Sign in to your account"
        subtitle="Enter your institutional email to access your analytics workspace."
        elevation="sm"
      >
        {generalError && (
          <Alert
            variant="error"
            title="Authentication Failed"
            onClose={() => setGeneralError('')}
          >
            {generalError}
          </Alert>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <Input
            id="login-email"
            name="email"
            label="Email Address"
            type="email"
            placeholder="e.g. professor@university.edu"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) {
                setErrors((prev) => ({ ...prev, email: undefined }));
              }
            }}
            error={errors.email}
            disabled={isSubmitting}
            autoComplete="email"
            required
          />

          <Input
            id="login-password"
            name="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) {
                setErrors((prev) => ({ ...prev, password: undefined }));
              }
            }}
            error={errors.password}
            disabled={isSubmitting}
            autoComplete="current-password"
            required
          />

          <div style={{ marginTop: 'var(--space-6)' }}>
            <Button
              type="submit"
              variant="primary"
              size="md"
              fullWidth
              loading={isSubmitting}
              loadingText="Signing in..."
            >
              Sign In
            </Button>
          </div>
        </form>

        <div
          style={{
            marginTop: 'var(--space-6)',
            paddingTop: 'var(--space-4)',
            borderTop: '1px solid var(--color-border-subtle)',
            textAlign: 'center',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-muted)',
          }}
        >
          Don&apos;t have an account yet?{' '}
          <Link
            to="/register"
            style={{ fontWeight: 'var(--font-weight-medium)' }}
          >
            Create an account
          </Link>
        </div>
      </Card>
    </AuthLayout>
  );
}

export default LoginPage;

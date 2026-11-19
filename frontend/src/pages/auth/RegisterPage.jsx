import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { AuthLayout } from '../../layouts/AuthLayout.jsx';
import { Card, Input, Button, Alert } from '../../components/common/index.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * EduMetrics New User Account Registration Page.
 */
export function RegisterPage() {
  const { register } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const newErrors = {};

    const cleanFirstName = firstName.trim();
    if (!cleanFirstName) {
      newErrors.firstName = 'First name is required.';
    } else if (cleanFirstName.length > 100) {
      newErrors.firstName = 'First name cannot exceed 100 characters.';
    }

    const cleanLastName = lastName.trim();
    if (cleanLastName && cleanLastName.length > 100) {
      newErrors.lastName = 'Last name cannot exceed 100 characters.';
    }

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      newErrors.email = 'Email address is required.';
    } else if (!EMAIL_REGEX.test(cleanEmail)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
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
      const registrationData = {
        first_name: firstName.trim(),
        last_name: lastName.trim() || undefined,
        email: email.trim().toLowerCase(),
        password,
      };

      await register(registrationData);

      setIsSuccess(true);
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setErrors({});
    } catch (err) {
      const status = err.response?.status;
      const detail = err.response?.data?.detail;

      if (status === 409) {
        setGeneralError(
          'An account with this email address already exists. Please sign in or use a different institutional email.',
        );
      } else if (status === 422 && Array.isArray(detail)) {
        const errorMsg = detail.map((d) => d.msg).join('; ');
        setGeneralError(`Validation error: ${errorMsg}`);
      } else if (typeof detail === 'string') {
        setGeneralError(detail);
      } else if (!err.response) {
        setGeneralError(
          'Unable to reach registration server. Please check your network connection.',
        );
      } else {
        setGeneralError('An unexpected registration error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <Card
        title="Create your account"
        subtitle="Get started with EduMetrics institutional analytics and evaluation."
        elevation="sm"
      >
        {isSuccess ? (
          <div>
            <Alert variant="success" title="Account Successfully Created">
              Your EduMetrics user account has been registered. You can now sign in to your workspace using your credentials.
            </Alert>
            <div style={{ marginTop: 'var(--space-6)' }}>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Button variant="primary" size="md" fullWidth>
                  Proceed to Sign In
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {generalError && (
              <Alert
                variant="error"
                title="Registration Failed"
                onClose={() => setGeneralError('')}
              >
                {generalError}
              </Alert>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                <Input
                  id="register-firstname"
                  name="first_name"
                  label="First Name"
                  placeholder="e.g. Eleanor"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    if (errors.firstName) {
                      setErrors((prev) => ({ ...prev, firstName: undefined }));
                    }
                  }}
                  error={errors.firstName}
                  disabled={isSubmitting}
                  autoComplete="given-name"
                  required
                />

                <Input
                  id="register-lastname"
                  name="last_name"
                  label="Last Name"
                  placeholder="e.g. Vance"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    if (errors.lastName) {
                      setErrors((prev) => ({ ...prev, lastName: undefined }));
                    }
                  }}
                  error={errors.lastName}
                  disabled={isSubmitting}
                  autoComplete="family-name"
                />
              </div>

              <Input
                id="register-email"
                name="email"
                label="Institutional Email"
                type="email"
                placeholder="e.g. user@institution.edu"
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
                id="register-password"
                name="password"
                label="Password"
                type="password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors((prev) => ({ ...prev, password: undefined }));
                  }
                }}
                error={errors.password}
                helperText="Must be at least 8 characters long"
                disabled={isSubmitting}
                autoComplete="new-password"
                required
              />

              <div style={{ marginTop: 'var(--space-6)' }}>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  fullWidth
                  loading={isSubmitting}
                  loadingText="Creating account..."
                >
                  Create Account
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
              Already have an account?{' '}
              <Link to="/login" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                Sign in here
              </Link>
            </div>
          </>
        )}
      </Card>
    </AuthLayout>
  );
}

export default RegisterPage;

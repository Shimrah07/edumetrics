import { useState, useEffect, useCallback, useMemo } from 'react';
import { AuthContext } from './authContextDef.js';
import {
  getStoredToken,
  setStoredToken,
  removeStoredToken,
  onUnauthorized,
} from '../services/api.js';
import { authApi } from '../services/authApi.js';
import {
  getStoredInstitutionId,
  setStoredInstitutionId,
  removeStoredInstitutionId,
  resolveActiveInstitution,
} from '../utils/authStorage.js';

export { AuthContext };

/**
 * Centralized Authentication Context Provider for EduMetrics.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [activeInstitution, setActiveInstitutionState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Logout clears all in-memory and stored auth artifacts
  const logout = useCallback(() => {
    removeStoredToken();
    removeStoredInstitutionId();
    setToken(null);
    setUser(null);
    setActiveInstitutionState(null);
  }, []);

  // Set the user's active institution with strict security validation
  const setActiveInstitution = useCallback(
    (institutionId) => {
      if (!user || !user.memberships) {
        throw new Error('Cannot set active institution without an authenticated user.');
      }

      const activeMemberships = (user.memberships || []).filter(
        (m) => m && m.is_active === true,
      );

      const target = activeMemberships.find(
        (m) => String(m.institution_id) === String(institutionId),
      );

      if (!target) {
        throw new Error(
          'Invalid institution selection: No active membership found for this institution.',
        );
      }

      setActiveInstitutionState(target);
      setStoredInstitutionId(target.institution_id);
      return target;
    },
    [user],
  );

  // User authentication flow
  const login = useCallback(
    async (email, password) => {
      // 1. Request access token
      const tokenResponse = await authApi.login({ email, password });
      const accessToken = tokenResponse?.access_token;

      if (!accessToken) {
        throw new Error('Login failed: No access token received from authentication server.');
      }

      // 2. Store access token for upcoming authenticated requests
      setStoredToken(accessToken);
      setToken(accessToken);

      try {
        // 3. Fetch authenticated profile
        const profile = await authApi.getMe();

        // 4. Resolve active institution
        const preferredId = getStoredInstitutionId();
        const resolved = resolveActiveInstitution(profile?.memberships, preferredId);

        setUser(profile);
        setActiveInstitutionState(resolved);

        if (resolved) {
          setStoredInstitutionId(resolved.institution_id);
        } else {
          removeStoredInstitutionId();
        }

        return {
          user: profile,
          token: accessToken,
          activeInstitution: resolved,
        };
      } catch (profileError) {
        // Clear token and state to prevent partial authentication
        removeStoredToken();
        removeStoredInstitutionId();
        setToken(null);
        setUser(null);
        setActiveInstitutionState(null);
        throw profileError;
      }
    },
    [],
  );

  // New user registration flow
  const register = useCallback(async (registrationData) => {
    return await authApi.register(registrationData);
  }, []);

  // Initial session restoration and unauthorized-event handling
  useEffect(() => {
    let isMounted = true;

    // Listen for 401 unauthorized session notifications from api client
    const unsubscribeUnauthorized = onUnauthorized(() => {
      if (isMounted) {
        logout();
      }
    });

    const restoreSession = async () => {
      const storedToken = getStoredToken();

      if (!storedToken) {
        if (isMounted) {
          setToken(null);
          setUser(null);
          setActiveInstitutionState(null);
          setIsLoading(false);
        }
        return;
      }

      try {
        // Token exists in client storage; fetch profile to validate and hydrate
        const profile = await authApi.getMe();

        if (isMounted) {
          setToken(storedToken);
          setUser(profile);

          const preferredId = getStoredInstitutionId();
          const resolved = resolveActiveInstitution(profile?.memberships, preferredId);
          setActiveInstitutionState(resolved);

          if (resolved) {
            setStoredInstitutionId(resolved.institution_id);
          } else {
            removeStoredInstitutionId();
          }
        }
      } catch {
        // Stale, malformed, or expired token; clean up state
        if (isMounted) {
          removeStoredToken();
          removeStoredInstitutionId();
          setToken(null);
          setUser(null);
          setActiveInstitutionState(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
      unsubscribeUnauthorized();
    };
  }, [logout]);

  const isAuthenticated = Boolean(token && user);

  const contextValue = useMemo(
    () => ({
      user,
      token,
      isAuthenticated,
      isLoading,
      activeInstitution,
      login,
      register,
      logout,
      setActiveInstitution,
    }),
    [
      user,
      token,
      isAuthenticated,
      isLoading,
      activeInstitution,
      login,
      register,
      logout,
      setActiveInstitution,
    ],
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;

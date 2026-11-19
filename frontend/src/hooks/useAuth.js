import { useContext } from 'react';
import { AuthContext } from '../context/authContextDef.js';

/**
 * Custom hook to access EduMetrics authentication context and operations.
 * Must be used within an AuthProvider.
 *
 * @returns {Object} Auth context state and actions
 * @throws {Error} If called outside of an AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }

  return context;
}

export default useAuth;

import api from './api.js';

/**
 * Register a new user.
 * @param {Object} userData - { first_name, last_name, email, password }
 * @returns {Promise<Object>} Created user data
 */
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

/**
 * Authenticate a user with email and password.
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} Token response { access_token, token_type, expires_in }
 */
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

/**
 * Get profile and institution memberships of the currently authenticated user.
 * @returns {Promise<Object>} Authenticated user profile with memberships
 */
export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const authApi = {
  register,
  login,
  getMe,
};

export default authApi;

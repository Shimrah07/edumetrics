import axios from 'axios';

export const TOKEN_KEY = 'edumetrics_access_token';

const getStorage = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  if (typeof localStorage !== 'undefined') {
    return localStorage;
  }
  return null;
};

export const getStoredToken = () => {
  const storage = getStorage();
  return storage ? storage.getItem(TOKEN_KEY) : null;
};

export const setStoredToken = (token) => {
  const storage = getStorage();
  if (storage) {
    if (token) {
      storage.setItem(TOKEN_KEY, token);
    } else {
      storage.removeItem(TOKEN_KEY);
    }
  }
};

export const removeStoredToken = () => {
  const storage = getStorage();
  if (storage) {
    storage.removeItem(TOKEN_KEY);
  }
};

// Unauthorized callbacks registry
const unauthorizedListeners = new Set();

export const onUnauthorized = (callback) => {
  if (typeof callback === 'function') {
    unauthorizedListeners.add(callback);
    return () => {
      unauthorizedListeners.delete(callback);
    };
  }
  return () => {};
};

const notifyUnauthorized = () => {
  unauthorizedListeners.forEach((callback) => {
    try {
      callback();
    } catch (err) {
      console.error('Error executing unauthorized listener:', err);
    }
  });
};

const baseURL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
});

// Request interceptor: attach Authorization header if token exists
api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: handle responses and handle 401 gracefully
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const requestUrl = error.config?.url || '';

      // Handle 401 Unauthorized
      if (status === 401) {
        // Do NOT redirect or clear state if this is the login attempt itself
        const isAuthLoginRequest = requestUrl.includes('/auth/login');
        if (!isAuthLoginRequest) {
          // Stale or invalid token for an authenticated endpoint:
          // remove stale token and notify active subscribers without force-redirecting
          removeStoredToken();
          notifyUnauthorized();
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

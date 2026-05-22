import axios from 'axios';

// Create an axios instance for our API
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Attach JWT token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('np_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle expired tokens automatically
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('np_token');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default api;

/**
 * Handles silent demo authentication.
 * Registers a demo user if needed, then logs in to get a JWT token.
 * Stores the token in localStorage for subsequent API calls.
 */
export const authService = {
  ensureAuthenticated: async () => {
    const token = localStorage.getItem('np_token');
    if (token) return true;

    const creds = { email: 'demo@neuropredict.ai', password: 'DemoPass_2024!' };

    // Try login first (user may already exist)
    try {
      const loginRes = await api.post('/auth/login', creds);
      if (loginRes.data?.data?.token) {
        localStorage.setItem('np_token', loginRes.data.data.token);
        return true;
      }
    } catch {
      // Login failed — user probably doesn't exist yet, try registering
    }

    try {
      // Register the demo user
      await api.post('/auth/register', creds);
      // Now login to get token (register doesn't return a token)
      const loginRes = await api.post('/auth/login', creds);
      if (loginRes.data?.data?.token) {
        localStorage.setItem('np_token', loginRes.data.data.token);
        return true;
      }
    } catch (err) {
      console.error('Demo authentication failed:', err);
    }

    return false;
  }
};

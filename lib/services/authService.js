import api from '@/lib/api';

/**
 * Fetch CSRF cookie before any state-changing request (required by Laravel Sanctum)
 */
const getCsrfCookie = () => api.get('/sanctum/csrf-cookie');

const authService = {
  /**
   * Login user
   * @param {{ email: string, password: string }} credentials
   */
  login: async (credentials) => {
    await getCsrfCookie();
    const response = await api.post('/api/login', credentials);
    return response.data;
  },

  /**
   * Register new user
   * @param {{ username: string, email: string, password: string }} data
   */
  register: async (data) => {
    await getCsrfCookie();
    const response = await api.post('/api/register', data);
    return response.data;
  },

  /**
   * Logout current user
   */
  logout: async () => {
    const response = await api.post('/api/logout');
    return response.data;
  },

  /**
   * Request password reset email
   * @param {{ email: string }} data
   */
  forgotPassword: async (data) => {
    await getCsrfCookie();
    const response = await api.post('/api/forgot-password', data);
    return response.data;
  },

  /**
   * Reset password with token
   * @param {{ token: string, email: string, password: string, password_confirmation: string }} data
   */
  resetPassword: async (data) => {
    await getCsrfCookie();
    const response = await api.post('/api/reset-password', data);
    return response.data;
  },

  /**
   * Get currently authenticated user (returns null if not logged in)
   */
  getUser: async () => {
    const response = await api.get('/api/user');
    return response.data;
  },
};

export default authService;

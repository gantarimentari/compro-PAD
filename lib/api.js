import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

// Helper function to get XSRF token from cookie
const getXsrfToken = () => {
  if (typeof document === 'undefined') return ''; // SSR safety
  
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1];
  
  return token ? decodeURIComponent(token) : '';
};

// Add request interceptor to automatically include XSRF token
api.interceptors.request.use(
  (config) => {
    // Only add XSRF token for state-changing methods
    if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase())) {
      const token = getXsrfToken();
      if (token) {
        config.headers['X-XSRF-TOKEN'] = token;
      }
    }

     console.log('📤 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.baseURL + config.url,
      data: config.data,
      headers: {
        'X-XSRF-TOKEN': config.headers['X-XSRF-TOKEN'] ? '✓ Present' : '✗ Missing',
        'Accept': config.headers['Accept']
      }
    });

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 419 errors (CSRF token mismatch)
api.interceptors.response.use(
  (response) => {console.log('api response:', {
    url: response.config.url,
    status:response.status,
    statusText: response.statusText,
    data:response.data
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    console.error('❌ API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });

    // If we get a 419 error and haven't retried yet
    if (error.response?.status === 419 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh CSRF token
        await api.get('/sanctum/csrf-cookie');
        
        // Get new token and update header
        const newToken = getXsrfToken();
        if (newToken) {
          originalRequest.headers['X-XSRF-TOKEN'] = newToken;
        }

        // Retry the original request
        return api(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

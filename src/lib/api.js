import axios from 'axios';
import { getBackendBaseUrl } from './backendUrl';

const api = axios.create({
  baseURL: getBackendBaseUrl(),
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
api.interceptors.   request.use(
  (config) => {
    const token = typeof document !== 'undefined'
      ? document.cookie
          .split('; ')
          .find(row => row.startsWith('XSRF-TOKEN='))
          ?.split('=')[1]
      : null;

    if (token) {
      config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
    }

    console.log('📤 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      data: config.data,
      headers: {
        'X-XSRF-TOKEN': token ? '✓ Present' : '✗ Missing',
        'Accept': config.headers.Accept,
      }
    });

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      url: response.config.url,
      status: response.status,
      statusText: response.statusText,
      data: response.data
    });
    return response;
  },
  (error) => {
    //  Don't log 401 errors from /api/user (expected for guests)
    const is401Error = error.response?.status === 401;
    const is401UserCheck = is401Error && 
                          error.config?.url?.includes('/api/user');
    
    if (!is401Error) {
      //  Only log non-401 errors
      console.error('❌ API Error:', {
        url: error.config?.url,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
    } else {
      //  Silent for 401 responses; individual callers can handle it if needed
      if (is401UserCheck) {
        console.log('👤 User check: Not authenticated (guest mode)');
      }
    }

    return Promise.reject(error);
  }
);

export default api;

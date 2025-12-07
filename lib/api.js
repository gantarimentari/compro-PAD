import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];

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
    // ✅ Don't log 401 errors from /api/user (expected for guests)
    const is401UserCheck = error.response?.status === 401 && 
                          error.config?.url?.includes('/api/user');
    
    if (!is401UserCheck) {
      // ✅ Only log non-401 errors or 401 from other endpoints
      console.error('❌ API Error:', {
        url: error.config?.url,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
    } else {
      // ✅ Silent log for expected 401 from /api/user
      console.log('👤 User check: Not authenticated (guest mode)');
    }

    return Promise.reject(error);
  }
);

export default api;

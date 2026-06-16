// import api from '@/lib/api';

// /**
//  * Fetch CSRF cookie before any state-changing request (required by Laravel Sanctum)
//  */
// const getCsrfCookie = () => api.get('/sanctum/csrf-cookie');

// const authService = {
//   /**
//    * Login user
//    * @param {{ email: string, password: string }} credentials
//    */
//   login: async (credentials) => {
//     await getCsrfCookie();
//     const response = await api.post('/api/login', credentials);
//     return response.data;
//   },

//   /**
//    * Register new user
//    * @param {{ username: string, email: string, password: string }} data
//    */
//   register: async (data) => {
//     await getCsrfCookie();
//     const response = await api.post('/api/register', data);
//     return response.data;
//   },

//   /**
//    * Logout current user
//    */
//   logout: async () => {
//     const response = await api.post('/api/logout');
//     return response.data;
//   },

//   /**
//    * Request password reset email
//    * @param {{ email: string }} data
//    */
//   forgotPassword: async (data) => {
//     await getCsrfCookie();
//     const response = await api.post('/api/forgot-password', data);
//     return response.data;
//   },

//   /**
//    * Reset password with token
//    * @param {{ token: string, email: string, password: string, password_confirmation: string }} data
//    */
//   resetPassword: async (data) => {
//     await getCsrfCookie();
//     const response = await api.post('/api/reset-password', data);
//     return response.data;
//   },

//   /**
//    * Get currently authenticated user (returns null if not logged in)
//    */
//   getUser: async () => {
//     const response = await api.get('/api/user');
//     return response.data;
//   },
// };

// export default authService;

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
    // 🌟 PENTING: Bungkus CSRF cookie dengan try-catch agar jika diblokir Ngrok/Vercel, login TIDAK PATAH
    try {
      await getCsrfCookie();
    } catch (e) {
      console.log('⚠️ CSRF Cookie diblokir browser karena lintas domain (Ngrok/Vercel). Beralih penuh ke Bearer Token mode.');
    }
    
    // Kirim request login biasa
    const response = await api.post('/api/login', credentials);
    
    // Simpan token ke localStorage jika sukses
    const token = response?.data?.bearer_token || response?.bearer_token;
    if (token) {
      localStorage.setItem('auth_token', token);
    }
    
    return response.data || response;
  },

  /**
   * Register new user
   * @param {{ username: string, email: string, password: string }} data
   */
  register: async (data) => {
    // 🌟 Amankan dari pemblokiran cookie lintas domain
    try {
      await getCsrfCookie();
    } catch (e) {
      console.log('⚠️ CSRF Cookie diblokir saat register. Menggunakan mode stateless.');
    }
    
    const response = await api.post('/api/register', data);
    return response.data || response;
  },
  /**
   * Logout current user
   */
  logout: async () => {
    try {
        // 1. Tembak API Laravel untuk menghapus token di database
        const response = await api.post('/api/logout');
        return response.data;
    } catch (error) {
        // Log error-nya ke konsol agar kamu tetap bisa memantau jika ada masalah API
        console.error("API Logout gagal, melanjutkan pembersihan lokal:", error);
        // Tetap lempar error jika komponen UI membutuhkan statusnya, 
        // tapi pastikan blok 'finally' di bawah tetap jalan.
    } finally {
        // 2. 🌟 BLOK INI DIJAMIN PASTI JALAN DALAM KONDISI APAPUN
        if (typeof window !== 'undefined') {
            // Hapus SEMUA key yang berhubungan dengan login kamu
            localStorage.removeItem('auth_token'); 
            localStorage.removeItem('user'); // Sesuai dengan data "user" yang nyangkut di gambarmu tadi
            
            // 3. Tendang user kembali ke halaman login
            window.location.href = '/auth/login';
        }
    }
},

  /**
   * Request password reset email
   * @param {{ email: string }} data
   */
  forgotPassword: async (data) => {
    // 🌟 Amankan dari pemblokiran cookie lintas domain
    try {
      await getCsrfCookie();
    } catch (e) {
      console.log('⚠️ CSRF Cookie diblokir saat forgot-password. Menggunakan mode stateless.');
    }
    
    const response = await api.post('/api/forgot-password', data);
    return response.data || response;
  },

  /**
   * Reset password with token
   * @param {{ token: string, email: string, password: string, password_confirmation: string }} data
   */
  resetPassword: async (data) => {
    // 🌟 Amankan dari pemblokiran cookie lintas domain
    try {
      await getCsrfCookie();
    } catch (e) {
      console.log('⚠️ CSRF Cookie diblokir saat reset-password. Menggunakan mode stateless.');
    }
    
    const response = await api.post('/api/reset-password', data);
    return response.data || response;
  },

  /**
   * Get currently authenticated user (returns null if not logged in)
   */
  getUser: async () => {
    // 1. 🌟 Cek apakah kode sedang berjalan di browser dan apakah token tersedia
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      
      // Jika token TIDAK ADA, langsung batalkan request dan kembalikan null
      if (!token) {
        console.log('User belum login (Tidak ada token di localStorage). Menggagalkan request /api/user.');
        return null;
      }
    }

    // 2. Jika token ada, baru tembak ke backend Laravel seperti biasa
    try {
      const response = await api.get('/api/user');
      return response.data;
    } catch (error) {
      console.error('Gagal mengambil data user (Token tidak valid/expired):', error);
      // Jika error karena token kedaluwarsa di backend, kembalikan null agar frontend tahu session habis
      return null;
    }
  }
};

export default authService;
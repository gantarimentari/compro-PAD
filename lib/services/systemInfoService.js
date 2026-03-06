import api from '@/lib/api';

const systemInfoService = {
  /**
   * Get system/clinic information
   * @returns {Promise<object>}
   */
  get: async () => {
    const response = await api.get('/api/system-info');
    return response.data;
  },

  /**
   * Update system/clinic information
   * @param {object} data - Clinic settings (clinic_name, address, phone, email, etc.)
   */
  update: async (data) => {
    const response = await api.put('/api/system-info', data);
    return response.data;
  },

  // --- Social Media ---

  /**
   * Get all social media links
   * @returns {Promise<Array>}
   */
  getSocialMedia: async () => {
    const response = await api.get('/api/social-media');
    return response.data;
  },

  /**
   * Add a social media link
   * @param {{ platform: string, url: string }} data
   */
  addSocialMedia: async (data) => {
    const response = await api.post('/api/social-media', data);
    return response.data;
  },

  /**
   * Update a social media link by ID
   * @param {number|string} id
   * @param {{ platform?: string, url?: string }} data
   */
  updateSocialMedia: async (id, data) => {
    const response = await api.put(`/api/social-media/${id}`, data);
    return response.data;
  },

  /**
   * Delete a social media link by ID
   * @param {number|string} id
   */
  removeSocialMedia: async (id) => {
    const response = await api.delete(`/api/social-media/${id}`);
    return response.data;
  },
};

export default systemInfoService;

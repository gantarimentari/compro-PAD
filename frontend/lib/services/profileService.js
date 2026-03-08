import api from '@/lib/api';

const profileService = {
  /**
   * Get current user's profile
   * @returns {Promise<object>}
   */
  get: async () => {
    const response = await api.get('/api/profile');
    return response.data;
  },

  /**
   * Update current user's profile
   * @param {{ username?: string, phone_number?: string }} data
   */
  update: async (data) => {
    const response = await api.put('/api/profile', data);
    return response.data;
  },
};

export default profileService;

import api from '@/lib/api';

const mediaService = {
  /**
   * Get media list
   * @param {{ excludeVideo?: boolean, days?: number|string }} options
   * @returns {Promise<Array>}
   */
  getAll: async ({ excludeVideo = false, days = null } = {}) => {
    const params = new URLSearchParams();
    if (excludeVideo) params.append('exclude_video', 'true');
    if (days) params.append('days', days);
    const query = params.toString();
    const response = await api.get(`/api/media${query ? `?${query}` : ''}`);
    return response.data;
  },

  /**
   * Get media statistics
   * @returns {Promise<object>}
   */
  getStatistics: async () => {
    const response = await api.get('/api/media/statistics');
    return response.data;
  },

  /**
   * Upload new media
   * @param {FormData} formData - Must include: category, file?, video_url?, name?
   */
  create: async (formData) => {
    const response = await api.post('/api/media', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /**
   * Delete media by ID
   * @param {number|string} id
   */
  remove: async (id) => {
    const response = await api.delete(`/api/media/${id}`);
    return response.data;
  },
};

export default mediaService;

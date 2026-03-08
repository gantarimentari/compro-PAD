import api from '@/lib/api';

const promoService = {
  /**
   * Get all promotions (admin)
   * @returns {Promise<Array>}
   */
  getAll: async () => {
    const response = await api.get('/api/promos');
    return response.data;
  },

  /**
   * Get public promotions (no auth required)
   * @returns {Promise<Array>}
   */
  getPublic: async () => {
    const response = await api.get('/api/public/promos');
    return response.data;
  },

  /**
   * Create a new promotion
   * @param {{ title: string, description: string, start_date: string, end_date: string, status: string }} data
   */
  create: async (data) => {
    const response = await api.post('/api/promos', data);
    return response.data;
  },

  /**
   * Update a promotion by ID
   * @param {number|string} id
   * @param {{ title?: string, description?: string, start_date?: string, end_date?: string, status?: string }} data
   */
  update: async (id, data) => {
    const response = await api.put(`/api/promos/${id}`, data);
    return response.data;
  },

  /**
   * Delete a promotion by ID
   * @param {number|string} id
   */
  remove: async (id) => {
    const response = await api.delete(`/api/promos/${id}`);
    return response.data;
  },
};

export default promoService;

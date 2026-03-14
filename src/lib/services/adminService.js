import api from '@/lib/api';

const adminService = {
  /**
   * Get all admin accounts
   * @returns {Promise<Array>}
   */
  getAll: async () => {
    const response = await api.get('/api/admins');
    return response.data;
  },

  /**
   * Create a new admin account
   * @param {{ username: string, email: string, password: string, phone_number?: string }} data
   */
  create: async (data) => {
    const response = await api.post('/api/admins', data);
    return response.data;
  },

  /**
   * Update an admin account by ID
   * @param {number|string} id
   * @param {{ username?: string, email?: string, password?: string, phone_number?: string }} data
   */
  update: async (id, data) => {
    const response = await api.put(`/api/admins/${id}`, data);
    return response.data;
  },

  /**
   * Delete an admin account by ID
   * @param {number|string} id
   */
  remove: async (id) => {
    const response = await api.delete(`/api/admins/${id}`);
    return response.data;
  },
};

export default adminService;

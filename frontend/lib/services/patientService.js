import api from '@/lib/api';

const patientService = {
  /**
   * Get all patients
   * @returns {Promise<Array>}
   */
  getAll: async () => {
    const response = await api.get('/api/patients');
    return response.data;
  },

  /**
   * Create a new patient
   * @param {{ name: string, phone_number: string, email: string, password: string, pets?: Array }} data
   */
  create: async (data) => {
    const response = await api.post('/api/patients', data);
    return response.data;
  },

  /**
   * Update a patient by ID
   * @param {number|string} id
   * @param {{ name?: string, phone_number?: string, email?: string, password?: string }} data
   */
  update: async (id, data) => {
    const response = await api.put(`/api/patients/${id}`, data);
    return response.data;
  },

  /**
   * Delete a patient by ID
   * @param {number|string} id
   */
  remove: async (id) => {
    const response = await api.delete(`/api/patients/${id}`);
    return response.data;
  },
};

export default patientService;

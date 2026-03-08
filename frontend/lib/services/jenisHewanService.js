import api from '@/lib/api';

const jenisHewanService = {
  /**
   * Get all animal species (with optional owner filter)
   * @param {number|string|null} ownerId - Optional owner/patient ID filter
   * @returns {Promise<Array>}
   */
  getAll: async (ownerId = null) => {
    const url = ownerId ? `/api/jenis-hewan?id_pasien=${ownerId}` : '/api/jenis-hewan';
    const response = await api.get(url);
    return response.data;
  },

  /**
   * Create a new animal species
   * @param {{ nama_jenis: string }} data
   */
  create: async (data) => {
    const response = await api.post('/api/jenis-hewan', data);
    return response.data;
  },

  /**
   * Update an animal species by ID
   * @param {number|string} id
   * @param {{ nama_jenis: string }} data
   */
  update: async (id, data) => {
    const response = await api.put(`/api/jenis-hewan/${id}`, data);
    return response.data;
  },

  /**
   * Delete an animal species by ID
   * @param {number|string} id
   */
  remove: async (id) => {
    const response = await api.delete(`/api/jenis-hewan/${id}`);
    return response.data;
  },
};

export default jenisHewanService;

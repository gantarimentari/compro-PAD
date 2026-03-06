import api from '@/lib/api';

const hewanService = {
  /**
   * Get all animals
   * @returns {Promise<Array>}
   */
  getAll: async () => {
    const response = await api.get('/api/hewan');
    return response.data;
  },

  /**
   * Create a new animal
   * @param {{ id_pasien: number, id_jenisHewan: number, nama_hewan: string, tanggal_lahir_hewan?: string, umur?: number }} data
   */
  create: async (data) => {
    const response = await api.post('/api/hewan', data);
    return response.data;
  },

  /**
   * Update an animal by ID
   * @param {number|string} id
   * @param {{ id_pasien?: number, id_jenisHewan?: number, nama_hewan?: string }} data
   */
  update: async (id, data) => {
    const response = await api.put(`/api/hewan/${id}`, data);
    return response.data;
  },

  /**
   * Delete an animal by ID
   * @param {number|string} id
   */
  remove: async (id) => {
    const response = await api.delete(`/api/hewan/${id}`);
    return response.data;
  },
};

export default hewanService;

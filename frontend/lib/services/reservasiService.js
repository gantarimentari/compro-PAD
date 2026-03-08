import api from '@/lib/api';

const reservasiService = {
  /**
   * Get all reservations
   * @returns {Promise<Array>}
   */
  getAll: async () => {
    const response = await api.get('/api/reservations');
    return response.data;
  },

  /**
   * Create a new reservation
   * @param {{ id_pasien: number, id_hewan: number, tanggal_reservasi: string, keluhan: string, status?: string }} data
   */
  create: async (data) => {
    const response = await api.post('/api/reservations', data);
    return response.data;
  },

  /**
   * Update a reservation by ID
   * @param {number|string} id
   * @param {{ id_pasien?: number, id_hewan?: number, tanggal_reservasi?: string, keluhan?: string }} data
   */
  update: async (id, data) => {
    const response = await api.put(`/api/reservations/${id}`, data);
    return response.data;
  },

  /**
   * Update only the status of a reservation
   * @param {number|string} id
   * @param {string} status - 'pending' | 'belum' | 'selesai' | 'batal'
   */
  updateStatus: async (id, status) => {
    const response = await api.patch(`/api/reservations/${id}/status`, { status });
    return response.data;
  },

  /**
   * Delete a reservation by ID
   * @param {number|string} id
   */
  remove: async (id) => {
    const response = await api.delete(`/api/reservations/${id}`);
    return response.data;
  },
};

export default reservasiService;

import api from '@/lib/api';

const jenisVaksinService = {
  getAll: async () => {
    const response = await api.get('/api/jenis-vaksin');
    return response.data;
  },

  /**
   * add new jenis vaksin
   * @param {{ nama_vaksin: string, interval: number, deskripsi?: string, efek_samping?: string, status: string }} data
   */
  create: async (data) => { 
    const response = await api.post('/api/jenis-vaksin', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/api/jenis-vaksin/${id}`, data);
    return response.data;

  },
  remove: async (id) => {
    const response = await api.delete(`/api/jenis-vaksin/${id}`);
    return response.data;}
};
export default jenisVaksinService;
import api from '@/lib/api';

const reminderVaksinasiService = {
  getAll: async () => {
    const response = await api.get('/api/reminder-vaksinasi');
    return response.data;
  },

  /**
   * add new reminder vaksinasi
   * @param {{ id_pasien: string, id_hewan: string, id_jenis_vaksin: string, tanggal_vaksin: date,  }} data
   */
  create: async (data) => { 
    const response = await api.post('/api/reminder-vaksinasi', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/api/reminder-vaksinasi/${id}`, data);
    return response.data;

  },
  sendManual: async (data) => {
    await api.get('/sanctum/csrf-cookie');
    const response = await api.post('/api/reminder-vaksinasi/send-manual', data);
    return response.data;
  },
  sendScheduled: async () => {
    await api.get('/sanctum/csrf-cookie');
    const response = await api.post('/api/reminder-vaksinasi/send-scheduled');
    return response.data;
  },
  remove: async (id) => {
    const response = await api.delete(`/api/reminder-vaksinasi/${id}`);
    return response.data;}
};
export default reminderVaksinasiService;
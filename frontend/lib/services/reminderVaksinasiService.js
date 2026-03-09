import api from '@/lib/api';

const reminderVaksinasiService = {
  getAll: async () => {
    const response = await api.get('/api/reminder-vaksinasi');
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/api/reminder-vaksinasi', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/api/reminder-vaksinasi/${id}`, data);
    return response.data;
  },

  destroy: async (id) => {
    const response = await api.delete(`/api/reminder-vaksinasi/${id}`);
    return response.data;
  },

  getUpcomingNotifications: async () => {
    const response = await api.get('/api/notifications/vaksinasi');
    return response.data;
  },
};

export default reminderVaksinasiService;
import api from '@/lib/api';

const dashboardService = {
  /**
   * Get dashboard statistics (totalHewan, totalKunjungan, kunjunganBaru, rekamMedis)
   * @returns {Promise<object>}
   */
  getStatistics: async () => {
    const response = await api.get('/api/dashboard/statistics');
    return response.data;
  },

  /**
   * Get clinic summary (konsultasi, rawatInap, pemeriksaanUmum, totalHewanDirawat)
   * @returns {Promise<object>}
   */
  getClinicSummary: async () => {
    const response = await api.get('/api/dashboard/clinic-summary');
    return response.data;
  },

  /**
   * Get recent transactions list
   * @returns {Promise<Array>}
   */
  getRecentTransactions: async () => {
    const response = await api.get('/api/dashboard/recent-transactions');
    return response.data;
  },
};

export default dashboardService;

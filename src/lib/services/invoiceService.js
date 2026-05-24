import api from '@/lib/api';
// GET    /api/invoice                        → list invoice
// POST   /api/invoice                        → create invoice
// GET    /api/invoice/{id}                   → detail invoice
// DELETE /api/invoice/{id}                   → delete invoice
// GET    /api/invoice/jenis-vaksin           → list vaksin
// GET    /api/invoice/hewan/pasien/{id}      → list hewan by pasien
// POST   /api/invoice/{id}/confirm-payment   → confirm payment

const InvoiceService = {
  getAll: async (params={}) => {
    const response = await api.get('/api/invoice/invoice', { params });
    return response.data;
  },
  create: async (invoiceData) => {
    const response = await api.post('/api/invoice/invoice', invoiceData);
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/api/invoice/invoice/${id}`);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/api/invoice/invoice/${id}`);
    return response.data;
  },
  confirmPayment: async (id) => {
    const response = await api.post(`/api/invoice/invoice/${id}/confirm-payment`);
    return response.data;
  },
  getHewanByPasien: async (id_pasien) => {
    const response = await api.get(`/api/invoice/invoice/hewan/pasien/${id_pasien}`);
    return response.data;
  },
  

};

export default InvoiceService;
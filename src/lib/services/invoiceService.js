import api from '@/lib/api';
// GET    /api/invoice                        → list invoice
// POST   /api/invoice                        → create invoice
// GET    /api/invoice/{id}                   → detail invoice
// DELETE /api/invoice/{id}                   → delete invoice
// GET    /api/invoice/jenis-vaksin           → list vaksin
// GET    /api/invoice/hewan/pasien/{id}      → list hewan by pasien
// POST   /api/invoice/{id}/confirm-payment   → confirm payment

const toTitleCase = (value = '') =>
  String(value)
    .replace(/_/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

const formatCreatedAt = (value) => {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
};

const normalizeInvoice = (item = {}) => ({
  ...item,
  id: item.id ?? null,
  created_at: formatCreatedAt(item.created_at),
  status: toTitleCase(item.status ?? ''),
});

const InvoiceService = {
  getAll: async (params = {}) => {
    const response = await api.get('/api/invoice/invoice', { params });
    if (Array.isArray(response.data)) {
      return response.data.map(normalizeInvoice);
    }
    return {
      ...response.data,
      data: (response.data?.data || []).map(normalizeInvoice),
    };
  },
  create: async (invoiceData) => {
    const response = await api.post('/api/invoice/invoice', invoiceData);
    return normalizeInvoice(response.data?.data);
  },
  getById: async (id) => {
    const response = await api.get(`/api/invoice/invoice/${id}`);
    const invoice = response.data;

    // Fetch detailed pet info (including breed/jenisHewan) if available
    if (invoice?.hewan?.id_hewan) {
      try {
        const hewanRes = await api.get(`/api/hewan/${invoice.hewan.id_hewan}`);
        if (hewanRes?.data) {
          invoice.hewan = {
            ...invoice.hewan,
            ...hewanRes.data,
          };
        }
      } catch (err) {
        console.warn('Gagal memuat detail hewan untuk invoice:', err);
      }
    }

    return normalizeInvoice(invoice);
  },
  update: async (id, invoiceData) => {
    const response = await api.put(`/api/invoice/invoice/${id}`, invoiceData);
    return normalizeInvoice(response.data);
  },
  delete: async (id) => {
    const response = await api.delete(`/api/invoice/invoice/${id}`);
    return normalizeInvoice(response.data);
  },
  confirmPayment: async (id, payload = {}) => {
    const response = await api.post(`/api/invoice/invoice/${id}/confirm-payment`, payload);
    return normalizeInvoice(response.data);
  },
  getHewanByPasien: async (id_pasien) => {
    const response = await api.get(`/api/invoice/invoice/hewan/pasien/${id_pasien}`);
    return response.data;
  },
  search: async (query) => {
    const response = await api.get('/api/invoice/invoice/search', { params: { q: query } });
    if (Array.isArray(response.data)) {
      return response.data.map(normalizeInvoice);
    }
    return {
      ...response.data,
      data: (response.data?.data || []).map(normalizeInvoice),
    };
  },
};

export default InvoiceService;
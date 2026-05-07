import api from '@/lib/api';

const TYPE_LABELS = {
  vaksinasi: 'Vaksinasi',
  reservasi: 'Reservasi',
};

const STATUS_LABELS = {
  pending: 'Pending',
  success: 'Sukses',
  failed: 'Gagal',
  sent: 'Sukses',
  gagal: 'Gagal',
};

const toTitleCase = (value = '') =>
  String(value)
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

const formatSentAt = (value) => {
  if (!value) {
    return null;
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(parsedDate).replace(',', '');
};

const normalizeNotification = (item = {}) => ({
  ...item,
  id: item.id_notification ?? item.id ?? null,
  recipient: item.recipient ?? '-',
  channel: item.channel ? String(item.channel).toUpperCase() : '-',
  sentAt: formatSentAt(item.sentAt ?? item.waktu_kirim)
    ?? (item.status === 'pending' ? 'Belum dikirim' : '-'),
  type: TYPE_LABELS[item.type ?? item.tipe] ?? toTitleCase(item.type ?? item.tipe ?? ''),
  status: STATUS_LABELS[item.status] ?? toTitleCase(item.status ?? ''),
  message: item.message ?? null,
  message_content: item.message_content ?? null,
  reminder_type: item.reminder_type ?? null,
});

const notificationService = {
  getAll: async (params = {}) => {
    const query = {};
    if (params.id_pasien != null) query.id_pasien = params.id_pasien;
    if (params.status != null && String(params.status).trim() !== '') query.status = params.status;
    if (params.fromDate != null && String(params.fromDate).trim() !== '') query.from_date = params.fromDate;
    if (params.toDate != null && String(params.toDate).trim() !== '') query.to_date = params.toDate;
    if (params.page != null) query.page = params.page;
    if (params.perPage != null) query.per_page = params.perPage;
    // backend variants: send both `search` and `q` when provided and non-empty
    const searchTerm = params.search ?? params.q ?? null;
    if (searchTerm != null && String(searchTerm).trim() !== '') {
      query.search = String(searchTerm);
      query.q = String(searchTerm);
    }

    const response = await api.get('/api/notifications', { params: query });
    const payload = response.data || {};

    // Handle multiple shapes: payload.data (array), payload.data.data (nested), payload.notifications, payload.items
    let rows = [];
    if (Array.isArray(payload.data)) rows = payload.data;
    else if (Array.isArray(payload.data?.data)) rows = payload.data.data;
    else if (Array.isArray(payload.notifications)) rows = payload.notifications;
    else if (Array.isArray(payload.items)) rows = payload.items;

    const metaSource = payload.meta ?? payload.data?.meta ?? {};

    return {
      ...payload,
      data: rows.map(normalizeNotification),
      meta: {
        currentPage:
          metaSource?.currentPage ?? metaSource?.current_page ?? payload.current_page ?? 1,
        totalPages:
          metaSource?.totalPages ?? metaSource?.last_page ?? payload.last_page ?? 1,
        totalItems:
          metaSource?.totalItems ?? metaSource?.total ?? payload.total ?? rows.length,
        perPage:
          metaSource?.perPage ?? metaSource?.per_page ?? payload.per_page ?? rows.length,
      },
    };
  },
  getUpcoming: async()=>{
    const response = await api.get('/api/notifications/upcoming');
    return response.data;
  },
  getStats: async () => {
    const response = await api.get('/api/notifications/stats');
    return response.data;
  },
  getByPasien: async (id_pasien) => {
    const response = await api.get(`/api/notifications/pasien/${id_pasien}`);
    return response.data.data;
  },
  getById: async (id) => {
    const response = await api.get(`/api/notifications/${id}`);
    return response.data;
  }, 
  update: async (id, data) => {
    const response = await api.put(`/api/notifications/${id}`, data);
    return response.data;
  },

};
export default notificationService;
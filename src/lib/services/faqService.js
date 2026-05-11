import api from '@/lib/api';
const toTitleCase = (value = '') =>
  String(value)
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
const normalizeFaq = (item = {}) => ({
  ...item,
  id: item.id ?? null,
  created_at: formatCreatedAt(item.created_at),
  status: toTitleCase(item.status ?? ''),
});

const FaqService = {
  getAll: async (params={}) => {
    const response = await api.get('/api/faq');
    return {
      ...response.data,
      data: response.data?.data?.map(normalizeFaq) || [],
    };
  },
  getById: async (id) => {
    const response = await api.get(`/api/faq/${id}`);
    return normalizeFaq(response.data);
  },
  create: async (faqData) => {
    const response = await api.post('/api/faq', faqData);
    return normalizeFaq(response.data?.data);
  },
  update: async (id, faqData) => {
    const response = await api.put(`/api/faq/${id}`, faqData);
    return normalizeFaq(response.data?.data);
  },
  delete: async (id) => {
    const response = await api.delete(`/api/faq/${id}`);
    return response.data;
  },
  normalizeFaq,
};
export default FaqService;
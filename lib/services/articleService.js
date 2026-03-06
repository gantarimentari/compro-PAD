import api from '@/lib/api';

const articleService = {
  /**
   * Get all articles
   * @returns {Promise<Array>}
   */
  getAll: async () => {
    const response = await api.get('/api/articles');
    return response.data;
  },

  /**
   * Create a new article
   * @param {FormData} formData - Must include: title, category, content, status, image?
   */
  create: async (formData) => {
    const response = await api.post('/api/articles', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /**
   * Update an article by ID (uses POST with _method=PUT for FormData support)
   * @param {number|string} id
   * @param {FormData} formData
   */
  update: async (id, formData) => {
    // Laravel requires POST with _method=PUT for multipart form data
    formData.append('_method', 'PUT');
    const response = await api.post(`/api/articles/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /**
   * Delete an article by ID
   * @param {number|string} id
   */
  remove: async (id) => {
    const response = await api.delete(`/api/articles/${id}`);
    return response.data;
  },
};

export default articleService;

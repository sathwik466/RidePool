import { api } from './client';

export const ridesApi = {
  create: (data) => api.post('/api/rides', data),

  update: (id, data) =>
    api.put(`/api/rides/${id}`, data),

  cancel: (id) =>
    api.delete(`/api/rides/${id}`),

  getMy: () => api.get('/api/rides/my'),

  getById: (id) => api.get(`/api/rides/${id}`),

  search: (params) =>
    api.get('/api/rides/search', { params }),
};

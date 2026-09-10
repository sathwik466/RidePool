import { api } from './client';

export const bookingsApi = {
  create: (data) =>
    api.post('/api/bookings', data),

  getById: (id) => api.get(`/api/bookings/${id}`),

  getMy: () => api.get('/api/bookings/my'),

  getRider: () => api.get('/api/bookings/rider'),

  confirm: (id) => api.put(`/api/bookings/${id}/confirm`),

  complete: (id, otp) =>
    api.put(`/api/bookings/${id}/complete`, null, {
      params: { otp },
    }),

  cancel: (id) =>
    api.delete(`/api/bookings/${id}/cancel`),

  receipt: (id) =>
    api.get(`/api/bookings/${id}/receipt`),
};

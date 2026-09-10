import { api } from './client';

export const statsApi = {
  eco: () => api.get('/api/stats/eco'),
  leaderboard: () => api.get('/api/stats/karma/leaderboard'),
  riderDashboard: () => api.get('/api/stats/dashboard/rider'),
  commuterDashboard: () =>
    api.get('/api/stats/dashboard/commuter'),
};

export const chatApi = {
  history: (bookingId) =>
    api.get(`/api/chat/${bookingId}`),
};

export const reviewsApi = {
  submit: (data) =>
    api.post('/api/reviews', data),
  report: (data) =>
    api.post('/api/reviews/report', data),
};

export const sosApi = {
  trigger: (data) =>
    api.post('/api/sos', data),
  shareTrip: (bookingId) =>
    api.post(`/api/sos/share/${bookingId}`),
};

export const adminApi = {
  pendingRiders: () => api.get('/api/admin/riders/pending'),
  verifyRider: (id, status, reason) =>
    api.put(`/api/admin/riders/${id}/verify`, null, {
      params: { status, reason },
    }),
  blockUser: (id, blocked) =>
    api.put(`/api/admin/users/${id}/block`, null, {
      params: { blocked },
    }),
  reports: () => api.get('/api/admin/reports'),
  analytics: () => api.get('/api/admin/analytics'),
  updateFuelRate: (rate) =>
    api.put('/api/admin/config/fuel-rate', null, { params: { rate } }),
};

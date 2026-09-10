import { api } from './client';

export const usersApi = {
  getMe: () => api.get('/api/users/me'),

  updateProfile: (data) =>
    api.put('/api/users/profile', data),

  uploadPhoto: (file) => {
    const form = new FormData();
    form.append('file', file);
    return api.post('/api/users/photo', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

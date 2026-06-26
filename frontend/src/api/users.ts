import { api } from './client';
import type { ApiResponse, ProfileUpdateRequest, User } from '../types';

export const usersApi = {
  getMe: () => api.get<User>('/api/users/me'),

  updateProfile: (data: ProfileUpdateRequest) =>
    api.put<User>('/api/users/profile', data),

  uploadPhoto: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post<ApiResponse<string>>('/api/users/photo', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

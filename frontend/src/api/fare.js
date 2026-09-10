import { api } from './client';

export const fareApi = {
  preview: (data) =>
    api.post('/api/fare/preview', data),
};

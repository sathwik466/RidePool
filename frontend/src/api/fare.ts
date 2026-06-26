import { api } from './client';
import type { FarePreviewRequest, FarePreviewResponse } from '../types';

export const fareApi = {
  preview: (data: FarePreviewRequest) =>
    api.post<FarePreviewResponse>('/api/fare/preview', data),
};

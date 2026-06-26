import { api } from './client';
import type { ApiResponse, Ride, RideMatch, RideRequest } from '../types';

export const ridesApi = {
  create: (data: RideRequest) => api.post<Ride>('/api/rides', data),

  update: (id: number, data: RideRequest) =>
    api.put<Ride>(`/api/rides/${id}`, data),

  cancel: (id: number) =>
    api.delete<ApiResponse<string>>(`/api/rides/${id}`),

  getMy: () => api.get<Ride[]>('/api/rides/my'),

  getById: (id: number) => api.get<Ride>(`/api/rides/${id}`),

  search: (params: {
    commuterLat?: number;
    commuterLng?: number;
    destLat?: number;
    destLng?: number;
    date: string;
    womenOnly?: boolean;
    maxDetourKm?: number;
  }) => api.get<RideMatch[]>('/api/rides/search', { params }),
};

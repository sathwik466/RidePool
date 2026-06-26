import { api } from './client';
import type {
  ApiResponse,
  Booking,
  BookingRequest,
  Receipt,
} from '../types';

export const bookingsApi = {
  create: (data: BookingRequest) =>
    api.post<Booking>('/api/bookings', data),

  getById: (id: number) => api.get<Booking>(`/api/bookings/${id}`),

  getMy: () => api.get<Booking[]>('/api/bookings/my'),

  getRider: () => api.get<Booking[]>('/api/bookings/rider'),

  confirm: (id: number) => api.put<Booking>(`/api/bookings/${id}/confirm`),

  complete: (id: number, otp: string) =>
    api.put<Booking>(`/api/bookings/${id}/complete`, null, {
      params: { otp },
    }),

  cancel: (id: number) =>
    api.delete<ApiResponse<string>>(`/api/bookings/${id}/cancel`),

  receipt: (id: number) =>
    api.get<Receipt>(`/api/bookings/${id}/receipt`),
};

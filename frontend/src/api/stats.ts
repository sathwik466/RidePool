import { api } from './client';
import type {
  Analytics,
  ApiResponse,
  ChatMessage,
  DashboardData,
  EcoTracker,
  Report,
  ReportRequest,
  ReviewRequest,
  SosRequest,
  User,
} from '../types';

export const statsApi = {
  eco: () => api.get<EcoTracker>('/api/stats/eco'),
  leaderboard: () => api.get<User[]>('/api/stats/karma/leaderboard'),
  riderDashboard: () => api.get<DashboardData>('/api/stats/dashboard/rider'),
  commuterDashboard: () =>
    api.get<DashboardData>('/api/stats/dashboard/commuter'),
};

export const chatApi = {
  history: (bookingId: number) =>
    api.get<ChatMessage[]>(`/api/chat/${bookingId}`),
};

export const reviewsApi = {
  submit: (data: ReviewRequest) =>
    api.post<ApiResponse<string>>('/api/reviews', data),
  report: (data: ReportRequest) =>
    api.post<ApiResponse<string>>('/api/reviews/report', data),
};

export const sosApi = {
  trigger: (data: SosRequest) =>
    api.post<ApiResponse<string>>('/api/sos', data),
  shareTrip: (bookingId: number) =>
    api.post<ApiResponse<string>>(`/api/sos/share/${bookingId}`),
};

export const adminApi = {
  pendingRiders: () => api.get<User[]>('/api/admin/riders/pending'),
  verifyRider: (id: number, status: string, reason?: string) =>
    api.put<User>(`/api/admin/riders/${id}/verify`, null, {
      params: { status, reason },
    }),
  blockUser: (id: number, blocked: boolean) =>
    api.put<User>(`/api/admin/users/${id}/block`, null, {
      params: { blocked },
    }),
  reports: () => api.get<Report[]>('/api/admin/reports'),
  analytics: () => api.get<Analytics>('/api/admin/analytics'),
  updateFuelRate: (rate: number) =>
    api.put('/api/admin/config/fuel-rate', null, { params: { rate } }),
};

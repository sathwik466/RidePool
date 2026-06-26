import { api } from './client';
import type {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from '../types';

export const authApi = {
  register: (data: RegisterRequest) =>
    api.post<ApiResponse<string>>('/api/auth/register', data),

  login: (data: LoginRequest) =>
    api.post<AuthResponse>('/api/auth/login', data),

  sendEmailOtp: (email: string) =>
    api.post<ApiResponse<string>>('/api/auth/send-email-otp', { email }),

  verifyEmail: (email: string, code: string) =>
    api.post<ApiResponse<string>>('/api/auth/verify-email', { email, code }),
};

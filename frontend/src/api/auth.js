import { api } from './client';

export const authApi = {
  register: (data) =>
    api.post('/api/auth/register', data),

  login: (data) =>
    api.post('/api/auth/login', data),

  sendEmailOtp: (email) =>
    api.post('/api/auth/send-email-otp', { email }),

  verifyEmail: (email, code) =>
    api.post('/api/auth/verify-email', { email, code }),

  forgotPassword: (email) =>
    api.post('/api/auth/forgot-password', { email }),

  resetPassword: (email, code, newPassword) =>
    api.post('/api/auth/reset-password', { email, code, newPassword }),
};

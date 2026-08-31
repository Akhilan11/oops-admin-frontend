import api from '../utils/api';

export function getCurrentUser() {
  return api.get('/auth/me');
}

export function login(email, password) {
  return api.post('/admin/auth/login', { email, password });
}

export function verifyOtp(email, otp) {
  return api.post('/admin/auth/verify-otp', { email, otp });
}

export function logout() {
  return api.post('/auth/logout');
}

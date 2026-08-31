import api from '../utils/api';

export function getStats(period = 'all') {
  return api.get(`/admin/dashboard/stats?period=${period}`);
}

export function getRevenueByDay(period = 'all') {
  return api.get(`/admin/dashboard/revenue-by-day?period=${period}`);
}

export function getStatusBreakdown(period = 'all') {
  return api.get(`/admin/dashboard/status-breakdown?period=${period}`);
}

export function getTopProducts(period = 'all', limit = 5) {
  return api.get(`/admin/dashboard/top-products?period=${period}&limit=${limit}`);
}

export function getRecentOrders(limit = 5) {
  return api.get(`/admin/dashboard/recent-orders?limit=${limit}`);
}

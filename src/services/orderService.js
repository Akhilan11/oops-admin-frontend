import api from '../utils/api';

export function getOrders(limit = 200) {
  return api.get(`/admin/orders?limit=${limit}`);
}

export function updateOrderStatus(orderId, status) {
  return api.patch(`/admin/orders/${orderId}/status`, { status });
}

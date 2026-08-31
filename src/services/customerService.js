import api from '../utils/api';

export function getCustomers(limit = 200) {
  return api.get(`/admin/customers?limit=${limit}`);
}

export function getCustomerDetail(phone) {
  return api.get(`/admin/customers/${phone}`);
}

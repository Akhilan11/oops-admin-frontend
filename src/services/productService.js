import api from '../utils/api';

export function getProducts(limit = 200) {
  return api.get(`/admin/products?limit=${limit}`);
}

export function createProduct(product) {
  return api.post('/admin/products', product);
}

export function updateProduct(id, updates) {
  return api.put(`/admin/products/${id}`, updates);
}

export function deleteProduct(id) {
  return api.delete(`/admin/products/${id}`);
}

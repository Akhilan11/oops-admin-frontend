import api from '../utils/api';

export function getConnections() {
  return api.get('/admin/settings/connections');
}

export function saveConnection(id, payload) {
  return api.put(`/admin/settings/connections/${id}`, payload);
}

export function deleteConnection(id) {
  return api.delete(`/admin/settings/connections/${id}`);
}

export function getEmailTriggers() {
  return api.get('/admin/settings/email-triggers');
}

export function updateEmailTriggers(triggers) {
  return api.put('/admin/settings/email-triggers', triggers);
}

export function formatCurrency(amount) {
  return `Rs. ${Number(amount).toLocaleString('en-IN')}`;
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(iso) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function statusLabel(status) {
  return status
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function statusColor(status) {
  const map = {
    available: 'success',
    'sold-out': 'failure',
    'coming-soon': 'warning',
    placed: 'info',
    processing: 'warning',
    shipped: 'purple',
    'out-for-delivery': 'indigo',
    delivered: 'success',
  };
  return map[status] || 'gray';
}

import { statusLabel } from '../utils/formatters';

const STYLES = {
  available: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  'sold-out': 'bg-red-50 text-red-700 ring-red-600/20',
  'coming-soon': 'bg-amber-50 text-amber-700 ring-amber-600/20',
  placed: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  processing: 'bg-orange-50 text-orange-700 ring-orange-600/20',
  shipped: 'bg-violet-50 text-violet-700 ring-violet-600/20',
  'out-for-delivery': 'bg-sky-50 text-sky-700 ring-sky-600/20',
  delivered: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
};

export default function StatusBadge({ status }) {
  const style = STYLES[status] || 'bg-warmblack/5 text-warmblack/50 ring-warmblack/10';
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide ring-1 ring-inset ${style}`}>
      {statusLabel(status)}
    </span>
  );
}

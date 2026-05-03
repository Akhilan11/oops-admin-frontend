import { Link } from 'react-router-dom';
import { statusLabel } from '../../../utils/formatters';

const STATUS_META = {
  placed: { bg: 'bg-blue-500', light: 'bg-blue-100', text: 'text-blue-600' },
  processing: { bg: 'bg-orange-500', light: 'bg-orange-100', text: 'text-orange-600' },
  shipped: { bg: 'bg-violet-500', light: 'bg-violet-100', text: 'text-violet-600' },
  'out-for-delivery': { bg: 'bg-sky-500', light: 'bg-sky-100', text: 'text-sky-600' },
  delivered: { bg: 'bg-emerald-500', light: 'bg-emerald-100', text: 'text-emerald-600' },
};

export default function OrderStatusChart({ breakdown, totalOrders }) {
  const statuses = Object.keys(breakdown);

  return (
    <div className="rounded-2xl bg-white p-6 md:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <p className="text-[11px] font-semibold tracking-wide text-ash uppercase">Fulfillment</p>
        <Link to="/orders" className="text-[11px] font-semibold text-warmblack/30 hover:text-warmblack transition-colors">
          All orders &rarr;
        </Link>
      </div>

      {statuses.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-sm text-ash/40">No orders</div>
      ) : (
        <div className="space-y-4 flex-1">
          {statuses.map((s) => {
            const count = breakdown[s];
            const pct = totalOrders > 0 ? Math.round((count / totalOrders) * 100) : 0;
            const meta = STATUS_META[s] || { bg: 'bg-gray-400', light: 'bg-gray-100', text: 'text-gray-600' };
            return (
              <div key={s}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${meta.bg}`} />
                    <span className="text-[13px] font-medium text-warmblack">{statusLabel(s)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold tabular-nums text-warmblack">{count}</span>
                    <span className={`text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded ${meta.light} ${meta.text}`}>{pct}%</span>
                  </div>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${meta.bg} transition-all duration-700 ease-out`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

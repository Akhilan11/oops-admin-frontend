import { Link } from 'react-router-dom';
import { formatCurrency } from '../../../utils/formatters';

export default function TopProducts({ products, totalRevenue }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] h-full">
      <div className="flex items-center justify-between mb-5">
        <p className="text-[11px] font-semibold tracking-wide text-ash uppercase">Top Products</p>
        <Link to="/products" className="text-[11px] font-semibold text-warmblack/30 hover:text-warmblack transition-colors">
          View all &rarr;
        </Link>
      </div>
      {products.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-sm text-ash/40">No data yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((p, i) => {
            const pct = totalRevenue > 0 ? Math.round((p.revenue / totalRevenue) * 100) : 0;
            return (
              <div key={p.name}>
                <div className="flex items-center gap-3 mb-1.5">
                  {p.image ? (
                    <img src={p.image} alt="" className="w-8 h-10 object-cover rounded-lg bg-gray-50 shrink-0" />
                  ) : (
                    <div className="w-8 h-10 rounded-lg bg-gray-100 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-warmblack truncate">{p.name}</p>
                    <p className="text-[10px] text-ash">{p.qty} sold &middot; {formatCurrency(p.revenue)}</p>
                  </div>
                  <span className="text-[11px] font-bold tabular-nums text-warmblack/40 shrink-0">{pct}%</span>
                </div>
                {/* Progress bar */}
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden ml-11">
                  <div
                    className="h-full bg-warmblack/80 rounded-full transition-all duration-700"
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

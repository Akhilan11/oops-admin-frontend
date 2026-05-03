import { Link } from 'react-router-dom';
import StatusBadge from '../../../shared/StatusBadge';
import { formatCurrency, formatDate } from '../../../utils/formatters';

export default function RecentOrders({ orders }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] h-full">
      <div className="flex items-center justify-between mb-5">
        <p className="text-[11px] font-semibold tracking-wide text-ash uppercase">Recent Orders</p>
        <Link to="/orders" className="text-[11px] font-semibold text-warmblack/30 hover:text-warmblack transition-colors">
          View all &rarr;
        </Link>
      </div>
      {orders.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-sm text-ash/40">No orders yet</p>
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="pb-3 text-left text-[10px] font-semibold tracking-wide text-ash uppercase">Customer</th>
              <th className="pb-3 text-left text-[10px] font-semibold tracking-wide text-ash uppercase">Status</th>
              <th className="pb-3 text-right text-[10px] font-semibold tracking-wide text-ash uppercase">Amount</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="group">
                <td className="py-3 border-b border-gray-50">
                  <Link to={`/orders/${o.id}`} className="block">
                    <p className="text-[13px] font-semibold text-warmblack group-hover:underline underline-offset-2 decoration-warmblack/20">{o.shipping?.fullName || 'Customer'}</p>
                    <p className="text-[10px] text-ash mt-0.5">{formatDate(o.date)}</p>
                  </Link>
                </td>
                <td className="py-3 border-b border-gray-50">
                  <StatusBadge status={o.status} />
                </td>
                <td className="py-3 border-b border-gray-50 text-right">
                  <p className="text-[13px] font-bold tabular-nums text-warmblack">{formatCurrency(o.total)}</p>
                  <p className="text-[10px] text-ash">{o.items?.length} items</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

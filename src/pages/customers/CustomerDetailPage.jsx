import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCustomerDetail } from './data/dataLayer';
import StatusBadge from '../../shared/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function CustomerDetailPage() {
  const { id } = useParams();
  const { customer, orders, loading } = useCustomerDetail(decodeURIComponent(id));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-5 h-5 border-2 border-warmblack/20 border-t-warmblack rounded-full animate-spin" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <p className="text-lg font-bold text-warmblack/25">Customer not found</p>
        <Link to="/customers" className="mt-3 text-sm font-semibold text-warmblack/40 hover:text-warmblack transition-colors underline underline-offset-4">Back to customers</Link>
      </div>
    );
  }

  const sortedOrders = [...(orders || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-8">
        <Link to="/customers" className="text-xs text-warmblack/30 hover:text-warmblack transition-colors duration-200">Customers</Link>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-warmblack/15"><polyline points="9 18 15 12 9 6" /></svg>
        <span className="text-xs text-warmblack/60 font-medium">{customer.name}</span>
      </div>

      {/* Header — avatar + name + phone */}
      <div className="flex items-center gap-5 mb-10">
        <div className="w-14 h-14 rounded-full bg-warmblack text-white flex items-center justify-center text-xl font-bold shrink-0">
          {customer.name?.charAt(0)?.toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-warmblack">{customer.name}</h1>
          <p className="text-sm text-ash font-mono mt-0.5">{customer.phone}</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Orders', value: customer.orderCount },
          { label: 'Total Spent', value: formatCurrency(customer.totalSpent) },
          { label: 'Avg. Order', value: formatCurrency(customer.totalSpent / (customer.orderCount || 1)) },
          { label: 'Last Order', value: customer.lastOrderDate ? formatDate(customer.lastOrderDate) : '—' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-warmblack/[0.06] p-5">
            <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-ash mb-2">{s.label}</p>
            <p className="text-lg font-extrabold tracking-tight text-warmblack">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Two-column: Orders + Addresses */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

        {/* Order history */}
        <div className="lg:col-span-8">
          <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-warmblack mb-4">
            Order History ({customer.orderCount})
          </p>
          <div className="border-t border-warmblack/[0.06]">
            {sortedOrders.map((o, i) => (
              <Link
                key={o.orderId}
                to={`/orders/${o.orderId}`}
                className={`flex items-center gap-4 py-4 hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors ${
                  i < sortedOrders.length - 1 ? 'border-b border-warmblack/[0.04]' : ''
                }`}
              >
                {/* Item thumbnails */}
                <div className="flex -space-x-2 shrink-0">
                  {o.items?.slice(0, 3).map((item, j) => (
                    item.image ? (
                      <img key={j} src={item.image} alt="" className="w-10 h-12 object-cover rounded-lg border-2 border-white bg-gray-50" />
                    ) : (
                      <div key={j} className="w-10 h-12 rounded-lg border-2 border-white bg-gray-100 flex items-center justify-center text-[8px] font-bold text-ash/30">IMG</div>
                    )
                  ))}
                  {o.items?.length > 3 && (
                    <div className="w-10 h-12 rounded-lg border-2 border-white bg-gray-100 flex items-center justify-center text-[9px] font-bold text-ash/40">
                      +{o.items.length - 3}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-mono font-bold text-warmblack">{o.orderId}</p>
                    <StatusBadge status={o.status} />
                  </div>
                  <p className="text-xs text-ash mt-0.5">
                    {formatDate(o.createdAt)} — {o.items?.length || 0} {o.items?.length === 1 ? 'item' : 'items'}
                  </p>
                </div>

                <p className="text-sm font-bold tabular-nums text-warmblack shrink-0">
                  {formatCurrency(o.total)}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Addresses */}
        <motion.div
          className="lg:col-span-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-warmblack mb-4">
            Addresses ({(customer.addresses || []).length})
          </p>
          {(!customer.addresses || customer.addresses.length === 0) ? (
            <p className="text-sm text-ash">No addresses on file</p>
          ) : (
            <div className="space-y-3">
              {customer.addresses.map((addr, i) => (
                <div key={i} className="rounded-xl border border-warmblack/[0.06] p-4">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-charcoal/40">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <p className="text-sm font-bold text-warmblack">{addr.fullName}</p>
                  </div>
                  <p className="text-[13px] text-warmblack/50 leading-relaxed pl-[38px]">
                    {addr.address1}{addr.address2 ? `, ${addr.address2}` : ''}
                    <br />
                    {addr.city}, {addr.state} — {addr.pincode}
                  </p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

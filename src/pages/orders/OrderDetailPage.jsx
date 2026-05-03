import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useOrders } from './data/dataLayer';
import StatusBadge from '../../shared/StatusBadge';
import OrderStatusStepper from './components/OrderStatusStepper';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { shouldSendEmail } from '../config/data/dataLayer';

export default function OrderDetailPage() {
  const { id } = useParams();
  const { orders, updateStatus } = useOrders();
  const order = orders.find((o) => o.id === id);
  const [emailSent, setEmailSent] = useState(false);

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <p className="text-lg font-bold text-warmblack/25">Order not found</p>
        <Link to="/orders" className="mt-3 text-sm font-semibold text-warmblack/40 hover:text-warmblack transition-colors underline underline-offset-4">Back to orders</Link>
      </div>
    );
  }

  const handleAdvance = (newStatus) => {
    updateStatus(order.id, newStatus);
    if (shouldSendEmail(newStatus)) {
      setEmailSent(true);
      setTimeout(() => setEmailSent(false), 4000);
    }
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-8">
        <Link to="/orders" className="text-xs text-warmblack/30 hover:text-warmblack transition-colors duration-200">Orders</Link>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-warmblack/15"><polyline points="9 18 15 12 9 6" /></svg>
        <span className="text-xs text-warmblack/60 font-medium font-mono">{order.id}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-warmblack">{order.id}</h1>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-sm text-ash">{formatDateTime(order.date)}</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-extrabold tabular-nums tracking-tight text-warmblack">
            {formatCurrency(order.total)}
          </p>
          <p className="text-xs text-ash mt-0.5">
            {order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'items'}
          </p>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

        {/* Left — Status timeline */}
        <div className="lg:col-span-4">
          <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-warmblack mb-5">
            Status
          </p>
          <OrderStatusStepper
            currentStatus={order.status}
            onAdvance={handleAdvance}
            emailSent={emailSent}
          />
        </div>

        {/* Right — Items, Shipping, Payment */}
        <motion.div
          className="lg:col-span-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Items */}
          <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-warmblack mb-4">
            Items ({order.items?.length || 0})
          </p>
          <div className="border-t border-warmblack/[0.06]">
            {order.items?.map((item, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 py-4 ${i < order.items.length - 1 ? 'border-b border-warmblack/[0.04]' : ''}`}
              >
                {item.image ? (
                  <img src={item.image} alt="" className="w-14 h-[70px] object-cover rounded-lg bg-gray-50 shrink-0" />
                ) : (
                  <div className="w-14 h-[70px] rounded-lg bg-gray-100 flex items-center justify-center text-ash/30 text-[9px] font-bold shrink-0">IMG</div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-warmblack">{item.name}</p>
                  <p className="text-xs text-ash mt-0.5">{item.size && `${item.size}`}{item.qty && ` / Qty ${item.qty}`}</p>
                </div>
                <p className="text-sm font-semibold tabular-nums text-warmblack shrink-0">
                  {formatCurrency((item.price || 0) * (item.qty || 1))}
                </p>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="border-t border-warmblack/[0.06] pt-4 mt-2 flex justify-between items-baseline">
            <span className="text-sm font-extrabold text-warmblack">Total</span>
            <span className="text-lg font-extrabold tabular-nums tracking-tight text-warmblack">{formatCurrency(order.total)}</span>
          </div>

          {/* Shipping + Payment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {order.shipping && (
              <div>
                <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-warmblack mb-3">Delivering to</p>
                <div className="rounded-xl border border-warmblack/[0.06] p-5 h-full">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-charcoal/50">{order.shipping.fullName?.charAt(0)?.toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-warmblack">{order.shipping.fullName}</p>
                      <p className="text-xs text-ash font-mono">{order.shipping.phone}</p>
                    </div>
                  </div>
                  <p className="text-[13px] text-warmblack/50 leading-relaxed mt-3">
                    {order.shipping.address1}{order.shipping.address2 ? `, ${order.shipping.address2}` : ''}<br />
                    {order.shipping.city}, {order.shipping.state} — {order.shipping.pincode}
                  </p>
                </div>
              </div>
            )}
            {order.paymentMethod && (
              <div>
                <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-warmblack mb-3">Payment</p>
                <div className="rounded-xl border border-warmblack/[0.06] p-5 h-full">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                      {order.paymentMethod === 'prepaid' ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-charcoal/50"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-charcoal/50"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-warmblack">{order.paymentMethod === 'prepaid' ? 'Paid Online' : 'Cash on Delivery'}</p>
                      <p className="text-xs text-ash">{order.paymentMethod === 'prepaid' ? 'UPI, Cards, Wallets' : 'Pay when delivered'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

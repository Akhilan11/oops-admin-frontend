import { motion } from 'framer-motion';
import { ORDER_STATUSES } from '../../../utils/constants';
import { statusLabel } from '../../../utils/formatters';
import { shouldSendEmail } from '../../config/data/dataLayer';

const STEP_DESCS = {
  placed: 'Order received',
  processing: 'Getting items ready',
  shipped: 'On its way',
  'out-for-delivery': 'Arriving today',
  delivered: 'Delivered successfully',
};

export default function OrderStatusStepper({ currentStatus, onAdvance, emailSent }) {
  const currentIdx = ORDER_STATUSES.indexOf(currentStatus);
  const nextStatus = currentIdx < ORDER_STATUSES.length - 1 ? ORDER_STATUSES[currentIdx + 1] : null;
  const willSendEmail = nextStatus ? shouldSendEmail(nextStatus) : false;

  return (
    <div>
      {/* Vertical timeline */}
      <div className="relative pl-6">
        {ORDER_STATUSES.map((s, i) => {
          const done = i <= currentIdx;
          const active = i === currentIdx;
          return (
            <div key={s} className="relative pb-7 last:pb-0">
              {i < ORDER_STATUSES.length - 1 && (
                <div className={`absolute left-0 top-3.5 w-px h-full -translate-x-1/2 transition-colors duration-300 ${i < currentIdx ? 'bg-warmblack' : 'bg-warmblack/[0.08]'}`} />
              )}
              <div className={`absolute left-0 top-1 -translate-x-1/2 rounded-full transition-all duration-300 ${done ? 'w-2.5 h-2.5 bg-warmblack' : 'w-2.5 h-2.5 bg-warmblack/[0.12]'} ${active ? 'ring-4 ring-warmblack/10' : ''}`} />
              <div className="ml-4">
                <p className={`text-sm font-semibold ${done ? 'text-warmblack' : 'text-warmblack/25'}`}>
                  {statusLabel(s)}
                </p>
                <p className={`text-xs mt-0.5 ${active ? 'text-warmblack/40' : 'text-warmblack/20'}`}>
                  {STEP_DESCS[s]}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Advance button */}
      {nextStatus && (
        <div className="mt-6">
          <motion.button
            whileHover={{ scale: 1.005 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAdvance(nextStatus)}
            className="px-5 py-2.5 bg-warmblack text-white text-xs font-bold rounded-lg hover:bg-warmblack/90 transition-colors flex items-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
            Advance to {statusLabel(nextStatus)}
          </motion.button>

          {/* Email hint */}
          {willSendEmail && (
            <p className="flex items-center gap-1.5 text-[10px] text-ash mt-2.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#EA4335" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 6L12 13 2 6" /><rect x="2" y="4" width="20" height="16" rx="2.5" />
              </svg>
              Customer will be notified via email
            </p>
          )}
          {!willSendEmail && (
            <p className="text-[10px] text-ash/50 mt-2.5">Email notification off for this status</p>
          )}
        </div>
      )}

      {/* Email sent confirmation */}
      {emailSent && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3.5 py-2.5 rounded-xl"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          <span className="text-[11px] font-bold">Email sent to customer</span>
        </motion.div>
      )}
    </div>
  );
}

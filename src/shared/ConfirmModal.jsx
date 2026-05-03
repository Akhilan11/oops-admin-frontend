import { motion, AnimatePresence } from 'framer-motion';

export default function ConfirmModal({ show, title, message, onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-warmblack/20 backdrop-blur-sm"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-white border border-warmblack/5 rounded-2xl p-7 max-w-sm w-full"
          >
            <div className="text-center">
              <div className="mx-auto mb-5 w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
              </div>
              <h3 className="mb-2 text-lg font-bold tracking-tight text-warmblack">{title}</h3>
              <p className="mb-7 text-sm text-warmblack/40 leading-relaxed">{message}</p>
              <div className="flex justify-center gap-3">
                <motion.button whileTap={{ scale: 0.98 }} onClick={onConfirm} className="px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors">Yes, delete</motion.button>
                <button onClick={onCancel} className="px-5 py-2.5 bg-warmblack/[0.04] text-warmblack/60 text-sm font-semibold rounded-lg hover:bg-warmblack/[0.08] transition-colors">Cancel</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

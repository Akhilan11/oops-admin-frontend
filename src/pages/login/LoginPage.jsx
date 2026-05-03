import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAdminAuth } from '../../context/AdminAuthContext';

const inputClass = 'w-full bg-white border border-warmblack/10 rounded-lg px-4 py-3 text-sm text-warmblack placeholder-warmblack/25 focus:outline-none focus:ring-2 focus:ring-warmblack/5 focus:border-warmblack/30 transition-colors';

export default function LoginPage() {
  const { login, verifyOtp } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('credentials'); // 'credentials' | 'otp'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email.trim(), password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else if (result.requiresOtp) {
      setStep('otp');
    }
  };

  const handleOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await verifyOtp(email.trim(), otp);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-12">
          <img src="/logo.png" alt="OOPS" className="h-10 mx-auto mb-5" />
          <p className="text-[10px] font-semibold tracking-[0.4em] uppercase text-ash mb-3">[ admin ]</p>
          <h1 className="text-2xl font-extrabold tracking-tight text-warmblack">
            {step === 'credentials' ? 'Welcome back' : 'Verify OTP'}
          </h1>
          <p className="text-sm text-ash mt-1">
            {step === 'credentials' ? 'Sign in to manage your store' : `OTP sent to ${email}`}
          </p>
        </div>

        {step === 'credentials' ? (
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold tracking-[0.1em] uppercase text-warmblack/40">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@oopsfashion.com" required className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold tracking-[0.1em] uppercase text-warmblack/40">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" required className={inputClass} />
            </div>

            {error && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs font-semibold text-clay">{error}</motion.p>
            )}

            <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.005 }} whileTap={{ scale: 0.98 }}
              className="w-full bg-warmblack text-white py-3.5 rounded-lg text-sm font-bold hover:bg-warmblack/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </form>
        ) : (
          <form onSubmit={handleOtp} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold tracking-[0.1em] uppercase text-warmblack/40">6-digit OTP</label>
              <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="000000" required maxLength={6} className={`${inputClass} text-center text-2xl tracking-[0.5em] font-bold`} />
            </div>

            {error && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs font-semibold text-clay">{error}</motion.p>
            )}

            <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.005 }} whileTap={{ scale: 0.98 }}
              className="w-full bg-warmblack text-white py-3.5 rounded-lg text-sm font-bold hover:bg-warmblack/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </motion.button>

            <button type="button" onClick={() => { setStep('credentials'); setOtp(''); setError(''); }}
              className="w-full text-sm text-warmblack/40 hover:text-warmblack transition-colors"
            >
              Back to login
            </button>
          </form>
        )}

        <p className="text-center text-[10px] text-warmblack/20 mt-10 tracking-wide">OTP will be logged in server console (dev mode)</p>
      </motion.div>
    </div>
  );
}

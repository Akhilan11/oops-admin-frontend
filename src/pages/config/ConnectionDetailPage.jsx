import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CONNECTIONS, useConnections, EMAIL_TRIGGERS, useEmailTriggers } from './data/dataLayer';
import ConnectionIcon from './components/ConnectionIcon';

export default function ConnectionDetailPage() {
  const { id } = useParams();
  const config = CONNECTIONS.find((c) => c.id === id);
  const { getConnection, connect, disconnect, isConnected } = useConnections();
  const data = getConnection(id);
  const connected = isConnected(id);

  const { triggers, toggle } = useEmailTriggers();
  const [connecting, setConnecting] = useState(false);
  const [testStatus, setTestStatus] = useState(null);

  if (!config) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <p className="text-lg font-bold text-warmblack/25">Connection not found</p>
        <Link to="/config" className="mt-3 text-sm font-semibold text-warmblack/40 hover:text-warmblack transition-colors underline underline-offset-4">Back to configurations</Link>
      </div>
    );
  }

  const handleConnect = () => {
    setConnecting(true);
    // Simulate Auth0 OAuth redirect + callback returning with email
    setTimeout(() => {
      connect(id, { email: 'store@oops.com' });
      setConnecting(false);
    }, 2000);
  };

  const handleDisconnect = () => {
    disconnect(id);
    setTestStatus(null);
  };

  const handleTest = () => {
    setTestStatus('testing');
    setTimeout(() => {
      setTestStatus(connected ? 'success' : 'error');
    }, 2000);
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-8">
        <Link to="/config" className="text-xs text-warmblack/30 hover:text-warmblack transition-colors duration-200">Configurations</Link>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-warmblack/15"><polyline points="9 18 15 12 9 6" /></svg>
        <span className="text-xs text-warmblack/60 font-medium">{config.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: config.color + '12' }}>
          <ConnectionIcon type={config.icon} color={config.color} size={28} />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-warmblack">{config.name}</h1>
            {connected ? (
              <span className="text-[9px] font-bold uppercase tracking-wide bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-md">Connected</span>
            ) : (
              <span className="text-[9px] font-bold uppercase tracking-wide bg-gray-100 text-ash px-2.5 py-1 rounded-md">Not Connected</span>
            )}
          </div>
          <p className="text-sm text-ash mt-1">{config.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left column */}
        <div className="lg:col-span-7 space-y-6">

          {/* What this does */}
          <div className="rounded-2xl border border-warmblack/[0.06] bg-white p-6">
            <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-warmblack mb-3">What this does</p>
            <p className="text-[13px] text-warmblack/60 leading-relaxed mb-5">{config.about}</p>

            <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-warmblack/40 mb-2">Emails sent automatically</p>
            <div className="space-y-2">
              {config.useCase.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-[13px] text-warmblack/60">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* How to connect — steps */}
          <div className="rounded-2xl border border-warmblack/[0.06] bg-white p-6">
            <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-warmblack mb-4">How to connect</p>
            <div className="space-y-4">
              {config.setupSteps.map((step, i) => (
                <div key={i} className="flex items-start gap-3.5">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                    connected
                      ? 'bg-warmblack text-white'
                      : 'bg-gray-100 text-charcoal/40'
                  }`}>
                    {connected ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    ) : i + 1}
                  </div>
                  <p className="text-[13px] text-warmblack/60 leading-relaxed pt-0.5">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Auth note */}
          {config.note && (
            <div className="flex items-start gap-3 px-5 py-4 rounded-xl bg-blue-50/60 border border-blue-100">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <p className="text-[12px] text-blue-700/70 leading-relaxed">{config.note}</p>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="lg:col-span-5 space-y-5">

          {/* Connect / Connected card */}
          <div className="rounded-2xl border border-warmblack/[0.06] bg-white p-6">
            {!connected ? (
              <>
                <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-warmblack mb-2">Connect</p>
                <p className="text-xs text-ash mb-5">You'll be redirected to Google to sign in and grant access. No passwords are stored on our end.</p>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConnect}
                  disabled={connecting}
                  className="w-full py-3 bg-white border border-gray-200 text-sm font-semibold text-charcoal rounded-xl hover:bg-gray-50 hover:border-gray-300 disabled:opacity-60 transition-all flex items-center justify-center gap-2.5 shadow-sm"
                >
                  {connecting ? (
                    <>
                      <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 12a9 9 0 11-6.219-8.56" /></svg>
                      Redirecting to Google...
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      Sign in with Google
                    </>
                  )}
                </motion.button>

                <p className="text-[10px] text-ash text-center mt-3">Powered by Auth0</p>
              </>
            ) : (
              <>
                <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-warmblack mb-4">Connected Account</p>
                <div className="flex items-center gap-3 mb-5 p-3.5 rounded-xl bg-gray-50">
                  <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-warmblack truncate">{data?.email}</p>
                    <p className="text-[10px] text-ash">Connected {data?.connectedAt ? new Date(data.connectedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</p>
                  </div>
                </div>

                <button
                  onClick={handleDisconnect}
                  className="w-full py-2.5 text-xs font-bold text-red-500/70 hover:text-red-600 border border-red-200/50 hover:border-red-300 hover:bg-red-50 rounded-xl transition-colors"
                >
                  Disconnect Account
                </button>
              </>
            )}
          </div>

          {/* Test email card */}
          {connected && (
            <div className="rounded-2xl border border-warmblack/[0.06] bg-white p-6">
              <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-warmblack mb-2">Send Test Email</p>
              <p className="text-xs text-ash mb-4">Sends a test order confirmation to <span className="font-mono font-semibold text-charcoal">{data?.email}</span> to verify the integration.</p>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleTest}
                disabled={testStatus === 'testing'}
                className="w-full py-3 rounded-xl text-xs font-bold border border-warmblack/[0.08] text-charcoal hover:bg-gray-50 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {testStatus === 'testing' ? (
                  <>
                    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 12a9 9 0 11-6.219-8.56" /></svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                    Send Test Email
                  </>
                )}
              </motion.button>

              {testStatus === 'success' && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-4 flex items-start gap-2.5 bg-emerald-50 text-emerald-700 px-4 py-3 rounded-xl">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12" /></svg>
                  <div>
                    <p className="text-xs font-bold">Test email sent</p>
                    <p className="text-[10px] opacity-70 mt-0.5">Check {data?.email} for the test order confirmation.</p>
                  </div>
                </motion.div>
              )}

              {testStatus === 'error' && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-4 flex items-start gap-2.5 bg-red-50 text-red-600 px-4 py-3 rounded-xl">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                  <div>
                    <p className="text-xs font-bold">Failed to send</p>
                    <p className="text-[10px] opacity-70 mt-0.5">Try disconnecting and reconnecting your account.</p>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Email triggers — customizable */}
          {connected && (
            <div className="rounded-2xl border border-warmblack/[0.06] bg-white p-6">
              <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-warmblack mb-1">Email Triggers</p>
              <p className="text-xs text-ash mb-5">Choose which status changes send an email to the customer.</p>
              <div className="space-y-0">
                {EMAIL_TRIGGERS.map((t, i) => {
                  const enabled = !!triggers[t.id];
                  return (
                    <div key={t.id} className={`flex items-center gap-3.5 py-3.5 ${i < EMAIL_TRIGGERS.length - 1 ? 'border-b border-gray-100' : ''}`}>
                      <span className={`w-2 h-2 rounded-full shrink-0 ${t.color}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-warmblack">{t.label}</p>
                        <p className="text-[11px] text-ash mt-0.5">{t.description}</p>
                      </div>
                      <button
                        onClick={() => toggle(t.id)}
                        className={`relative shrink-0 w-10 h-[22px] rounded-full transition-colors duration-200 ${enabled ? 'bg-warmblack' : 'bg-gray-200'}`}
                      >
                        <span className={`absolute top-[3px] left-[3px] w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${enabled ? 'translate-x-[18px]' : ''}`} />
                      </button>
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] text-ash mt-4">Disabled triggers won't send any email when that status is reached.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

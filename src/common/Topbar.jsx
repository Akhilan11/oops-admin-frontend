import { useAdminAuth } from '../context/AdminAuthContext';

export default function Topbar({ onMenuClick }) {
  const { admin, logout } = useAdminAuth();

  return (
    <header className="h-14 bg-white/60 backdrop-blur-xl border-b border-warmblack/5 flex items-center justify-between px-6 md:px-10 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center hover:bg-warmblack/5 transition-colors text-warmblack/60">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
        </button>
        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-ash">[ admin panel ]</p>
      </div>

      <div className="flex items-center gap-5">
        <span className="text-xs text-warmblack/30 hidden sm:block">{admin?.email}</span>
        <button onClick={logout} className="text-[11px] font-semibold tracking-[0.1em] uppercase text-warmblack/40 hover:text-warmblack transition-colors duration-200">
          Logout
        </button>
      </div>
    </header>
  );
}

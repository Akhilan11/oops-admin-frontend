import { Link } from 'react-router-dom';
import ConnectionIcon from './ConnectionIcon';

export default function ConnectionCard({ connection, connected, detail }) {
  return (
    <Link
      to={`/config/${connection.id}`}
      className="group rounded-2xl border border-warmblack/[0.06] bg-white p-5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all duration-300 block"
    >
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: connection.color + '12' }}>
          <ConnectionIcon type={connection.icon} color={connection.color} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-[14px] font-bold text-warmblack">{connection.name}</h3>
            {connected ? (
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-gray-300 shrink-0" />
            )}
          </div>
          <p className="text-[12px] text-ash mt-0.5 truncate">
            {connected ? detail : 'Not connected'}
          </p>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 group-hover:text-charcoal/40 transition-colors shrink-0">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </Link>
  );
}

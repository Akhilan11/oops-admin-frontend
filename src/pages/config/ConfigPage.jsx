import { CONNECTIONS, useConnections } from './data/dataLayer';
import ConnectionCard from './components/ConnectionCard';

export default function ConfigPage() {
  const { getConnection, isConnected } = useConnections();

  return (
    <div>
      <div className="mb-10">
        <p className="text-[10px] font-semibold tracking-[0.4em] uppercase text-ash mb-2">[ settings ]</p>
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-warmblack">Configurations</h2>
      </div>

      {/* Connections */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-charcoal/40">
            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
          </svg>
          <div>
            <h3 className="text-[15px] font-bold text-warmblack">Connections</h3>
            <p className="text-xs text-ash">Link external services to your store</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CONNECTIONS.map((c) => {
            const data = getConnection(c.id);
            return (
              <ConnectionCard
                key={c.id}
                connection={c}
                connected={isConnected(c.id)}
                detail={data?.email || data?.url || ''}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}

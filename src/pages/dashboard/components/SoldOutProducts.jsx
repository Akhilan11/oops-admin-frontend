import { Link } from 'react-router-dom';
import { formatCurrency } from '../../../utils/formatters';

export default function SoldOutProducts({ products }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] h-full">
      <div className="flex items-center justify-between mb-5">
        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-ash">Sold Out</p>
        <span className="text-[10px] font-bold text-red-400 bg-red-50 px-2 py-0.5 rounded-md">{products.length}</span>
      </div>
      {products.length === 0 ? (
        <div className="py-12 text-center">
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <p className="text-sm text-ash/40">All stocked up</p>
        </div>
      ) : (
        <div className="space-y-1">
          {products.map((p) => (
            <Link
              key={p.id}
              to={`/products/${p.id}`}
              className="flex items-center gap-3 py-2 -mx-2 px-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {(p.image || p.images?.[0]) ? (
                <img src={p.image || p.images[0]} alt="" className="w-9 h-11 object-cover rounded-lg bg-gray-50 shrink-0" />
              ) : (
                <div className="w-9 h-11 rounded-lg bg-gray-100 shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-warmblack truncate">{p.name}</p>
                <p className="text-[11px] text-ash">{formatCurrency(p.price)}</p>
              </div>
              <span className="text-[9px] font-bold text-red-400 bg-red-50 px-2 py-0.5 rounded shrink-0">Out</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

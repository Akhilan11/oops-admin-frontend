import { statusLabel } from '../utils/formatters';

export default function FilterPills({ options, value, onChange, counts }) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {options.map((s) => {
        const active = value === s;
        const label = s === 'all' ? 'All' : statusLabel(s);
        return (
          <button
            key={s}
            onClick={() => onChange(s)}
            className={`text-[11px] px-3.5 py-1.5 rounded-full border transition-all duration-200 font-semibold ${
              active
                ? 'bg-warmblack text-white border-warmblack'
                : 'border-warmblack/15 text-charcoal/40 hover:border-warmblack/20 hover:text-charcoal/70 bg-gray-50'
            }`}
          >
            {label}
            {counts && <span className="ml-1 opacity-40">({counts[s] ?? 0})</span>}
          </button>
        );
      })}
    </div>
  );
}

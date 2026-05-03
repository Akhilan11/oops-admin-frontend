const PERIODS = [
  { key: 'all', label: 'All Time' },
  { key: 'month', label: 'This Month' },
  { key: 'quarter', label: 'This Quarter' },
  { key: 'year', label: 'This Year' },
];

export function filterByPeriod(items, period, dateKey = 'date') {
  if (period === 'all') return items;

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  return items.filter((item) => {
    const d = new Date(item[dateKey]);
    if (period === 'month') return d.getFullYear() === year && d.getMonth() === month;
    if (period === 'quarter') {
      const qStart = new Date(year, Math.floor(month / 3) * 3, 1);
      return d >= qStart && d <= now;
    }
    if (period === 'year') return d.getFullYear() === year;
    return true;
  });
}

export default function TimeFilter({ value, onChange }) {
  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
      {PERIODS.map((p) => (
        <button
          key={p.key}
          onClick={() => onChange(p.key)}
          className={`text-[11px] font-semibold px-3 py-1.5 rounded-md transition-all duration-200 ${
            value === p.key
              ? 'bg-white text-warmblack shadow-sm'
              : 'text-ash hover:text-charcoal'
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

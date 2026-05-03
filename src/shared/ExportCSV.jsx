import { useState } from 'react';

function escapeCSV(val) {
  if (val == null) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toCSV(rows, columns) {
  const header = columns.map((c) => escapeCSV(c.label)).join(',');
  const body = rows.map((row) =>
    columns.map((c) => escapeCSV(c.accessor(row))).join(',')
  );
  return [header, ...body].join('\n');
}

function download(csv, filename) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ExportCSV({ data, columns, filename = 'export.csv', label = 'Export CSV' }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(() => columns.map((_, i) => i));

  const toggle = (idx) => {
    setSelected((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx].sort((a, b) => a - b)
    );
  };

  const selectAll = () => setSelected(columns.map((_, i) => i));
  const selectNone = () => setSelected([]);

  const handleExport = () => {
    if (!data.length || !selected.length) return;
    const picked = selected.map((i) => columns[i]);
    const csv = toCSV(data, picked);
    download(csv, filename);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => { setOpen(!open); setSelected(columns.map((_, i) => i)); }}
        disabled={!data.length}
        className="flex items-center gap-1.5 text-[11px] font-semibold text-ash hover:text-warmblack disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        {label}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-30 bg-white rounded-xl shadow-lg border border-gray-200 w-[220px] overflow-hidden">
            {/* Header */}
            <div className="px-3 py-2.5 border-b border-gray-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-charcoal">Select Columns</span>
              <div className="flex gap-2">
                <button onClick={selectAll} className="text-[10px] font-semibold text-ash hover:text-warmblack transition-colors">All</button>
                <button onClick={selectNone} className="text-[10px] font-semibold text-ash hover:text-warmblack transition-colors">None</button>
              </div>
            </div>

            {/* Column list */}
            <div className="py-1 max-h-[240px] overflow-y-auto">
              {columns.map((col, i) => (
                <label key={i} className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selected.includes(i)}
                    onChange={() => toggle(i)}
                    className="rounded border-gray-300 text-warmblack focus:ring-warmblack/20 w-3.5 h-3.5"
                  />
                  <span className="text-[12px] font-medium text-charcoal">{col.label}</span>
                </label>
              ))}
            </div>

            {/* Export button */}
            <div className="px-3 py-2.5 border-t border-gray-100">
              <button
                onClick={handleExport}
                disabled={!selected.length}
                className="w-full py-2 bg-warmblack text-white text-[11px] font-bold rounded-lg hover:bg-warmblack/90 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Export {selected.length} {selected.length === 1 ? 'column' : 'columns'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

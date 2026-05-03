import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { createColumnHelper } from '@tanstack/react-table';
import SearchInput from '../../../shared/SearchInput';
import DataTable from '../../../shared/DataTable';
import { formatCurrency, formatDate } from '../../../utils/formatters';

const col = createColumnHelper();

const columns = [
  col.accessor('name', {
    header: 'Customer',
    cell: (info) => {
      const c = info.row.original;
      return (
        <Link to={`/customers/${encodeURIComponent(c.id)}`} className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-full bg-warmblack text-white flex items-center justify-center text-xs font-bold shrink-0">
            {c.name?.charAt(0)?.toUpperCase()}
          </div>
          <span className="text-sm font-semibold text-charcoal group-hover:underline underline-offset-4 decoration-warmblack/20">{c.name}</span>
        </Link>
      );
    },
  }),
  col.accessor('phone', {
    header: 'Phone',
    cell: (info) => <span className="text-xs text-ash font-mono">{info.getValue()}</span>,
    size: 130,
  }),
  col.accessor('orderCount', {
    header: 'Orders',
    cell: (info) => <span className="text-sm font-bold tabular-nums text-charcoal">{info.getValue()}</span>,
    size: 80,
  }),
  col.accessor('totalSpent', {
    header: 'Total Spent',
    cell: (info) => <span className="text-sm font-bold tabular-nums text-charcoal">{formatCurrency(info.getValue())}</span>,
    size: 120,
  }),
  col.accessor('lastOrderDate', {
    header: 'Last Order',
    cell: (info) => <span className="text-xs text-ash font-medium">{info.getValue() ? formatDate(info.getValue()) : '—'}</span>,
    sortingFn: (a, b) => new Date(a.original.lastOrderDate || 0) - new Date(b.original.lastOrderDate || 0),
    size: 110,
  }),
];

export default function CustomerTable({ customers }) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return customers;
    const q = search.toLowerCase();
    return customers.filter((c) => c.name?.toLowerCase().includes(q) || c.phone?.includes(q));
  }, [customers, search]);

  return (
    <DataTable
      data={filtered}
      columns={columns}
      emptyTitle="No customers yet"
      emptySubtitle="Customers will appear when orders are placed"
      toolbar={
        <SearchInput value={search} onChange={setSearch} placeholder="Search by name or phone..." className="w-72" />
      }
    />
  );
}

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { createColumnHelper } from '@tanstack/react-table';
import StatusBadge from '../../../shared/StatusBadge';
import SearchInput from '../../../shared/SearchInput';
import FilterPills from '../../../shared/FilterPills';
import DataTable from '../../../shared/DataTable';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { ORDER_STATUSES } from '../../../utils/constants';

const col = createColumnHelper();

const columns = [
  col.accessor('id', {
    header: 'Order ID',
    cell: (info) => (
      <Link to={`/orders/${info.getValue()}`} className="text-xs font-mono font-bold text-charcoal hover:underline underline-offset-4 decoration-warmblack/20">
        {info.getValue()}
      </Link>
    ),
    size: 140,
  }),
  col.accessor((row) => row.shipping?.fullName || '—', {
    id: 'customer',
    header: 'Customer',
    cell: (info) => {
      const o = info.row.original;
      return (
        <div>
          <p className="text-sm font-semibold text-charcoal">{info.getValue()}</p>
          <p className="text-xs text-ash font-mono">{o.shipping?.phone}</p>
        </div>
      );
    },
  }),
  col.accessor((row) => row.items?.length || 0, {
    id: 'items',
    header: 'Items',
    cell: (info) => <span className="text-xs text-ash font-medium">{info.getValue()} items</span>,
    size: 80,
  }),
  col.accessor('total', {
    header: 'Total',
    cell: (info) => <span className="text-sm font-bold tabular-nums text-charcoal">{formatCurrency(info.getValue())}</span>,
    size: 110,
  }),
  col.accessor('paymentMethod', {
    header: 'Payment',
    cell: (info) => {
      const v = info.getValue();
      return (
        <span className={`text-[10px] font-bold tracking-wide px-2 py-0.5 rounded ${v === 'prepaid' ? 'bg-emerald-50 text-emerald-700' : 'bg-orange-50 text-orange-700'}`}>
          {v === 'prepaid' ? 'Online' : 'COD'}
        </span>
      );
    },
    size: 90,
  }),
  col.accessor('status', {
    header: 'Status',
    cell: (info) => <StatusBadge status={info.getValue()} />,
    size: 120,
  }),
  col.accessor('date', {
    header: 'Date',
    cell: (info) => (
      <Link to={`/orders/${info.row.original.id}`} className="text-xs text-ash hover:text-charcoal font-medium transition-colors">
        {formatDate(info.getValue())}
      </Link>
    ),
    sortingFn: (a, b) => new Date(a.original.date) - new Date(b.original.date),
    size: 110,
  }),
];

export default function OrderTable({ orders }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const statusTabs = ['all', ...ORDER_STATUSES];

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== 'all' && o.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return o.id?.toLowerCase().includes(q) || o.shipping?.fullName?.toLowerCase().includes(q) || o.shipping?.phone?.includes(q);
      }
      return true;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [orders, search, statusFilter]);

  const counts = useMemo(() => {
    const c = {};
    statusTabs.forEach((s) => { c[s] = s === 'all' ? orders.length : orders.filter((o) => o.status === s).length; });
    return c;
  }, [orders]);

  return (
    <DataTable
      data={filtered}
      columns={columns}
      emptyTitle="No orders found"
      emptySubtitle="Orders will appear here when customers place them"
      toolbar={
        <>
          <SearchInput value={search} onChange={setSearch} placeholder="Search by order ID, name, phone..." className="w-72" />
          <FilterPills options={statusTabs} value={statusFilter} onChange={setStatusFilter} counts={counts} />
        </>
      }
    />
  );
}

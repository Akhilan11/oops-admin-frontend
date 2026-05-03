import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { createColumnHelper } from '@tanstack/react-table';
import StatusBadge from '../../../shared/StatusBadge';
import SearchInput from '../../../shared/SearchInput';
import FilterPills from '../../../shared/FilterPills';
import DataTable from '../../../shared/DataTable';
import { formatCurrency } from '../../../utils/formatters';

const col = createColumnHelper();

function getTotalStock(p) {
  if (!p.stock) return null;
  return Object.values(p.stock).reduce((sum, v) => sum + (Number(v) || 0), 0);
}

const columns = [
  col.display({
    id: 'image',
    header: '',
    cell: (info) => {
      const p = info.row.original;
      return (
        <Link to={`/products/${p.id}`}>
          {(p.image || p.images?.[0]) ? (
            <img src={p.image || p.images[0]} alt="" className="w-10 h-12 object-cover rounded-lg bg-warmblack/10" />
          ) : (
            <div className="w-10 h-12 rounded-lg bg-warmblack/10 flex items-center justify-center text-ash/40 text-[9px] font-bold">IMG</div>
          )}
        </Link>
      );
    },
    size: 60,
    enableSorting: false,
  }),
  col.accessor('name', {
    header: 'Product',
    cell: (info) => {
      const p = info.row.original;
      return (
        <div>
          <Link to={`/products/${p.id}`} className="text-sm font-semibold text-charcoal hover:underline underline-offset-4 decoration-warmblack">{p.name}</Link>
          {p.shortDesc && <p className="text-xs text-ash mt-0.5 truncate max-w-[200px]">{p.shortDesc}</p>}
        </div>
      );
    },
  }),
  col.accessor('category', {
    header: 'Category',
    cell: (info) => <span className="text-xs text-ash font-medium">{info.getValue() || '—'}</span>,
    size: 100,
  }),
  col.accessor('price', {
    header: 'Price',
    cell: (info) => <span className="text-sm font-bold tabular-nums text-charcoal">{formatCurrency(info.getValue())}</span>,
    size: 100,
  }),
  col.accessor((row) => getTotalStock(row), {
    id: 'stock',
    header: 'Stock',
    cell: (info) => {
      const val = info.getValue();
      if (val === null) return <span className="text-xs text-ash/40">—</span>;
      return (
        <span className={`text-sm font-bold tabular-nums ${val === 0 ? 'text-red-500' : val < 10 ? 'text-amber-600' : 'text-emerald-600'}`}>
          {val}
        </span>
      );
    },
    size: 80,
  }),
  col.accessor('status', {
    header: 'Status',
    cell: (info) => <StatusBadge status={info.getValue()} />,
    size: 110,
  }),
  col.display({
    id: 'actions',
    header: 'Actions',
    cell: (info) => {
      const p = info.row.original;
      return (
        <div className="flex items-center gap-4">
          <Link to={`/products/${p.id}/edit`} className="text-[11px] font-semibold text-ash hover:text-charcoal transition-colors duration-200">Edit</Link>
          <button onClick={() => info.table.options.meta?.onDelete(p)} className="text-[11px] font-semibold text-clay/60 hover:text-clay transition-colors duration-200">Delete</button>
        </div>
      );
    },
    size: 120,
    enableSorting: false,
  }),
];

export default function ProductTable({ products, onDelete }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = useMemo(() => ['all', ...new Set(products.map((p) => p.category).filter(Boolean))], [products]);
  const statuses = ['all', 'available', 'sold-out', 'coming-soon'];

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q);
      }
      return true;
    });
  }, [products, search, statusFilter, categoryFilter]);

  return (
    <DataTable
      data={filtered}
      columns={columns}
      meta={{ onDelete }}
      emptyTitle="No products found"
      emptySubtitle="Try adjusting your filters"
      toolbar={
        <>
          <SearchInput value={search} onChange={setSearch} placeholder="Search products..." className="w-64" />
          <FilterPills options={statuses} value={statusFilter} onChange={setStatusFilter} />
          {categories.length > 2 && <FilterPills options={categories} value={categoryFilter} onChange={setCategoryFilter} />}
        </>
      }
    />
  );
}

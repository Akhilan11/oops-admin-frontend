import { useState, useRef } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import EmptyState from './EmptyState';

function ColumnToggle({ table }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-[11px] font-semibold text-ash hover:text-warmblack transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
          <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
          <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
          <line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" />
        </svg>
        Columns
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-30 bg-white rounded-xl shadow-lg border border-gray-200 py-2 min-w-[180px]">
            {table.getAllLeafColumns().map((col) => {
              if (col.id === 'actions') return null;
              return (
                <label key={col.id} className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={col.getIsVisible()}
                    onChange={col.getToggleVisibilityHandler()}
                    className="rounded border-gray-300 text-warmblack focus:ring-warmblack/20 w-3.5 h-3.5"
                  />
                  <span className="text-[12px] font-medium text-charcoal">{typeof col.columnDef.header === 'string' ? col.columnDef.header : col.id}</span>
                </label>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function SortIcon({ sorted }) {
  if (!sorted) return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-charcoal/30 ml-1.5">
      <path d="M7 15l5 5 5-5" /><path d="M7 9l5-5 5 5" />
    </svg>
  );
  return sorted === 'asc' ? (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-warmblack ml-1.5">
      <path d="M7 14l5-5 5 5" />
    </svg>
  ) : (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-warmblack ml-1.5">
      <path d="M7 10l5 5 5-5" />
    </svg>
  );
}

function DraggableHeader({ header, onDragStart, onDragOver, onDrop, isDragTarget }) {
  return (
    <th
      key={header.id}
      draggable={!header.isPlaceholder}
      onDragStart={(e) => onDragStart(e, header.id)}
      onDragOver={(e) => onDragOver(e, header.id)}
      onDrop={(e) => onDrop(e, header.id)}
      className={`p-4 text-[10px] font-bold tracking-[0.15em] uppercase text-charcoal/70 select-none transition-colors ${
        isDragTarget ? 'bg-warmblack/[0.06]' : ''
      }`}
      style={{ width: header.getSize() !== 150 ? header.getSize() : undefined, cursor: 'grab' }}
    >
      {header.isPlaceholder ? null : (
        <div
          className={`flex items-center gap-1 ${header.column.getCanSort() ? 'cursor-pointer hover:text-charcoal' : ''}`}
          onClick={header.column.getToggleSortingHandler()}
        >
          {/* Drag handle */}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-charcoal/30 shrink-0 mr-1">
            <circle cx="8" cy="5" r="2.5" /><circle cx="16" cy="5" r="2.5" />
            <circle cx="8" cy="12" r="2.5" /><circle cx="16" cy="12" r="2.5" />
            <circle cx="8" cy="19" r="2.5" /><circle cx="16" cy="19" r="2.5" />
          </svg>
          {flexRender(header.column.columnDef.header, header.getContext())}
          {header.column.getCanSort() && <SortIcon sorted={header.column.getIsSorted()} />}
        </div>
      )}
    </th>
  );
}

export default function DataTable({
  data,
  columns,
  meta,
  emptyTitle = 'No data',
  emptySubtitle = '',
  toolbar,
  pageSize = 10,
}) {
  const [sorting, setSorting] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnOrder, setColumnOrder] = useState([]);
  const [dragTarget, setDragTarget] = useState(null);
  const draggedCol = useRef(null);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnVisibility, columnOrder },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    meta,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });

  const handleDragStart = (e, colId) => {
    draggedCol.current = colId;
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, colId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (colId !== draggedCol.current) setDragTarget(colId);
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    setDragTarget(null);
    const sourceId = draggedCol.current;
    if (!sourceId || sourceId === targetId) return;

    const currentOrder = columnOrder.length > 0
      ? columnOrder
      : table.getAllLeafColumns().map((c) => c.id);

    const newOrder = [...currentOrder];
    const fromIdx = newOrder.indexOf(sourceId);
    const toIdx = newOrder.indexOf(targetId);
    if (fromIdx === -1 || toIdx === -1) return;

    newOrder.splice(fromIdx, 1);
    newOrder.splice(toIdx, 0, sourceId);
    setColumnOrder(newOrder);
    draggedCol.current = null;
  };

  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex;

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex flex-wrap items-center gap-3">
          {toolbar}
        </div>
        <ColumnToggle table={table} />
      </div>

      {/* Table */}
      {table.getRowModel().rows.length === 0 ? (
        <EmptyState title={emptyTitle} subtitle={emptySubtitle} />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-warmblack/8 bg-gray-50">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-warmblack/8 bg-gray-100">
                {table.getHeaderGroups()[0].headers.map((header) => (
                  <DraggableHeader
                    key={header.id}
                    header={header}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    isDragTarget={dragTarget === header.id}
                  />
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-warmblack/6">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-100 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex items-center justify-between mt-4 px-1">
          <p className="text-[11px] text-ash">
            {currentPage * pageSize + 1}–{Math.min((currentPage + 1) * pageSize, data.length)} of {data.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-ash hover:text-warmblack hover:bg-gray-100 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            {Array.from({ length: pageCount }, (_, i) => (
              <button
                key={i}
                onClick={() => table.setPageIndex(i)}
                className={`w-8 h-8 rounded-lg text-[11px] font-semibold transition-colors ${
                  i === currentPage ? 'bg-warmblack text-white' : 'text-ash hover:text-warmblack hover:bg-gray-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-ash hover:text-warmblack hover:bg-gray-100 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
} from '@tanstack/react-table';
import { useState } from 'react';
import { MdDelete } from 'react-icons/md';
import { useExpenses } from './useExpenses';
import { DEFAULT_CURRENCY } from '../../constants/app';

export default function ExpenseTable() {
  const { expenses, loading, deleteExpense } = useExpenses();
  const [sorting, setSorting] = useState([{ id: 'date', desc: true }]);

  const grandTotal = expenses.reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0);

  const columns = [
    {
      accessorKey: 'date',
      header: 'Date',
      meta: { className: 'whitespace-nowrap' },
      cell: info => new Date(info.getValue()).toLocaleDateString(),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: info => {
        const desc = info.getValue();
        const items = info.row.original.items;
        return (
          <div className="flex flex-col gap-2">
            <span className="font-medium text-white">{desc || <span className="text-slate-500 italic">No description</span>}</span>
            {items && items.length > 0 && (
              <div className="bg-slate-950/50 rounded-lg p-2 border border-white/5 space-y-1 mt-1">
                {items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs text-slate-400">
                    <span>• {item.name} <span className="text-slate-500">(x{item.quantity})</span></span>
                    <span className="text-slate-300 font-medium">
                      ₹{parseFloat(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }
    },
    {
      accessorKey: 'category',
      header: 'Category',
      meta: { className: 'hidden md:table-cell' },
      cell: info => (
        <span className="bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide uppercase shadow-[0_0_10px_rgba(16,185,129,0.1)]">
          {info.getValue()}
        </span>
      ),
    },
    {
      accessorKey: 'paymentMethod',
      header: 'Payment Method',
      meta: { className: 'hidden sm:table-cell' },
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: info => {
        const amount = parseFloat(info.getValue());
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: DEFAULT_CURRENCY
        }).format(amount);
      },
    },
    {
      id: 'actions',
      cell: info => (
        <button
          onClick={() => {
            if (window.confirm("Are you sure you want to delete this expense?")) {
              deleteExpense(info.row.original.id);
            }
          }}
          className="text-slate-500 hover:text-danger bg-slate-900/50 hover:bg-danger/20 p-2 rounded-xl transition-all duration-300 shadow-inner"
          title="Delete Expense"
        >
          <MdDelete className="text-xl" />
        </button>
      )
    }
  ];

  const table = useReactTable({
    data: expenses,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  if (loading) {
    return <div className="text-slate-400 p-4 text-center">Loading expenses...</div>;
  }

  return (
    <div className="glass-card overflow-hidden">
      {/* Desktop Table View (md and up) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="text-xs uppercase bg-slate-900/60 text-slate-400 border-b border-white/10">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th 
                    key={header.id} 
                    className={`px-6 py-5 font-bold tracking-wider cursor-pointer hover:text-white transition-colors ${header.column.columnDef.meta?.className || ''}`}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {{
                      asc: ' ↑',
                      desc: ' ↓',
                    }[header.column.getIsSorted()] ?? null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-white/5">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-white/5 transition-colors group">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className={`px-6 py-5 font-medium group-hover:text-white transition-colors ${cell.column.columnDef.meta?.className || ''}`}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500 font-medium">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <MdDelete className="text-4xl opacity-20" />
                    <span>No expenses found. Add one above!</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Desktop Grand Total Footer */}
      <div className="hidden md:flex justify-between items-center p-6 bg-slate-900 border-t border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-10 relative">
        <span className="text-xl font-bold text-slate-300 tracking-wider uppercase">Grand Total</span>
        <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-primary drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">
          {new Intl.NumberFormat('en-IN', { style: 'currency', currency: DEFAULT_CURRENCY }).format(grandTotal)}
        </span>
      </div>

      {/* Mobile Card View (below md) */}
      <div className="md:hidden flex flex-col divide-y divide-white/5">
        {table.getRowModel().rows.length > 0 ? (
          table.getRowModel().rows.map(row => {
            const data = row.original;
            return (
              <div key={row.id} className="p-5 space-y-4 hover:bg-white/5 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1">
                    <span className="text-white font-semibold text-base leading-tight">
                      {data.description || <span className="text-slate-500 italic font-normal">No description</span>}
                    </span>
                    <span className="text-slate-500 text-[11px] font-bold tracking-wider uppercase">
                      {new Date(data.date).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="bg-primary/10 text-primary border border-primary/20 px-2 py-1 rounded-md text-[10px] font-black tracking-widest uppercase shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                    {data.category}
                  </span>
                </div>

                {data.items && data.items.length > 0 && (
                  <div className="bg-slate-950/50 rounded-xl p-3 border border-white/5 space-y-2">
                    {data.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary/50"></div>
                          <span className="text-slate-300 font-medium">{item.name}</span>
                          <span className="text-slate-500 text-xs font-bold bg-white/5 px-1.5 rounded">x{item.quantity}</span>
                        </div>
                        <span className="text-emerald-400/90 font-mono text-xs">
                          ₹{parseFloat(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-between items-center pt-3 border-t border-white/5 mt-2">
                  <span className="text-slate-500 text-xs font-medium bg-slate-900/50 px-2 py-1 rounded-lg border border-white/5">
                    {data.paymentMethod}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">
                      {new Intl.NumberFormat('en-IN', { style: 'currency', currency: DEFAULT_CURRENCY }).format(data.amount)}
                    </span>
                    <button
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this expense?")) {
                          deleteExpense(data.id);
                        }
                      }}
                      className="text-slate-500 hover:text-danger bg-slate-900/50 hover:bg-danger/20 p-2 rounded-xl transition-all duration-300 border border-white/5"
                    >
                      <MdDelete className="text-lg" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center text-slate-500 font-medium flex flex-col items-center justify-center space-y-3">
            <MdDelete className="text-4xl opacity-20" />
            <span>No expenses found.</span>
          </div>
        )}
      </div>

      {/* Mobile Grand Total Footer */}
      <div className="md:hidden flex justify-between items-center p-5 bg-slate-900 border-t border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] sticky bottom-0 z-20">
        <span className="text-lg font-bold text-slate-300 tracking-wider uppercase">Total</span>
        <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-primary drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">
          {new Intl.NumberFormat('en-IN', { style: 'currency', currency: DEFAULT_CURRENCY }).format(grandTotal)}
        </span>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 text-sm text-slate-400 bg-slate-900/60">
        <div className="flex items-center gap-4">
          <button
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </button>
          <button
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
        </div>
        <div className="font-medium px-4 py-2 bg-slate-900/50 rounded-xl border border-white/5 shadow-inner">
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </div>
      </div>
    </div>
  );
}

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
  const [sorting, setSorting] = useState([]);

  const columns = [
    {
      accessorKey: 'date',
      header: 'Date',
      cell: info => new Date(info.getValue()).toLocaleDateString(),
    },
    {
      accessorKey: 'description',
      header: 'Description',
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: info => (
        <span className="bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide uppercase shadow-[0_0_10px_rgba(16,185,129,0.1)]">
          {info.getValue()}
        </span>
      ),
    },
    {
      accessorKey: 'paymentMethod',
      header: 'Payment Method',
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: info => {
        const amount = parseFloat(info.getValue());
        return new Intl.NumberFormat('en-US', {
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
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="text-xs uppercase bg-slate-900/60 text-slate-400 border-b border-white/10">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th 
                    key={header.id} 
                    className="px-6 py-5 font-bold tracking-wider cursor-pointer hover:text-white transition-colors"
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
                    <td key={cell.id} className="px-6 py-5 font-medium group-hover:text-white transition-colors">
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

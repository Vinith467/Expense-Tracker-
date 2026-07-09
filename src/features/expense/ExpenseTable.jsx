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
        <span className="bg-primary/20 text-primary px-2 py-1 rounded text-xs font-medium">
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
          className="text-slate-400 hover:text-danger transition-colors p-1"
          title="Delete Expense"
        >
          <MdDelete className="text-lg" />
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
          <thead className="text-xs uppercase bg-white/5 text-slate-400 border-b border-white/10">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th 
                    key={header.id} 
                    className="px-6 py-4 font-medium cursor-pointer hover:text-white"
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
                <tr key={row.id} className="hover:bg-white/5 transition-colors">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-6 py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-slate-500">
                  No expenses found. Add one above!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-white/10 text-sm text-slate-400 bg-white/5">
        <div className="flex items-center gap-2">
          <button
            className="p-1 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </button>
          <button
            className="p-1 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
        </div>
        <div>
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </div>
      </div>
    </div>
  );
}

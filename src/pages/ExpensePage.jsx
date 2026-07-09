import ExpenseTable from '../features/expense/ExpenseTable';

export default function ExpensePage() {
  return (
    <div className="space-y-8 fade-in pb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">History</h1>
      </div>
      <div>
        <ExpenseTable />
      </div>
    </div>
  );
}

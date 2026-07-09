import ExpenseForm from '../features/expense/ExpenseForm';
import ExpenseTable from '../features/expense/ExpenseTable';

export default function ExpensePage() {
  return (
    <div className="space-y-8 fade-in pb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Expenses</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ExpenseForm />
        </div>
        
        <div className="lg:col-span-2">
          <ExpenseTable />
        </div>
      </div>
    </div>
  );
}

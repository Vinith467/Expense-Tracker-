import ExpenseForm from '../features/expense/ExpenseForm';
import ExpenseTable from '../features/expense/ExpenseTable';

export default function ExpensePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Expenses</h1>
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

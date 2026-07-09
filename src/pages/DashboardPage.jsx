import ExpenseForm from '../features/expense/ExpenseForm';

export default function DashboardPage() {
  return (
    <div className="space-y-8 fade-in pb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Add Data</h1>
      </div>
      <div className="max-w-4xl mx-auto">
        <ExpenseForm />
      </div>
    </div>
  );
}

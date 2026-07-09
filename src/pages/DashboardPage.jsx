import SummaryCards from '../components/SummaryCards';
import ExpenseChart from '../components/ExpenseChart';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
      </div>

      <SummaryCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-1">
          <ExpenseChart />
        </div>
        {/* We can add a Recent Transactions card here later */}
        <div className="lg:col-span-1 glass-card p-6 flex flex-col items-center justify-center text-slate-400">
          More analytics coming soon...
        </div>
      </div>
    </div>
  );
}

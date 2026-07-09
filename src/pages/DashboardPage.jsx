import SummaryCards from '../components/SummaryCards';
import ExpenseChart from '../components/ExpenseChart';

export default function DashboardPage() {
  return (
    <div className="space-y-8 fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Dashboard</h1>
      </div>

      <SummaryCards />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="xl:col-span-1 glass-card p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-primary/10 transition-colors duration-500" />
          <ExpenseChart />
        </div>
        
        {/* We can add a Recent Transactions card here later */}
        <div className="xl:col-span-1 glass-card p-8 flex flex-col items-center justify-center text-slate-500 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-secondary/5 blur-[60px] rounded-full pointer-events-none" />
          <svg className="w-16 h-16 mb-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <p className="text-lg font-medium tracking-wide">More analytics coming soon...</p>
        </div>
      </div>
    </div>
  );
}

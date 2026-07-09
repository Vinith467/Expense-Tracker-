import { MdAttachMoney, MdToday, MdCalendarMonth } from 'react-icons/md';
import { useExpenses } from '../features/expense/useExpenses';
import { DEFAULT_CURRENCY } from '../constants/app';

export default function SummaryCards() {
  const { expenses } = useExpenses();

  // Calculations
  const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  
  const todayStr = new Date().toISOString().split('T')[0];
  const todayExpenses = expenses
    .filter(exp => exp.date === todayStr)
    .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

  const currentMonthStr = todayStr.substring(0, 7); // YYYY-MM
  const monthExpenses = expenses
    .filter(exp => exp.date.startsWith(currentMonthStr))
    .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: DEFAULT_CURRENCY
    }).format(amount);
  };

  const cards = [
    { title: 'Total Expenses', amount: totalExpenses, icon: MdAttachMoney, color: 'text-primary', bg: 'bg-primary/20', shadow: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]' },
    { title: 'This Month', amount: monthExpenses, icon: MdCalendarMonth, color: 'text-secondary', bg: 'bg-secondary/20', shadow: 'shadow-[0_0_15px_rgba(6,182,212,0.3)]' },
    { title: 'Today', amount: todayExpenses, icon: MdToday, color: 'text-danger', bg: 'bg-danger/20', shadow: 'shadow-[0_0_15px_rgba(244,63,94,0.3)]' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className="glass-card p-6 flex items-center gap-5 group">
            <div className={`p-4 rounded-2xl ${card.bg} ${card.color} ${card.shadow} transition-transform duration-300 group-hover:scale-110`}>
              <Icon className="text-3xl" />
            </div>
            <div>
              <p className="text-sm text-slate-400 font-medium tracking-wide uppercase">{card.title}</p>
              <p className="text-3xl font-bold text-white tracking-tight mt-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400 transition-all">
                {formatCurrency(card.amount)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

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
    { title: 'Total Expenses', amount: totalExpenses, icon: MdAttachMoney, color: 'text-primary' },
    { title: 'This Month', amount: monthExpenses, icon: MdCalendarMonth, color: 'text-secondary' },
    { title: 'Today', amount: todayExpenses, icon: MdToday, color: 'text-warning' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className="glass-card p-6 flex items-center gap-4">
            <div className={`p-3 rounded-full bg-white/5 ${card.color}`}>
              <Icon className="text-2xl" />
            </div>
            <div>
              <p className="text-sm text-slate-400 font-medium">{card.title}</p>
              <p className="text-2xl font-bold text-white tracking-tight">
                {formatCurrency(card.amount)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

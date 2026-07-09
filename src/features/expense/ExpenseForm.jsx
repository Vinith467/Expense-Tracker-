import { useForm } from 'react-hook-form';
import { useExpenses } from './useExpenses';

const CATEGORIES = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Health', 'Other'];
const PAYMENT_METHODS = ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Bank Transfer'];

export default function ExpenseForm() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      amount: '',
      category: CATEGORIES[0],
      date: new Date().toISOString().split('T')[0],
      description: '',
      paymentMethod: PAYMENT_METHODS[0]
    }
  });
  const { addExpense } = useExpenses();

  const onSubmit = async (data) => {
    try {
      await addExpense({
        ...data,
        amount: parseFloat(data.amount)
      });
      reset(); // Resets to default values
    } catch (error) {
      console.error("Failed to add expense:", error);
      alert("Failed to add expense. Check console for details.");
    }
  };

  return (
    <div className="glass-card p-8">
      <h2 className="text-xl font-bold mb-6 text-white tracking-wide">Add New Expense</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Amount</label>
            <input
              type="number"
              step="0.01"
              {...register('amount', { required: 'Amount is required', min: 0.01 })}
              className="w-full bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3 text-white text-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
              placeholder="0.00"
            />
            {errors.amount && <p className="text-danger text-xs mt-1">{errors.amount.message}</p>}
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Date</label>
            <input
              type="date"
              {...register('date', { required: 'Date is required' })}
              className="w-full bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3 text-white text-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
            />
            {errors.date && <p className="text-danger text-xs mt-1">{errors.date.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Category</label>
            <select
              {...register('category')}
              className="w-full bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all shadow-inner [&>option]:bg-slate-900"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Payment</label>
            <select
              {...register('paymentMethod')}
              className="w-full bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all shadow-inner [&>option]:bg-slate-900"
            >
              {PAYMENT_METHODS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Description</label>
          <input
            type="text"
            {...register('description')}
            className="w-full bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
            placeholder="What was this for?"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="glass-button w-full bg-primary/20 border border-primary/50 text-primary hover:bg-primary hover:text-white font-bold py-4 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] disabled:opacity-50 mt-4"
        >
          {isSubmitting ? 'Adding...' : 'Add Expense'}
        </button>

      </form>
    </div>
  );
}

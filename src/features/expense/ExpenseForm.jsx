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
    <div className="glass-card p-6">
      <h2 className="text-xl font-semibold mb-4 text-white">Add Expense</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Amount</label>
            <input
              type="number"
              step="0.01"
              {...register('amount', { required: 'Amount is required', min: 0.01 })}
              className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="0.00"
            />
            {errors.amount && <p className="text-danger text-xs mt-1">{errors.amount.message}</p>}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Date</label>
            <input
              type="date"
              {...register('date', { required: 'Date is required' })}
              className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
            />
            {errors.date && <p className="text-danger text-xs mt-1">{errors.date.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Category</label>
            <select
              {...register('category')}
              className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors [&>option]:bg-slate-900"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Payment Method</label>
            <select
              {...register('paymentMethod')}
              className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors [&>option]:bg-slate-900"
            >
              {PAYMENT_METHODS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
          <input
            type="text"
            {...register('description')}
            className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
            placeholder="What was this for?"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Adding...' : 'Add Expense'}
        </button>

      </form>
    </div>
  );
}

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useExpenses } from './useExpenses';
import { MdAdd, MdRemoveCircleOutline, MdList, MdAttachMoney } from 'react-icons/md';

const CATEGORIES = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Health', 'Other'];
const PAYMENT_METHODS = ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Bank Transfer'];

export default function ExpenseForm() {
  const [isMultiItem, setIsMultiItem] = useState(false);

  const { register, control, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      amount: '',
      category: CATEGORIES[0],
      date: new Date().toISOString().split('T')[0],
      description: '',
      paymentMethod: PAYMENT_METHODS[0],
      items: [{ name: '', price: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  const watchItems = watch("items");
  const calculatedTotal = watchItems?.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0) || 0;

  const { addExpense } = useExpenses();

  const onSubmit = async (data) => {
    try {
      let finalAmount = 0;
      let finalItems = [];

      if (isMultiItem) {
        finalAmount = calculatedTotal;
        finalItems = data.items
          .filter(item => item.name.trim() !== '' && item.price !== '')
          .map(item => ({ ...item, price: parseFloat(item.price) }));
      } else {
        finalAmount = parseFloat(data.amount);
      }

      if (finalAmount <= 0) {
        alert("Total amount must be greater than 0");
        return;
      }

      await addExpense({
        amount: finalAmount,
        category: data.category,
        date: data.date,
        description: data.description,
        paymentMethod: data.paymentMethod,
        items: finalItems
      });
      
      reset(); 
      setIsMultiItem(false);
    } catch (error) {
      console.error("Failed to add expense:", error);
      alert("Failed to add expense. Check console for details.");
    }
  };

  return (
    <div className="glass-card p-8 relative overflow-hidden">
      <div className="flex items-center justify-between mb-6 relative z-10">
        <h2 className="text-xl font-bold text-white tracking-wide">Add New Expense</h2>
        <button
          type="button"
          onClick={() => setIsMultiItem(!isMultiItem)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
            isMultiItem 
              ? 'bg-primary/20 text-primary border border-primary/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]' 
              : 'bg-white/5 text-slate-400 hover:text-white border border-white/10 hover:bg-white/10'
          }`}
        >
          {isMultiItem ? <MdAttachMoney className="text-lg" /> : <MdList className="text-lg" />}
          {isMultiItem ? 'Single Amount' : 'Add Multiple Items'}
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10">
        
        {/* Toggle between Single Amount and Multiple Items */}
        {!isMultiItem ? (
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Amount</label>
            <input
              type="number"
              step="0.01"
              {...register('amount', { required: !isMultiItem ? 'Amount is required' : false, min: 0.01 })}
              className="w-full bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3 text-white text-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
              placeholder="0.00"
            />
            {errors.amount && <p className="text-danger text-xs mt-1">{errors.amount.message}</p>}
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/5 space-y-4 shadow-inner">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-primary uppercase tracking-wider">Line Items (Dishes, Products, etc.)</label>
              <div className="text-sm font-bold text-white bg-primary/20 px-3 py-1 rounded-lg border border-primary/20">
                Total: ${calculatedTotal.toFixed(2)}
              </div>
            </div>
            
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      {...register(`items.${index}.name`, { required: true })}
                      placeholder="Item name (e.g., Pizza)"
                      className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary/50 transition-all"
                    />
                  </div>
                  <div className="w-28">
                    <input
                      type="number"
                      step="0.01"
                      {...register(`items.${index}.price`, { required: true, min: 0.01 })}
                      placeholder="Price"
                      className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary/50 transition-all"
                    />
                  </div>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-2 text-slate-500 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                    >
                      <MdRemoveCircleOutline className="text-xl" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <button
              type="button"
              onClick={() => append({ name: '', price: '' })}
              className="flex items-center gap-2 text-sm text-primary hover:text-emerald-400 font-medium transition-colors pt-2"
            >
              <MdAdd className="text-lg" /> Add another item
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Date</label>
            <input
              type="date"
              {...register('date', { required: 'Date is required' })}
              className="w-full bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3 text-white text-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
            />
            {errors.date && <p className="text-danger text-xs mt-1">{errors.date.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Category</label>
            <select
              {...register('category')}
              className="w-full bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all shadow-inner [&>option]:bg-slate-900"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-1">
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Payment</label>
            <select
              {...register('paymentMethod')}
              className="w-full bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all shadow-inner [&>option]:bg-slate-900"
            >
              {PAYMENT_METHODS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          
          <div className="md:col-span-1">
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Description</label>
            <input
              type="text"
              {...register('description')}
              className="w-full bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
              placeholder={isMultiItem ? "e.g., Dinner at Olive Garden" : "What was this for?"}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || (isMultiItem && calculatedTotal <= 0)}
          className="glass-button w-full bg-primary/20 border border-primary/50 text-primary hover:bg-primary hover:text-white font-bold py-4 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] disabled:opacity-50 mt-4"
        >
          {isSubmitting ? 'Adding...' : 'Add Expense'}
        </button>

      </form>
    </div>
  );
}

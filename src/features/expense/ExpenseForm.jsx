import { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useExpenses } from './useExpenses';
import { MdAdd, MdRemove, MdEdit, MdReceiptLong } from 'react-icons/md';
import EditMenuModal from './EditMenuModal';
import { useCategoryMenu } from './useCategoryMenu';
import ReceiptScanner from './ReceiptScanner';

export const CATEGORIES = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Health', 'Other'];
const PAYMENT_METHODS = ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Bank Transfer'];

export default function ExpenseForm() {
  const { register, handleSubmit, reset, control, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      category: 'Food',
      date: new Date().toISOString().split('T')[0],
      description: '',
      manualAmount: '',
      paymentMethod: 'Cash'
    }
  });

  const { addExpense } = useExpenses();
  const currentCategory = useWatch({ control, name: 'category' });
  const manualAmount = useWatch({ control, name: 'manualAmount' });
  
  const { menuItems, loading: menuLoading } = useCategoryMenu(currentCategory);

  const [quantities, setQuantities] = useState({});
  const [isEditingMenu, setIsEditingMenu] = useState(false);
  const [forceManual, setForceManual] = useState(false);

  // Reset quantities when category changes, but don't force manual off if we just scanned a receipt
  useEffect(() => {
    setQuantities({});
  }, [currentCategory]);

  const updateQuantity = (id, delta) => {
    setForceManual(false); // If they start tapping the POS grid again, turn off forced manual
    setQuantities(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const isManualFallback = forceManual || (!menuLoading && menuItems.length === 0);

  const handleScanComplete = (scannedData) => {
    setValue('category', scannedData.category);
    setValue('description', scannedData.title);
    if (scannedData.amount) {
      setValue('manualAmount', scannedData.amount);
    }
    setForceManual(true);
  };

  const calculatedTotal = isManualFallback 
    ? (parseFloat(manualAmount) || 0)
    : menuItems.reduce((sum, item) => {
        const qty = quantities[item.id] || 0;
        return sum + (item.price * qty);
      }, 0);

  const onSubmit = async (data) => {
    try {
      let finalItems = [];

      if (isManualFallback) {
        if (!data.manualAmount || parseFloat(data.manualAmount) <= 0) {
          alert("Please enter a valid amount!");
          return;
        }
        finalItems = [{
          name: data.description || 'Manual Entry',
          price: parseFloat(data.manualAmount),
          quantity: 1
        }];
      } else {
        finalItems = menuItems
          .filter(item => (quantities[item.id] || 0) > 0)
          .map(item => ({
            name: item.name,
            price: parseFloat(item.price),
            quantity: quantities[item.id]
          }));

        if (finalItems.length === 0) {
          alert("Please add at least one item from the menu!");
          return;
        }
      }

      await addExpense({
        amount: calculatedTotal,
        category: data.category,
        date: data.date,
        description: data.description,
        paymentMethod: data.paymentMethod,
        items: finalItems
      });
      
      reset(); 
      setQuantities({});
      setForceManual(false);
    } catch (error) {
      console.error("Failed to add expense:", error);
      alert("Failed to add expense. Check console for details.");
    }
  };

  if (isEditingMenu) {
    return (
      <EditMenuModal 
        initialCategory={currentCategory} 
        onClose={() => setIsEditingMenu(false)} 
      />
    );
  }

  return (
    <div className="glass-card p-5 sm:p-8 relative overflow-hidden">
      <div className="flex items-center justify-between mb-6 relative z-10">
        <h2 className="text-xl font-bold text-white tracking-wide">New Order</h2>
        <div className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-primary drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
          Total: ₹{calculatedTotal.toFixed(2)}
        </div>
      </div>

      <div className="mb-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Category</label>
            <select
              {...register('category')}
              className="w-full bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all shadow-inner [&>option]:bg-slate-900"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Date</label>
            <input
              type="date"
              {...register('date', { required: 'Date is required' })}
              className="w-full bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
            />
            {errors.date && <p className="text-danger text-xs mt-1">{errors.date.message}</p>}
          </div>
        </div>

        <div className="mb-6">
          <ReceiptScanner onScanComplete={handleScanComplete} />
        </div>

        <div className="flex items-center justify-between mb-3 border-t border-white/10 pt-4">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {isManualFallback ? 'Manual Entry / Scanned Receipt' : 'Menu Items'}
          </label>
          <div className="flex items-center gap-3">
            {menuItems.length > 0 && isManualFallback && (
               <button type="button" onClick={() => setForceManual(false)} className="text-xs text-slate-400 hover:text-white transition-colors">
                 Show POS Grid
               </button>
            )}
            <button type="button" onClick={() => setIsEditingMenu(true)} className="text-xs flex items-center gap-1 text-primary hover:text-emerald-400">
              <MdEdit /> Edit Menu
            </button>
          </div>
        </div>
        
        {menuLoading ? (
          <div className="text-slate-400 text-center py-6 text-sm">Loading Menu...</div>
        ) : isManualFallback ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/40 p-4 rounded-xl border border-primary/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
             <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Title / Merchant Name</label>
              <input
                type="text"
                {...register('description')}
                placeholder="e.g., Taxi Fare"
                className="w-full bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-all shadow-inner"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Amount (₹)</label>
              <input
                type="number"
                step="0.01"
                {...register('manualAmount')}
                placeholder="0.00"
                className="w-full bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-all shadow-inner"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
            {menuItems.map(item => {
              const qty = quantities[item.id] || 0;
              return (
                <div 
                  key={item.id} 
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    qty > 0 
                      ? 'bg-primary/10 border-primary/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                      : 'bg-slate-900/40 border-white/5'
                  }`}
                >
                  <div>
                    <div className="text-white font-medium">{item.name}</div>
                    <div className="text-primary text-xs font-bold">₹{item.price}</div>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-950/50 rounded-lg p-1 border border-white/5">
                    <button 
                      type="button" 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-8 h-8 flex items-center justify-center rounded-md bg-white/5 hover:bg-danger/20 hover:text-danger text-slate-300 transition-colors"
                    >
                      <MdRemove />
                    </button>
                    <span className="w-4 text-center text-white font-bold">{qty}</span>
                    <button 
                      type="button" 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-md bg-white/5 hover:bg-primary/20 hover:text-primary text-slate-300 transition-colors"
                    >
                      <MdAdd />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 relative z-10 pt-4 border-t border-white/10">
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
          
          {!isManualFallback && (
            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Description (Optional)</label>
              <input
                type="text"
                {...register('description')}
                className="w-full bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
                placeholder="e.g., Table 4 Order"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || calculatedTotal <= 0}
          className="glass-button w-full bg-primary/20 border border-primary/50 text-primary hover:bg-primary hover:text-slate-950 font-black tracking-wider py-4 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] disabled:opacity-50 mt-4 uppercase transition-all"
        >
          {isSubmitting ? 'Saving Order...' : `Submit Expense (₹${calculatedTotal.toFixed(2)})`}
        </button>

      </form>
    </div>
  );
}

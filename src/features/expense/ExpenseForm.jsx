import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useExpenses } from './useExpenses';
import { MdAdd, MdRemove, MdEdit, MdSave, MdDelete, MdClose } from 'react-icons/md';

const CATEGORIES = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Health', 'Other'];
const PAYMENT_METHODS = ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Bank Transfer'];

export default function ExpenseForm() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      category: 'Food',
      date: new Date().toISOString().split('T')[0],
      description: '',
      paymentMethod: 'Cash'
    }
  });

  const { addExpense } = useExpenses();

  // Menu State
  const [menuItems, setMenuItems] = useState(() => {
    const saved = localStorage.getItem('tracker_menu');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', name: 'Dosa', price: 50 },
      { id: '2', name: 'Ragi', price: 40 },
      { id: '3', name: 'Rice', price: 60 },
      { id: '4', name: 'Idli', price: 40 }
    ];
  });

  const [quantities, setQuantities] = useState({});
  const [isEditingMenu, setIsEditingMenu] = useState(false);
  const [editingItems, setEditingItems] = useState([]);

  useEffect(() => {
    localStorage.setItem('tracker_menu', JSON.stringify(menuItems));
  }, [menuItems]);

  const updateQuantity = (id, delta) => {
    setQuantities(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const calculatedTotal = menuItems.reduce((sum, item) => {
    const qty = quantities[item.id] || 0;
    return sum + (item.price * qty);
  }, 0);

  const onSubmit = async (data) => {
    try {
      const finalItems = menuItems
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
    } catch (error) {
      console.error("Failed to add expense:", error);
      alert("Failed to add expense. Check console for details.");
    }
  };

  const startEditingMenu = () => {
    setEditingItems([...menuItems]);
    setIsEditingMenu(true);
  };

  const saveMenu = () => {
    const validItems = editingItems.filter(i => i.name.trim() !== '' && i.price > 0);
    setMenuItems(validItems);
    setIsEditingMenu(false);
  };

  if (isEditingMenu) {
    return (
      <div className="glass-card p-5 sm:p-8 relative overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Edit Menu</h2>
          <button onClick={() => setIsEditingMenu(false)} className="text-slate-400 hover:text-white">
            <MdClose className="text-2xl" />
          </button>
        </div>
        
        <div className="space-y-3 mb-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {editingItems.map((item, index) => (
            <div key={item.id} className="flex items-center gap-2">
              <input
                type="text"
                value={item.name}
                onChange={e => {
                  const newItems = [...editingItems];
                  newItems[index].name = e.target.value;
                  setEditingItems(newItems);
                }}
                placeholder="Item Name"
                className="flex-[2] bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 transition-all"
              />
              <input
                type="number"
                value={item.price}
                onChange={e => {
                  const newItems = [...editingItems];
                  newItems[index].price = parseFloat(e.target.value) || 0;
                  setEditingItems(newItems);
                }}
                placeholder="Price"
                className="flex-1 bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 transition-all"
              />
              <button
                onClick={() => {
                  const newItems = [...editingItems];
                  newItems.splice(index, 1);
                  setEditingItems(newItems);
                }}
                className="p-3 text-slate-500 hover:text-danger hover:bg-danger/10 rounded-xl transition-colors"
              >
                <MdDelete className="text-xl" />
              </button>
            </div>
          ))}
          <button
            onClick={() => setEditingItems([...editingItems, { id: Date.now().toString(), name: '', price: 0 }])}
            className="flex items-center gap-2 text-sm text-primary hover:text-emerald-400 font-medium transition-colors p-2"
          >
            <MdAdd className="text-lg" /> Add Menu Item
          </button>
        </div>

        <button
          onClick={saveMenu}
          className="glass-button w-full bg-primary text-slate-950 hover:bg-emerald-400 font-bold py-4 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2"
        >
          <MdSave className="text-xl" /> Save Menu
        </button>
      </div>
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
        <div className="flex items-center justify-between mb-3">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Menu Items</label>
          <button onClick={startEditingMenu} className="text-xs flex items-center gap-1 text-primary hover:text-emerald-400">
            <MdEdit /> Edit Menu
          </button>
        </div>
        
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
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 relative z-10 pt-4 border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Date</label>
            <input
              type="date"
              {...register('date', { required: 'Date is required' })}
              className="w-full bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
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
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Description (Optional)</label>
            <input
              type="text"
              {...register('description')}
              className="w-full bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
              placeholder="e.g., Table 4 Order"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || calculatedTotal <= 0}
          className="glass-button w-full bg-primary/20 border border-primary/50 text-primary hover:bg-primary hover:text-slate-950 font-black tracking-wider py-4 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] disabled:opacity-50 mt-4 uppercase transition-all"
        >
          {isSubmitting ? 'Saving Order...' : `Submit Order (₹${calculatedTotal.toFixed(2)})`}
        </button>

      </form>
    </div>
  );
}

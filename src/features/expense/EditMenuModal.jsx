import { useState, useEffect } from 'react';
import { MdAdd, MdRemove, MdEdit, MdSave, MdDelete, MdClose } from 'react-icons/md';
import { useCategoryMenu } from './useCategoryMenu';
import { CATEGORIES } from './ExpenseForm';

export default function EditMenuModal({ onClose, initialCategory }) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || CATEGORIES[0]);
  const { menuItems, updateMenu, loading } = useCategoryMenu(selectedCategory);
  
  const [editingItems, setEditingItems] = useState([]);

  useEffect(() => {
    if (!loading) {
      setEditingItems(menuItems.map(item => ({ ...item }))); // Deep copy
    }
  }, [menuItems, loading, selectedCategory]);

  const saveMenu = async () => {
    const validItems = editingItems
      .filter(i => i.name.trim() !== '' && i.price > 0)
      .map(i => ({ id: i.id || Date.now().toString() + Math.random(), name: i.name.trim(), price: parseFloat(i.price) }));
    
    await updateMenu(validItems);
    onClose();
  };

  return (
    <div className="glass-card p-5 sm:p-8 relative overflow-hidden flex flex-col h-full max-h-[80vh]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Edit Menu</h2>
        <button onClick={onClose} className="text-slate-400 hover:text-white">
          <MdClose className="text-2xl" />
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Select Category to Edit</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-all shadow-inner [&>option]:bg-slate-900"
        >
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-primary">Loading...</div>
      ) : (
        <div className="flex-1 space-y-3 mb-6 overflow-y-auto pr-2 custom-scrollbar">
          {editingItems.length === 0 && (
            <div className="text-slate-400 text-sm text-center py-4">No menu items for this category yet. Add some below!</div>
          )}
          {editingItems.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
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
                  newItems[index].price = e.target.value;
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
            onClick={() => setEditingItems([...editingItems, { id: Date.now().toString(), name: '', price: '' }])}
            className="flex items-center gap-2 text-sm text-primary hover:text-emerald-400 font-medium transition-colors p-2 mt-2"
          >
            <MdAdd className="text-lg" /> Add Menu Item
          </button>
        </div>
      )}

      <button
        onClick={saveMenu}
        className="glass-button w-full bg-primary text-slate-950 hover:bg-emerald-400 font-bold py-4 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2 mt-auto"
      >
        <MdSave className="text-xl" /> Save Menu
      </button>
    </div>
  );
}

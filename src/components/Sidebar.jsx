import { NavLink, useLocation } from 'react-router-dom';
import { ROUTES } from '../constants/app';
import { MdAddCircle, MdHistory, MdAttachMoney } from 'react-icons/md';

export default function Sidebar() {
  const location = useLocation();
  const navItems = [
    { name: 'Add Data', path: ROUTES.DASHBOARD, icon: MdAddCircle },
    { name: 'History', path: ROUTES.EXPENSES, icon: MdHistory },
  ];

  return (
    <aside className="w-64 border-r border-white/5 bg-slate-900/40 backdrop-blur-3xl hidden md:flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.2)] z-20">
      <div className="h-20 flex items-center px-6 border-b border-white/5 bg-white/5">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3 tracking-wide">
          <div className="bg-gradient-to-br from-primary to-emerald-400 p-2 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.4)]">
            <MdAttachMoney className="text-slate-950 text-xl" />
          </div>
          Tracker
          <span className="text-primary text-xs ml-1 font-black bg-primary/20 px-2 py-1 rounded-md">PRO</span>
        </h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 font-medium ${
                  isActive
                    ? 'bg-gradient-to-r from-primary/20 to-transparent text-primary border-l-4 border-primary shadow-[inset_0_0_20px_rgba(16,185,129,0.1)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border-l-4 border-transparent'
                }`
              }
            >
              <Icon className={`text-xl ${item.path === location.pathname ? 'drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]' : ''}`} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

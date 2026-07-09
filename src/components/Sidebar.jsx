import { NavLink } from 'react-router-dom';
import { ROUTES } from '../constants/app';
import { MdDashboard, MdAttachMoney } from 'react-icons/md';

export default function Sidebar() {
  const navItems = [
    { name: 'Dashboard', path: ROUTES.DASHBOARD, icon: MdDashboard },
    { name: 'Expenses', path: ROUTES.EXPENSES, icon: MdAttachMoney },
  ];

  return (
    <aside className="w-64 border-r border-white/10 bg-slate-900/50 backdrop-blur-xl hidden md:flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <h1 className="text-xl font-bold text-primary flex items-center gap-2">
          <span className="bg-primary/20 p-1.5 rounded-lg">
            <MdAttachMoney className="text-primary" />
          </span>
          Tracker
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
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`
              }
            >
              <Icon className="text-lg" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

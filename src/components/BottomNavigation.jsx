import { NavLink } from 'react-router-dom';
import { ROUTES } from '../constants/app';
import { MdAddCircle, MdHistory, MdAttachMoney } from 'react-icons/md';

export default function BottomNavigation() {
  const navItems = [
    { name: 'Add Data', path: ROUTES.DASHBOARD, icon: MdAddCircle },
    { name: 'History', path: ROUTES.EXPENSES, icon: MdHistory },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-slate-900/60 backdrop-blur-2xl border-t border-white/5 z-50 pb-safe">
      <div className="flex items-center justify-around px-2 py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 flex-1 py-1 px-2 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? 'text-primary scale-110'
                    : 'text-slate-500 hover:text-slate-300 active:scale-95'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-2 rounded-xl transition-colors duration-300 ${isActive ? 'bg-primary/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-transparent'}`}>
                    <Icon className="text-2xl" />
                  </div>
                  <span className="text-[10px] font-medium tracking-wide">
                    {item.name}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

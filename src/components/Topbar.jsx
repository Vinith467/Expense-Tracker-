import { useAuthStore } from '../store/useAuthStore';
import { logOut } from '../services/firebase/auth';
import { MdLogout, MdAttachMoney } from 'react-icons/md';

export default function Topbar() {
  const { user } = useAuthStore();

  return (
    <header className="h-16 border-b border-white/5 bg-slate-900/40 backdrop-blur-2xl flex items-center justify-between px-6 sticky top-0 z-40 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
      <div className="flex items-center gap-4">
        {/* Mobile Brand Logo (Visible only on mobile) */}
        <h1 className="md:hidden text-xl font-bold text-white flex items-center gap-2 tracking-wide">
          <div className="bg-gradient-to-br from-primary to-emerald-400 p-1.5 rounded-lg shadow-[0_0_10px_rgba(16,185,129,0.4)]">
            <MdAttachMoney className="text-slate-950 text-lg" />
          </div>
          Tracker
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm hidden sm:block">
          <p className="text-slate-300 font-medium">{user?.displayName || 'User'}</p>
          <p className="text-slate-500 text-xs">{user?.email}</p>
        </div>
        
        {user?.photoURL ? (
          <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full border border-white/10 shadow-lg" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/10 flex items-center justify-center text-primary font-bold shadow-lg">
            {(user?.email?.[0] || 'U').toUpperCase()}
          </div>
        )}

        <button 
          onClick={logOut}
          className="ml-2 p-2.5 rounded-xl text-slate-400 hover:text-danger hover:bg-danger/10 transition-all duration-300 active:scale-95"
          title="Logout"
        >
          <MdLogout className="text-xl" />
        </button>
      </div>
    </header>
  );
}

import { useAuthStore } from '../store/useAuthStore';
import { logOut } from '../services/firebase/auth';
import { MdLogout } from 'react-icons/md';

export default function Topbar() {
  const { user } = useAuthStore();

  return (
    <header className="h-16 border-b border-white/10 bg-slate-900/50 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        {/* Mobile menu button could go here */}
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm hidden sm:block">
          <p className="text-slate-300 font-medium">{user?.displayName || 'User'}</p>
          <p className="text-slate-500 text-xs">{user?.email}</p>
        </div>
        
        {user?.photoURL ? (
          <img src={user.photoURL} alt="Profile" className="w-9 h-9 rounded-full border border-white/10" />
        ) : (
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            {(user?.email?.[0] || 'U').toUpperCase()}
          </div>
        )}

        <button 
          onClick={logOut}
          className="ml-2 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Logout"
        >
          <MdLogout className="text-xl" />
        </button>
      </div>
    </header>
  );
}

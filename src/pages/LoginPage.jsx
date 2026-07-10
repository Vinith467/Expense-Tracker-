import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { signInWithEmail, registerWithEmail } from '../services/firebase/auth';
import { useAuthStore } from '../store/useAuthStore';
import { ROUTES } from '../constants/app';
import { MdEmail, MdLock, MdLogin, MdPersonAdd } from 'react-icons/md';

export default function LoginPage() {
  const { user } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      if (isLogin) {
        await signInWithEmail(email, password);
      } else {
        await registerWithEmail(email, password);
      }
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists. Try logging in.');
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Email/Password auth is disabled in your Firebase console!');
      } else {
        setError(err.message.replace('Firebase: ', ''));
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 relative overflow-hidden">
      {/* Decorative Glow Elements */}
      <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-secondary/20 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="glass-card p-8 sm:p-10 w-full max-w-md space-y-8 relative z-10 border border-white/10 shadow-2xl shadow-primary/10">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-emerald-400 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-primary/20 mb-6">
            <svg className="w-8 h-8 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-slate-400 text-sm">
            {isLogin ? 'Enter your credentials to access your vault' : 'Sign up to start tracking your expenses securely'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-slate-900/50 rounded-xl border border-white/5">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isLogin ? 'bg-primary text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isLogin ? 'bg-primary text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            Sign Up
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MdEmail className="text-slate-500 text-xl" />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white text-base focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-slate-600"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MdLock className="text-slate-500 text-xl" />
              </div>
              <input
                type="password"
                placeholder="Password (min 6 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white text-base focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-slate-600"
                required
                minLength={6}
              />
            </div>
          </div>

          {error && (
            <div className="bg-danger/10 border border-danger/20 text-danger text-sm p-3 rounded-lg text-center font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-emerald-400 text-slate-950 font-bold py-3.5 rounded-xl text-lg shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all disabled:opacity-70 flex justify-center items-center gap-2"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
            ) : isLogin ? (
              <><MdLogin className="text-xl" /> Sign In</>
            ) : (
              <><MdPersonAdd className="text-xl" /> Create Account</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

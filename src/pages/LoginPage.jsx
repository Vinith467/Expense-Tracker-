import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { signInWithEmail, registerWithEmail } from '../services/firebase/auth';
import { useAuthStore } from '../store/useAuthStore';
import { ROUTES } from '../constants/app';

const SECRET_EMAIL = 'admin@expensetracker.app';

export default function LoginPage() {
  const { user } = useAuthStore();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters (Firebase rule).');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Attempt to log in with the hidden email and provided password
      await signInWithEmail(SECRET_EMAIL, password);
    } catch (err) {
      // If login fails (either wrong password or account doesn't exist yet)
      try {
        // Attempt to create the account. 
        // If this succeeds, it means it's their FIRST time logging in, and this password is now saved!
        await registerWithEmail(SECRET_EMAIL, password);
      } catch (registerErr) {
        // If registration fails with 'email-already-in-use', the account exists but they typed the wrong password.
        if (registerErr.code === 'auth/email-already-in-use') {
          setError('Incorrect PIN.');
        } else if (registerErr.code === 'auth/operation-not-allowed') {
          setError('Email/Password auth is disabled in your Firebase console!');
        } else {
          setError(`Error: ${registerErr.message}`);
          console.error(registerErr);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-4 relative overflow-hidden">
      {/* Decorative Glow Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="glass-card p-10 w-full max-w-sm space-y-8 relative z-10">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-primary/20 mb-6">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Vault Access</h1>
          <p className="text-slate-400 text-sm">Enter your secure PIN to unlock</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <input
              type="password"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-4 py-4 text-center tracking-[0.5em] text-white text-2xl focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-600 placeholder:tracking-normal"
              autoFocus
            />
            {error && <p className="text-danger text-sm mt-3 text-center font-medium absolute -bottom-6 w-full">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="glass-button w-full bg-gradient-to-r from-primary to-emerald-400 text-slate-950 font-bold py-4 text-lg shadow-lg shadow-primary/30 hover:shadow-primary/50 disabled:opacity-50"
          >
            {loading ? (
              <svg className="animate-spin h-6 w-6 text-slate-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Unlock App'}
          </button>
        </form>
      </div>
    </div>
  );
}

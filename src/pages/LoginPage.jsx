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
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="glass-card p-8 w-full max-w-sm space-y-6 shadow-2xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Tracker</h1>
          <p className="text-slate-400 text-sm">Enter your secret PIN to unlock</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="e.g. 123456"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3 text-center tracking-[0.25em] text-white text-xl focus:outline-none focus:border-primary transition-colors"
              autoFocus
            />
            {error && <p className="text-danger text-sm mt-3 text-center font-medium">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-primary hover:bg-primary-hover transition-colors text-white font-medium py-3 disabled:opacity-50"
          >
            {loading ? 'Unlocking...' : 'Unlock App'}
          </button>
        </form>
      </div>
    </div>
  );
}

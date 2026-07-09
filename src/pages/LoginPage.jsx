import { signInWithGoogle } from '../services/firebase/auth';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="glass-card p-8 w-full max-w-sm text-center space-y-6">
        <h1 className="text-xl font-semibold text-white">Expense Tracker</h1>
        <p className="text-slate-400 text-sm">Sign in to continue</p>
        <button
          onClick={signInWithGoogle}
          className="w-full rounded-xl bg-primary hover:bg-primary-hover transition-colors text-white font-medium py-2.5"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}

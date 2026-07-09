import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { ROUTES } from '../constants/app';
import MainLayout from '../layouts/MainLayout';

export default function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-slate-400">
        Loading…
      </div>
    );
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  return (
    <MainLayout>
      {children}
    </MainLayout>
  );
}

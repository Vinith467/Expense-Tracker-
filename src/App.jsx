import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { subscribeToAuthChanges } from './services/firebase/auth';
import { useAuthStore } from './store/useAuthStore';
import { ROUTES } from './constants/app';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import ExpensePage from './pages/ExpensePage';
import LoginPage from './pages/LoginPage';

function App() {
  const { setUser, clearUser } = useAuthStore();

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        clearUser();
      }
    });
    return unsubscribe;
  }, [setUser, clearUser]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.EXPENSES}
          element={
            <ProtectedRoute>
              <ExpensePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

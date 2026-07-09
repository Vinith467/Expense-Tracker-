import { create } from 'zustand';

/**
 * Holds the currently signed-in user and auth loading state.
 * Populated by subscribeToAuthChanges (see services/firebase/auth.js),
 * wired up once in App's top-level effect.
 */
export const useAuthStore = create((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),
  clearUser: () => set({ user: null, isLoading: false }),
}));

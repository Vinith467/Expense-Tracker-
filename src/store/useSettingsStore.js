import { create } from 'zustand';
import { DEFAULT_CURRENCY } from '../constants/app';

export const useSettingsStore = create((set) => ({
  currency: DEFAULT_CURRENCY,
  theme: 'dark',
  accentColor: 'emerald',
  setCurrency: (currency) => set({ currency }),
  setTheme: (theme) => set({ theme }),
  setAccentColor: (accentColor) => set({ accentColor }),
}));

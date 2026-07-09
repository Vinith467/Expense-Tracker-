import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import app from './config';

export const db = getFirestore(app);

// Collection name constants (see Firestore schema in project docs)
export const COLLECTIONS = {
  USERS: 'users',
  EXPENSES: 'expenses',
  INCOME: 'income',
  BUDGETS: 'budgets',
  GOALS: 'goals',
  SETTINGS: 'settings',
};

// Uncomment during local development against the Firestore emulator:
// if (import.meta.env.DEV) {
//   connectFirestoreEmulator(db, 'localhost', 8080);
// }

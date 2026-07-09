import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../services/firebase/firestore';
import { useAuthStore } from '../../store/useAuthStore';

export function useExpenses() {
  const { user } = useAuthStore();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setExpenses([]);
      setLoading(false);
      return;
    }

    const expensesRef = collection(db, 'expenses');
    // Security rules will enforce that users can only read their own expenses
    const q = query(
      expensesRef, 
      where('uid', '==', user.uid),
      orderBy('date', 'desc') // Assuming 'date' is a YYYY-MM-DD string
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setExpenses(data);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching expenses:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const addExpense = async (expenseData) => {
    if (!user) throw new Error("Must be logged in to add an expense");
    
    const expensesRef = collection(db, 'expenses');
    return addDoc(expensesRef, {
      ...expenseData,
      uid: user.uid,
      createdAt: serverTimestamp()
    });
  };

  const deleteExpense = async (id) => {
    if (!user) throw new Error("Must be logged in to delete an expense");
    
    const docRef = doc(db, 'expenses', id);
    return deleteDoc(docRef);
  };

  return { expenses, loading, error, addExpense, deleteExpense };
}

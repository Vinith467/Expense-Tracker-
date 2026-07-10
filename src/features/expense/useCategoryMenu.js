import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../../services/firebase/firestore';
import { useAuthStore } from '../../store/useAuthStore';

export function useCategoryMenu(category) {
  const { user } = useAuthStore();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !category) {
      setMenuItems([]);
      setLoading(false);
      return;
    }

    const docRef = doc(db, 'categoryMenus', `${user.uid}_${category}`);
    
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setMenuItems(docSnap.data().items || []);
        } else {
          // Automatic Migration from legacy localStorage for the 'Food' category
          if (category === 'Food') {
            const saved = localStorage.getItem('tracker_menu');
            if (saved) {
              try {
                const parsed = JSON.parse(saved);
                if (parsed && parsed.length > 0) {
                  setDoc(docRef, { items: parsed });
                  setMenuItems(parsed);
                  setLoading(false);
                  return;
                }
              } catch (e) {
                console.error("Migration parse error", e);
              }
            }
          }
          // No menu exists for this category (fallback condition)
          setMenuItems([]);
        }
        setLoading(false);
      },
      (err) => {
        console.error(`Error fetching menu for ${category}:`, err);
        setMenuItems([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [category, user]);

  const updateMenu = async (newItems) => {
    if (!user || !category) return;
    try {
      const docRef = doc(db, 'categoryMenus', `${user.uid}_${category}`);
      await setDoc(docRef, { items: newItems }, { merge: true });
    } catch (err) {
      console.error(`Error saving menu for ${category}:`, err);
      throw err;
    }
  };

  return { menuItems, updateMenu, loading };
}

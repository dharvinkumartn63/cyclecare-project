import { auth, db } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const getTodayKey = () => new Date().toISOString().split('T')[0];

const withTimeout = (promise, ms = 1200) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Network timeout')), ms))
  ]);
};

export const hydrationApi = {
  getTodayHydration: async () => {
    const today = getTodayKey();
    const uid = auth.currentUser?.uid || 'demo_user';
    const stored = JSON.parse(localStorage.getItem(`cc_hydration_${today}`)) || { date: today, completedGlasses: 3, dailyGoal: 8 };

    try {
      const snap = await withTimeout(getDoc(doc(db, 'hydrationRecords', `${uid}_${today}`)), 1200);
      const data = snap.exists() ? snap.data() : stored;
      return { data: { success: true, data } };
    } catch (_) {
      return { data: { success: true, data: stored } };
    }
  },

  updateHydration: async (data) => {
    const today = getTodayKey();
    const uid = auth.currentUser?.uid || 'demo_user';
    const payload = { ...data, date: today, userId: uid };
    try {
      await withTimeout(setDoc(doc(db, 'hydrationRecords', `${uid}_${today}`), payload, { merge: true }), 1500);
    } catch (_) {}
    localStorage.setItem(`cc_hydration_${today}`, JSON.stringify(payload));
    return { data: { success: true, data: payload } };
  },

  resetHydration: async () => {
    return hydrationApi.updateHydration({ completedGlasses: 0 });
  },

  getHydrationHistory: async () => {
    const history = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split('T')[0];
      const dayData = JSON.parse(localStorage.getItem(`cc_hydration_${dateKey}`)) || {
        date: dateKey,
        completedGlasses: i === 0 ? 3 : Math.floor(Math.random() * 5) + 3,
        dailyGoal: 8
      };
      history.push(dayData);
    }
    return { data: { success: true, data: history } };
  },
};

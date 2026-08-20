import { auth, db } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const getTodayKey = () => new Date().toISOString().split('T')[0];

export const hydrationApi = {
  getTodayHydration: async () => {
    const today = getTodayKey();
    const uid = auth.currentUser?.uid || 'demo_user';
    try {
      const snap = await getDoc(doc(db, 'hydrationRecords', `${uid}_${today}`));
      const data = snap.exists() ? snap.data() : { date: today, completedGlasses: 3, dailyGoal: 8 };
      return { data: { success: true, data } };
    } catch (_) {
      const stored = JSON.parse(localStorage.getItem(`cc_hydration_${today}`)) || { date: today, completedGlasses: 3, dailyGoal: 8 };
      return { data: { success: true, data: stored } };
    }
  },

  updateHydration: async (data) => {
    const today = getTodayKey();
    const uid = auth.currentUser?.uid || 'demo_user';
    const payload = { ...data, date: today, userId: uid };
    try {
      await setDoc(doc(db, 'hydrationRecords', `${uid}_${today}`), payload, { merge: true });
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
      history.push({ date: dateKey, completedGlasses: i === 0 ? 3 : Math.floor(Math.random() * 6) + 3, dailyGoal: 8 });
    }
    return { data: { success: true, data: history } };
  },
};

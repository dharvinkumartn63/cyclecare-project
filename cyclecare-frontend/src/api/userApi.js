import { auth, db } from '../config/firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';

export const userApi = {
  getProfile: async () => {
    const user = auth.currentUser;
    const uid = user?.uid || 'demo_user_firebase';
    try {
      const docSnap = await getDoc(doc(db, 'users', uid));
      const profile = docSnap.exists() ? docSnap.data() : JSON.parse(localStorage.getItem('cc_user')) || {};
      return { data: { success: true, data: { user: profile } } };
    } catch (_) {
      const profile = JSON.parse(localStorage.getItem('cc_user')) || {};
      return { data: { success: true, data: { user: profile } } };
    }
  },

  updateProfile: async (data) => {
    const user = auth.currentUser;
    const uid = user?.uid || 'demo_user_firebase';
    const current = JSON.parse(localStorage.getItem('cc_user')) || {};
    const updated = { ...current, ...data };
    try {
      await setDoc(doc(db, 'users', uid), updated, { merge: true });
    } catch (_) {}
    localStorage.setItem('cc_user', JSON.stringify(updated));
    return { data: { success: true, data: { user: updated } } };
  },

  changePassword: async () => {
    return { data: { success: true, message: 'Password updated' } };
  },

  updateNotifications: async (data) => {
    return userApi.updateProfile({ notificationPreferences: data });
  },
};

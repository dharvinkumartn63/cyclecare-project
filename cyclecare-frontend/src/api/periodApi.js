import { auth, db } from '../config/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const withTimeout = (promise, ms = 1200) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Network timeout')), ms))
  ]);
};

const getLocalPeriods = () => {
  try {
    return JSON.parse(localStorage.getItem('cc_periods')) || [
      { _id: 'p1', startDate: new Date(Date.now() - 15 * 86400000).toISOString(), endDate: new Date(Date.now() - 10 * 86400000).toISOString() },
      { _id: 'p2', startDate: new Date(Date.now() - 43 * 86400000).toISOString(), endDate: new Date(Date.now() - 38 * 86400000).toISOString() },
      { _id: 'p3', startDate: new Date(Date.now() - 71 * 86400000).toISOString(), endDate: new Date(Date.now() - 66 * 86400000).toISOString() },
    ];
  } catch (_) { return []; }
};

export const periodApi = {
  getPeriods: async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      return { data: { success: true, data: getLocalPeriods() } };
    }
    try {
      const q = query(collection(db, 'periodRecords'), where('userId', '==', uid));
      const snap = await withTimeout(getDocs(q), 1200);
      const list = snap.docs.map((d) => ({ _id: d.id, ...d.data() }));
      return { data: { success: true, data: list.length ? list : getLocalPeriods() } };
    } catch (_) {
      return { data: { success: true, data: getLocalPeriods() } };
    }
  },

  createPeriod: async (data) => {
    const uid = auth.currentUser?.uid || 'demo_user';
    const newRecord = { ...data, userId: uid, createdAt: new Date().toISOString() };
    try {
      const docRef = await withTimeout(addDoc(collection(db, 'periodRecords'), newRecord), 1500);
      const saved = { _id: docRef.id, ...newRecord };
      const current = getLocalPeriods();
      localStorage.setItem('cc_periods', JSON.stringify([saved, ...current]));
      return { data: { success: true, data: saved } };
    } catch (_) {
      const saved = { _id: 'p_' + Date.now(), ...newRecord };
      const current = getLocalPeriods();
      localStorage.setItem('cc_periods', JSON.stringify([saved, ...current]));
      return { data: { success: true, data: saved } };
    }
  },

  updatePeriod: async (id, data) => {
    try {
      await withTimeout(updateDoc(doc(db, 'periodRecords', id), data), 1500);
    } catch (_) {}
    const current = getLocalPeriods().map((p) => (p._id === id ? { ...p, ...data } : p));
    localStorage.setItem('cc_periods', JSON.stringify(current));
    return { data: { success: true, data: { _id: id, ...data } } };
  },

  deletePeriod: async (id) => {
    try {
      await withTimeout(deleteDoc(doc(db, 'periodRecords', id)), 1500);
    } catch (_) {}
    const current = getLocalPeriods().filter((p) => p._id !== id);
    localStorage.setItem('cc_periods', JSON.stringify(current));
    return { data: { success: true } };
  },
};

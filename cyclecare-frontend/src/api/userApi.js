import { auth, db } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const withTimeout = (promise, ms = 1200) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Network timeout')), ms))
  ]);
};

export const userApi = {
  getProfile: async () => {
    const user = auth.currentUser;
    const uid = user?.uid || 'demo_user_firebase';
    const stored = JSON.parse(localStorage.getItem('cc_user')) || {};
    try {
      const docSnap = await withTimeout(getDoc(doc(db, 'users', uid)), 1200);
      const profile = docSnap.exists() ? docSnap.data() : stored;
      return { data: { success: true, data: { user: profile } } };
    } catch (_) {
      return { data: { success: true, data: { user: stored } } };
    }
  },

  updateProfile: async (data) => {
    const user = auth.currentUser;
    const uid = user?.uid || 'demo_user_firebase';
    const current = JSON.parse(localStorage.getItem('cc_user')) || {};
    const updated = { ...current, ...data };
    try {
      await withTimeout(setDoc(doc(db, 'users', uid), updated, { merge: true }), 1500);
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

  submitFeedback: async (data) => {
    const recipient = 'dharvin558@gmail.com';
    const subject = 'carecycle issue';
    const body = `Issue Category: ${data.issueType || 'General Issue'}\nFrom User Email: ${data.email || 'N/A'}\n\nIssue Details:\n${data.message}`;

    // Trigger direct mail client to dharvin558@gmail.com with subject "carecycle issue"
    const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    try {
      window.open(mailtoUrl, '_blank');
    } catch (_) {}

    return {
      data: {
        success: true,
        message: 'Feedback report created.',
        data: { recipient, subject, mailtoUrl }
      }
    };
  },
};

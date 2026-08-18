import { useState } from 'react';
import { Bell, Droplets, CalendarHeart, RefreshCw, Shield, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { userApi } from '../api/userApi';
import Button from '../components/ui/Button';
import AppLayout from '../components/layout/AppLayout';
import toast from 'react-hot-toast';

const Toggle = ({ checked, onChange, disabled }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    disabled={disabled}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 ${checked ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'}`}
  >
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
);

const SettingsSection = ({ title, icon: Icon, children }) => (
  <div className="card flex flex-col gap-4">
    <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3 mb-1">
      <Icon className="w-5 h-5 text-primary-500" />
      <h3 className="section-title">{title}</h3>
    </div>
    {children}
  </div>
);

const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [notifPrefs, setNotifPrefs] = useState(user?.notificationPreferences || { periodReminder: false, hydrationReminder: false, cycleUpdateReminder: false });
  const [saving, setSaving] = useState(false);

  const toggleNotif = async (key) => {
    const newPrefs = { ...notifPrefs, [key]: !notifPrefs[key] };
    setNotifPrefs(newPrefs);
    setSaving(true);
    try {
      await userApi.updateNotifications(newPrefs);
      updateUser({ ...user, notificationPreferences: newPrefs });
      toast.success('Notification preferences saved.');
    } catch { toast.error('Failed to save preferences.'); setNotifPrefs(notifPrefs); }
    finally { setSaving(false); }
  };

  const notifItems = [
    { key: 'periodReminder', label: 'Period Reminder', desc: 'Get notified when your estimated period is approaching.' },
    { key: 'hydrationReminder', label: 'Hydration Reminder', desc: 'Daily reminder to log your water intake.' },
    { key: 'cycleUpdateReminder', label: 'Cycle Update Reminder', desc: 'Reminder to add your latest period record.' },
  ];

  return (
    <AppLayout>
      <div className="flex flex-col gap-6 max-w-2xl animate-slide-up">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="text-muted">Manage your app preferences and account settings.</p>
        </div>

        {/* Appearance */}
        <SettingsSection title="Appearance" icon={isDark ? Moon : Sun}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Dark Mode</p>
              <p className="text-xs text-gray-400">Switch between light and dark theme.</p>
            </div>
            <Toggle checked={isDark} onChange={toggleTheme} />
          </div>
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection title="Notification Preferences" icon={Bell}>
          {notifItems.map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-1">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</p>
                <p className="text-xs text-gray-400">{desc}</p>
              </div>
              <Toggle checked={notifPrefs[key]} onChange={() => toggleNotif(key)} disabled={saving} />
            </div>
          ))}
          <p className="text-xs text-gray-400 italic mt-1">
            Note: In-app notifications only. Push notifications require browser permission.
          </p>
        </SettingsSection>

        {/* Account info */}
        <SettingsSection title="Account" icon={Shield}>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-400">Name</span><span className="font-medium text-gray-800 dark:text-gray-100">{user?.name}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">User ID</span><span className="font-medium text-gray-800 dark:text-gray-100">@{user?.userId}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Email</span><span className="font-medium text-gray-800 dark:text-gray-100">{user?.email}</span></div>
          </div>
          <div className="mt-2">
            <Button variant="outline" size="sm" onClick={() => window.location.href = '/profile'}>
              Manage Profile & Password
            </Button>
          </div>
        </SettingsSection>

        {/* Privacy notice */}
        <div className="card bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-1">Privacy & Data</p>
              <p className="text-xs text-blue-600 dark:text-blue-500">
                Your cycle and wellness data is private and stored securely. Only you can access your records.
                CycleCare does not share your personal health data with any third parties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;

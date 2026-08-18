import { useState, useRef } from 'react';
import { User, Mail, CalendarDays, Clock, Droplets, Shield, Camera, ChevronRight, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../api/userApi';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import AppLayout from '../components/layout/AppLayout';
import { getInitials, formatDate } from '../utils/dateUtils';
import toast from 'react-hot-toast';

const PRESET_AVATARS = [
  '/women.png',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
];

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);
  const [editing, setEditing] = useState(false);
  const [showPwModal, setShowPwModal] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || '',
    averageCycleLength: user?.averageCycleLength || 28,
    averagePeriodDuration: user?.averagePeriodDuration || 5,
    dailyHydrationGoal: user?.dailyHydrationGoal || 8,
  });
  const [saving, setSaving] = useState(false);

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [pwError, setPwError] = useState('');
  const [pwSaving, setPwSaving] = useState(false);

  // Profile Picture Upload Handler
  const handleAvatarChange = async (avatarUrl) => {
    setUploadingAvatar(true);
    try {
      const res = await userApi.updateProfile({ avatar: avatarUrl });
      updateUser(res.data.data.user);
      toast.success('Profile picture updated!');
    } catch {
      toast.error('Failed to update profile picture.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      toast.error('Image size must be less than 3MB.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      handleAvatarChange(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await userApi.updateProfile({
        name: form.name,
        averageCycleLength: Number(form.averageCycleLength),
        averagePeriodDuration: Number(form.averagePeriodDuration),
        dailyHydrationGoal: Number(form.dailyHydrationGoal),
      });
      updateUser(res.data.data.user);
      toast.success('Profile updated successfully.');
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwError('');
    if (pwForm.newPassword !== pwForm.confirmNewPassword) {
      setPwError('Passwords do not match.');
      return;
    }
    if (pwForm.newPassword.length < 8) {
      setPwError('New password must be at least 8 characters.');
      return;
    }
    setPwSaving(true);
    try {
      await userApi.changePassword({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
        confirmNewPassword: pwForm.confirmNewPassword,
      });
      toast.success('Password changed successfully.');
      setShowPwModal(false);
      setPwForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err) {
      setPwError(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-6 max-w-2xl animate-slide-up">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="text-muted">View and manage your profile and account settings.</p>
        </div>

        {/* Profile Card with Avatar Upload */}
        <div className="card flex flex-col sm:flex-row items-center gap-6 relative">
          <div className="relative group flex-shrink-0">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-2xl object-cover border-2 border-primary-300 shadow-glow"
              />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-2xl flex items-center justify-center text-white font-extrabold text-3xl shadow-glow">
                {getInitials(user?.name)}
              </div>
            )}
            
            {/* Camera Upload Badge */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="absolute -bottom-2 -right-2 p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-lg transition-transform hover:scale-110"
              title="Change Profile Picture"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
            <p className="text-muted text-sm">@{user?.userId}</p>
            <p className="text-muted text-sm">{user?.email}</p>
            <p className="text-xs text-gray-400 mt-1">Member since {formatDate(user?.createdAt, 'MMMM yyyy')}</p>

            {/* Quick Preset Avatars */}
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
              <span className="text-xs text-gray-400 mr-1">Preset:</span>
              {PRESET_AVATARS.map((src, i) => (
                <button
                  key={i}
                  onClick={() => handleAvatarChange(src)}
                  className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-transform hover:scale-110 ${
                    user?.avatar === src ? 'border-primary-500 ring-2 ring-primary-300' : 'border-gray-200'
                  }`}
                >
                  <img src={src} alt="preset" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {!editing && (
            <Button variant="outline" size="sm" onClick={() => setEditing(true)} className="sm:self-start">
              Edit Profile
            </Button>
          )}
        </div>

        {/* Edit profile form or Cycle Settings display */}
        {editing ? (
          <form onSubmit={handleSaveProfile} className="card flex flex-col gap-4">
            <h3 className="section-title">Edit Profile Info</h3>
            <Input label="Full Name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} icon={User} required />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="label">Cycle Length (days)</label>
                <input type="number" min={15} max={60} value={form.averageCycleLength} onChange={(e) => setForm((p) => ({ ...p, averageCycleLength: e.target.value }))} className="input-field" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="label">Period Duration (days)</label>
                <input type="number" min={1} max={14} value={form.averagePeriodDuration} onChange={(e) => setForm((p) => ({ ...p, averagePeriodDuration: e.target.value }))} className="input-field" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="label">Hydration Goal</label>
                <input type="number" min={1} max={20} value={form.dailyHydrationGoal} onChange={(e) => setForm((p) => ({ ...p, dailyHydrationGoal: e.target.value }))} className="input-field" />
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <Button variant="ghost" type="button" onClick={() => setEditing(false)}>Cancel</Button>
              <Button type="submit" loading={saving}>Save Changes</Button>
            </div>
          </form>
        ) : (
          <div className="card">
            <h3 className="section-title mb-4">Cycle & Wellness Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: CalendarDays, label: 'Avg Cycle Length', value: `${user?.averageCycleLength || 28} days` },
                { icon: Clock, label: 'Avg Period Duration', value: `${user?.averagePeriodDuration || 5} days` },
                { icon: Droplets, label: 'Daily Hydration Goal', value: `${user?.dailyHydrationGoal || 8} glasses` },
                { icon: Mail, label: 'Email', value: user?.email },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-primary-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sleek 1-Line Change Password Action */}
        <div
          onClick={() => setShowPwModal(true)}
          className="card flex items-center justify-between hover:border-secondary-300 dark:hover:border-secondary-700 cursor-pointer transition-all hover:shadow-md group py-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-secondary-50 dark:bg-secondary-900/20 rounded-xl flex items-center justify-center text-secondary-500">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 group-hover:text-secondary-600 dark:group-hover:text-secondary-400 transition-colors">
                Change Password
              </p>
              <p className="text-xs text-gray-400">Click to change your account password</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-secondary-500 group-hover:translate-x-1 transition-transform">
            <span>Change</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Change Password Modal */}
        <Modal
          isOpen={showPwModal}
          onClose={() => setShowPwModal(false)}
          title="Change Password"
        >
          <form onSubmit={handlePasswordChange} className="flex flex-col gap-4 pt-1">
            {pwError && <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 p-2.5 rounded-lg border border-red-200 dark:border-red-800">{pwError}</p>}
            <Input
              label="Current Password"
              type="password"
              value={pwForm.currentPassword}
              onChange={(e) => setPwForm((p) => ({ ...p, currentPassword: e.target.value }))}
              required
            />
            <Input
              label="New Password"
              type="password"
              value={pwForm.newPassword}
              onChange={(e) => setPwForm((p) => ({ ...p, newPassword: e.target.value }))}
              hint="Min. 8 characters with uppercase, lowercase, and a number."
              required
            />
            <Input
              label="Confirm New Password"
              type="password"
              value={pwForm.confirmNewPassword}
              onChange={(e) => setPwForm((p) => ({ ...p, confirmNewPassword: e.target.value }))}
              required
            />
            <div className="flex justify-end gap-3 pt-3">
              <Button type="button" variant="ghost" onClick={() => setShowPwModal(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={pwSaving} variant="secondary">
                Update Password
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AppLayout>
  );
};

export default ProfilePage;

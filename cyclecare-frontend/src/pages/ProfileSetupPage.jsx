import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Clock, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../api/userApi';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const ProfileSetupPage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    averageCycleLength: 28,
    averagePeriodDuration: 5,
    lastPeriodStartDate: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        averageCycleLength: parseInt(form.averageCycleLength, 10),
        averagePeriodDuration: parseInt(form.averagePeriodDuration, 10),
        lastPeriodStartDate: form.lastPeriodStartDate || null,
        profileSetupComplete: true,
      };
      const res = await userApi.updateProfile(payload);
      updateUser(res.data.data.user);
      toast.success('Profile setup complete! 🌸');
      navigate('/dashboard');
    } catch {
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    try {
      const res = await userApi.updateProfile({ profileSetupComplete: true });
      updateUser(res.data.data.user);
    } catch (_) {}
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-purple-50 dark:from-gray-950 dark:to-gray-900 p-6">
      <div className="card w-full max-w-lg animate-slide-up">
        <div className="flex items-center gap-3 mb-6">
          <img src="/women.png" alt="CycleCare" className="w-10 h-10 object-contain" />
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Welcome, {user?.name?.split(' ')[0]}! 🌸</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Let's set up your cycle profile</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl mb-6 border border-blue-100 dark:border-blue-800">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-700 dark:text-blue-400">
            Your cycle information helps us estimate your upcoming period. You can update this at any time in Settings.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Average Cycle Length"
              name="averageCycleLength"
              type="number"
              min={15} max={60}
              value={form.averageCycleLength}
              onChange={handleChange}
              icon={CalendarDays}
              hint="Days (typically 21–35)"
              required
            />

            <Input
              label="Typical Period Duration"
              name="averagePeriodDuration"
              type="number"
              min={1} max={14}
              value={form.averagePeriodDuration}
              onChange={handleChange}
              icon={Clock}
              hint="Days (typically 3–7)"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="label">Last Period Start Date <span className="text-xs text-gray-400 font-normal ml-1">(Optional)</span></label>
            <input
              name="lastPeriodStartDate"
              type="date"
              value={form.lastPeriodStartDate}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              className="input-field"
            />
            <p className="text-xs text-gray-400">Helps us give you a better first prediction.</p>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Button type="submit" loading={loading} className="w-full" size="lg">
              Save & Go to Dashboard
            </Button>
            <Button type="button" variant="ghost" onClick={handleSkip} className="w-full text-sm text-gray-400">
              Skip for now
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetupPage;

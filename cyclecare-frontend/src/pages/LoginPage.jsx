import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { ErrorMessage } from '../components/ui/EmptyState';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.identifier || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.login(form);
      const { token, user } = res.data.data;
      login(token, user);
      toast.success(`Welcome back, ${user.name}! 🌸`);
      navigate(user.profileSetupComplete ? '/dashboard' : '/setup');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-500 to-secondary-600 flex-col items-center justify-center p-12 text-white">
        <img src="/women.png" alt="CycleCare" className="w-32 h-32 object-contain mb-8 drop-shadow-xl filter brightness-200" />
        <h2 className="text-4xl font-extrabold mb-4 text-center">Welcome back to<br />CycleCare</h2>
        <p className="text-primary-100 text-center max-w-xs text-base">
          Track your cycle, understand your wellness, and stay informed — all in one place.
        </p>
        <div className="mt-10 grid grid-cols-2 gap-4 w-full max-w-xs">
          {['Period Tracking', 'Smart Prediction', 'Hydration', 'Insights'].map((f) => (
            <div key={f} className="bg-white/20 rounded-xl p-3 text-sm font-medium text-center backdrop-blur-sm">{f}</div>
          ))}
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-white dark:bg-gray-950">
        <div className="w-full max-w-md animate-slide-up">
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <img src="/women.png" alt="CycleCare" className="w-9 h-9 object-contain" />
            <span className="text-xl font-bold text-primary-600 dark:text-primary-400">CycleCare</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Sign In</h1>
          <p className="text-muted mb-8">Enter your credentials to access your account.</p>

          {error && <div className="mb-4"><ErrorMessage message={error} /></div>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="User ID or Email"
              name="identifier"
              type="text"
              placeholder="e.g. jane_doe or jane@email.com"
              value={form.identifier}
              onChange={handleChange}
              icon={User2}
              required
              autoComplete="username"
            />
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              icon={Lock}
              required
              autoComplete="current-password"
            />
            <Button type="submit" loading={loading} className="w-full mt-2" size="lg">
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
              Create Account
            </Link>
          </p>

          <p className="mt-8 text-xs text-gray-400 text-center italic">
            ⚕️ CycleCare is an estimation tool. Not a medical device.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

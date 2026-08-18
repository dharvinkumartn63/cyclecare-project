import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, AtSign, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { ErrorMessage } from '../components/ui/EmptyState';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', userId: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: '' }));
    setApiError('');
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required.';
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Please enter a valid email address.';
    if (!form.userId || form.userId.length < 3) errs.userId = 'User ID must be at least 3 characters.';
    if (!/^[a-zA-Z0-9_]+$/.test(form.userId)) errs.userId = 'User ID can only contain letters, numbers, and underscores.';
    if (!form.password || form.password.length < 8) errs.password = 'Password must be at least 8 characters.';
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) errs.password = 'Password must contain uppercase, lowercase, and a number.';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await authApi.register(form);
      const { token, user } = res.data.data;
      login(token, user);
      toast.success('Account created! Welcome to CycleCare 🌸');
      navigate('/setup');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left branding */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-secondary-500 to-primary-500 flex-col items-center justify-center p-12 text-white">
        <img src="/women.png" alt="CycleCare" className="w-28 h-28 object-contain mb-6 drop-shadow-xl filter brightness-200" />
        <h2 className="text-3xl font-extrabold mb-4 text-center">Join CycleCare</h2>
        <p className="text-secondary-100 text-center max-w-xs">
          Start understanding your cycle with accurate tracking and personalised wellness insights.
        </p>
        <div className="mt-10 space-y-3 w-full max-w-xs">
          {['✅ Secure & private account', '✅ Free period tracking', '✅ Smart cycle prediction', '✅ Daily hydration goals'].map((f) => (
            <div key={f} className="bg-white/20 rounded-xl px-4 py-2.5 text-sm backdrop-blur-sm">{f}</div>
          ))}
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-white dark:bg-gray-950 overflow-y-auto">
        <div className="w-full max-w-md animate-slide-up">
          <div className="flex items-center gap-3 mb-6 lg:hidden">
            <img src="/women.png" alt="CycleCare" className="w-9 h-9 object-contain" />
            <span className="text-xl font-bold text-primary-600 dark:text-primary-400">CycleCare</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Create Account</h1>
          <p className="text-muted mb-7">Join thousands tracking their cycle with CycleCare.</p>

          {apiError && <div className="mb-4"><ErrorMessage message={apiError} /></div>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <Input label="Full Name" name="name" placeholder="e.g. Jane Doe" value={form.name} onChange={handleChange} icon={User} error={errors.name} required />
            <Input label="Email Address" name="email" type="email" placeholder="jane@example.com" value={form.email} onChange={handleChange} icon={Mail} error={errors.email} required />
            <Input label="User ID" name="userId" placeholder="e.g. jane_doe (no spaces)" value={form.userId} onChange={handleChange} icon={AtSign} error={errors.userId} hint="3–30 characters. Letters, numbers, underscores only." required />
            <Input label="Password" name="password" type="password" placeholder="Create a strong password" value={form.password} onChange={handleChange} icon={Lock} error={errors.password} hint="Min. 8 characters with uppercase, lowercase, and a number." required />
            <Input label="Confirm Password" name="confirmPassword" type="password" placeholder="Repeat your password" value={form.confirmPassword} onChange={handleChange} icon={Lock} error={errors.confirmPassword} required />

            <Button type="submit" loading={loading} className="w-full mt-2" size="lg">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">Sign In</Link>
          </p>
          <p className="mt-6 text-xs text-gray-400 text-center italic">⚕️ CycleCare is not a medical device. Predictions are estimates only.</p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

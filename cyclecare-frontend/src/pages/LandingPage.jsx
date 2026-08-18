import { Link } from 'react-router-dom';
import { CalendarHeart, TrendingUp, BarChart3, Droplets, Shield, ChevronRight, Heart } from 'lucide-react';

const features = [
  { icon: CalendarHeart, title: 'Period Tracking', desc: 'Log your cycle dates with an intuitive calendar interface.' },
  { icon: TrendingUp,    title: 'Cycle Prediction', desc: 'Smart estimates based on your personal cycle history.' },
  { icon: BarChart3,     title: 'Cycle Insights',   desc: 'Visualize patterns and trends in your cycle data.' },
  { icon: Droplets,      title: 'Hydration Tracker', desc: 'Track your daily water intake and stay hydrated.' },
  { icon: Shield,        title: 'Secure & Private',  desc: 'Your data stays yours. End-to-end secure storage.' },
];

const LandingPage = () => (
  <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
    {/* Header */}
    <header className="flex items-center justify-between px-6 md:px-12 py-5 max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        <img src="/women.png" alt="CycleCare Logo" className="w-10 h-10 object-contain" />
        <span className="text-xl font-bold text-primary-600 dark:text-primary-400">CycleCare</span>
      </div>
      <div className="flex items-center gap-3">
        <Link to="/login" className="btn-outline text-sm px-4 py-2">Log In</Link>
        <Link to="/register" className="btn-primary text-sm px-4 py-2">Get Started</Link>
      </div>
    </header>

    {/* Hero */}
    <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12">
      <div className="flex-1 max-w-2xl">
        <span className="badge-primary mb-4 inline-flex">🌸 Women's Wellness App</span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">
          Understand your cycle.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">
            Track your wellness.
          </span>
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          CycleCare helps you log your period, estimate your next cycle, monitor hydration, and understand your body — all in one secure, private app.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link to="/register" className="btn-primary px-8 py-3.5 text-base">
            Get Started Free <ChevronRight className="w-5 h-5" />
          </Link>
          <Link to="/login" className="btn-outline px-8 py-3.5 text-base">Log In</Link>
        </div>
        <p className="mt-6 text-xs text-gray-400 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5" /> Your cycle data is private and securely stored. We never share your information.
        </p>
      </div>
      <div className="flex-shrink-0">
        <div className="relative">
          <div className="w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 rounded-full flex items-center justify-center shadow-glow">
            <img src="/women.png" alt="CycleCare" className="w-44 h-44 md:w-56 md:h-56 object-contain drop-shadow-xl animate-pulse-soft" />
          </div>
          <div className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-2xl shadow-card p-3 flex items-center gap-2">
            <span className="text-2xl">🌸</span>
            <div>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">Next Period</p>
              <p className="text-xs text-primary-500">Est. in 12 days</p>
            </div>
          </div>
          <div className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 rounded-2xl shadow-card p-3 flex items-center gap-2">
            <span className="text-2xl">💧</span>
            <div>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">Hydration</p>
              <p className="text-xs text-accent-500">6 / 8 glasses</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="max-w-7xl mx-auto px-6 md:px-12 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Everything you need</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          A complete cycle and wellness tracker designed with your privacy and health in mind.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="card-hover group">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary-200 dark:group-hover:bg-primary-800/30 transition-colors">
              <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Disclaimer */}
    <section className="max-w-4xl mx-auto px-6 md:px-12 py-8">
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5">
        <p className="text-sm text-amber-700 dark:text-amber-400 font-medium mb-1">⚕️ Health Disclaimer</p>
        <p className="text-xs text-amber-600 dark:text-amber-500">
          CycleCare is a tracking and estimation tool only. All predictions are estimates based on data you provide and may not always be accurate.
          This application is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for medical concerns.
        </p>
      </div>
    </section>

    {/* Footer */}
    <footer className="border-t border-gray-100 dark:border-gray-800 py-8 text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        <img src="/women.png" alt="CycleCare" className="w-6 h-6 object-contain" />
        <span className="font-bold text-primary-600 dark:text-primary-400">CycleCare</span>
      </div>
      <p className="text-xs text-gray-400">Made with <Heart className="w-3 h-3 inline text-primary-400" /> for women's wellness. Not a medical device.</p>
    </footer>
  </div>
);

export default LandingPage;

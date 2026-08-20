import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarHeart, TrendingUp, Droplets, Clock, Activity, PlusCircle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { predictionApi } from '../api/predictionApi';
import { periodApi } from '../api/periodApi';
import { hydrationApi } from '../api/hydrationApi';
import { CycleChart, DurationChart } from '../components/charts/Charts';
import { PageLoader } from '../components/ui/LoadingSpinner';
import { Disclaimer } from '../components/ui/EmptyState';
import { formatDate, confidenceColor, getInitials } from '../utils/dateUtils';
import Button from '../components/ui/Button';
import AppLayout from '../components/layout/AppLayout';

const StatCard = ({ icon: Icon, label, value, sub, color = 'primary' }) => {
  const colors = {
    primary: 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400',
    secondary: 'bg-secondary-50 text-secondary-600 dark:bg-secondary-900/20 dark:text-secondary-400',
    accent: 'bg-accent-50 text-accent-600 dark:bg-accent-900/20 dark:text-accent-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
  }[color];

  return (
    <div className="card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${colors}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-muted text-xs">{label}</p>
        <p className="font-bold text-xl text-gray-900 dark:text-white">{value ?? '—'}</p>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [prediction, setPrediction] = useState(null);
  const [cycles, setCycles] = useState(null);
  const [hydration, setHydration] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [predRes, cycleRes, hydRes] = await Promise.allSettled([
        predictionApi.getPrediction(),
        predictionApi.getCycleStats(),
        hydrationApi.getTodayHydration(),
      ]);
      if (predRes.status === 'fulfilled') setPrediction(predRes.value?.data?.data?.prediction ?? null);
      if (cycleRes.status === 'fulfilled') setCycles(cycleRes.value?.data?.data ?? null);
      if (hydRes.status === 'fulfilled') setHydration(hydRes.value?.data?.data?.hydration || hydRes.value?.data?.data || null);
    } catch {
      // handled per-section
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <AppLayout><PageLoader text="Loading your dashboard..." /></AppLayout>;

  const p = prediction;
  const daysLabel = p?.daysRemaining != null
    ? p.daysRemaining > 0
      ? `${p.daysRemaining} day${p.daysRemaining !== 1 ? 's' : ''} away`
      : p.daysRemaining === 0
        ? 'Today (estimated)'
        : 'Estimated date has passed'
    : null;

  const hydPct = hydration ? Math.round((hydration.completedGlasses / hydration.dailyGoal) * 100) : 0;

  return (
    <AppLayout>
      <div className="flex flex-col gap-6 animate-slide-up">
        {/* Welcome */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-2xl object-cover border-2 border-primary-300 shadow-glow" />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-glow">
                {getInitials(user?.name)}
              </div>
            )}
            <div>
              <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0]}! 🌸</h1>
              <p className="text-muted">Here's your cycle overview for today.</p>
            </div>
          </div>
          <Button onClick={() => navigate('/tracker')} size="sm">
            <PlusCircle className="w-4 h-4" /> Log Period
          </Button>
        </div>

        {/* Prediction Card */}
        <div className="relative overflow-hidden card bg-gradient-to-br from-primary-500 to-secondary-600 text-white border-0 shadow-glow">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <p className="text-primary-100 text-sm font-medium mb-1">Estimated Next Period</p>
            {p?.hasData ? (
              <>
                <h2 className="text-3xl font-extrabold mb-1">{formatDate(p.estimatedDate, 'MMMM d, yyyy')}</h2>
                <p className="text-primary-200 text-base font-medium mb-4">
                  {p.daysRemaining > 0 ? `🗓 ${daysLabel}` : p.daysRemaining === 0 ? '🌸 Today (estimated)' : '⚠️ Estimated date has passed'}
                </p>
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20`}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {p.confidence?.label}
                </div>
              </>
            ) : (
              <div className="py-2">
                <p className="text-lg font-semibold text-primary-100 mb-2">No cycle data yet</p>
                <Button variant="outline" size="sm" onClick={() => navigate('/tracker')} className="border-white/50 text-white hover:bg-white/10 dark:border-white/50 dark:text-white">
                  Add Your First Period
                </Button>
              </div>
            )}
          </div>
          {p?.daysRemaining > 0 && (
            <div className="mt-4 bg-white/10 rounded-xl h-2 overflow-hidden">
              <div
                className="h-full bg-white/80 rounded-xl transition-all duration-700"
                style={{ width: `${Math.max(0, Math.min(100, 100 - (p.daysRemaining / (p.averageCycleLength || 28)) * 100))}%` }}
              />
            </div>
          )}
          <p className="text-primary-200 text-xs mt-3 italic">{p?.disclaimer || 'Estimates are not medical predictions.'}</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Activity} label="Avg Cycle Length" value={cycles?.averageCycleLength ? `${cycles.averageCycleLength}d` : '—'} sub="days" color="primary" />
          <StatCard icon={Clock} label="Avg Period Duration" value={cycles?.averagePeriodDuration ? `${cycles.averagePeriodDuration}d` : '—'} sub="days" color="secondary" />
          <StatCard icon={CalendarHeart} label="Total Records" value={cycles?.totalRecords ?? 0} sub="period entries" color="accent" />
          <StatCard icon={Droplets} label="Hydration Today" value={hydration ? `${hydration.completedGlasses}/${hydration.dailyGoal}` : '—'} sub={`${hydPct}% of goal`} color="amber" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="section-title">Cycle Length History</h3>
              <span className="badge-primary text-xs">Last 10 cycles</span>
            </div>
            <CycleChart data={cycles?.cycles} />
          </div>
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="section-title">Period Duration</h3>
              <span className="badge-secondary text-xs">Last 8 periods</span>
            </div>
            <DurationChart data={cycles?.cycles} />
          </div>
        </div>

        {/* Hydration progress */}
        {hydration && (
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="section-title flex items-center gap-2"><Droplets className="w-5 h-5 text-accent-500" /> Today's Hydration</h3>
              <Button variant="ghost" size="sm" onClick={() => navigate('/hydration')}>Manage</Button>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{hydration.completedGlasses} / {hydration.dailyGoal} glasses</span>
                  <span className="text-sm font-bold text-accent-600 dark:text-accent-400">{hydPct}%</span>
                </div>
                <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-accent-400 to-accent-500 rounded-full transition-all duration-700"
                    style={{ width: `${hydPct}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {hydPct >= 100 ? '🎉 Daily hydration goal complete!' : `${hydration.dailyGoal - hydration.completedGlasses} more glass${hydration.dailyGoal - hydration.completedGlasses !== 1 ? 'es' : ''} to reach your goal.`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Cycle Insights */}
        {p?.hasData && (
          <div className="card">
            <h3 className="section-title mb-3">💡 Cycle Insights</h3>
            <div className="flex flex-col gap-2">
              <p className="text-sm text-gray-600 dark:text-gray-300">{p.explanation}</p>
              {Array.isArray(p?.recentCycleLengths) && p.recentCycleLengths.length > 0 && (
                <div className="flex gap-2 flex-wrap mt-1">
                  <span className="text-xs text-gray-500">Recent cycles:</span>
                  {p.recentCycleLengths.map((c, i) => (
                    <span key={i} className="badge-primary">{c}d</span>
                  ))}
                </div>
              )}
            </div>
            <Disclaimer className="mt-4" />
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default DashboardPage;

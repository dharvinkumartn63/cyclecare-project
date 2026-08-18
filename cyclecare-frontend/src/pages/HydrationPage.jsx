import { useState, useEffect, useCallback } from 'react';
import { Droplets, RotateCcw, CheckCircle2, Trophy } from 'lucide-react';
import { hydrationApi } from '../api/hydrationApi';
import { PageLoader } from '../components/ui/LoadingSpinner';
import AppLayout from '../components/layout/AppLayout';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';
import { formatDate } from '../utils/dateUtils';

const WaterGlass = ({ filled, onClick, index }) => (
  <button
    onClick={() => onClick(index + 1)}
    className={`flex flex-col items-center gap-1.5 group transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 rounded-xl p-1`}
    aria-label={`Glass ${index + 1} ${filled ? '(filled)' : '(empty)'}`}
  >
    <div className={`w-10 h-14 sm:w-12 sm:h-16 rounded-b-2xl rounded-t-lg border-2 flex items-end overflow-hidden transition-all duration-300 ${
      filled
        ? 'border-accent-400 shadow-md shadow-accent-200 dark:shadow-accent-900/30'
        : 'border-gray-200 dark:border-gray-700 group-hover:border-accent-300'
    }`}>
      <div className={`w-full transition-all duration-500 ${filled ? 'h-full bg-gradient-to-t from-accent-500 to-accent-300' : 'h-0'}`} />
    </div>
    <span className={`text-[10px] font-semibold transition-colors ${filled ? 'text-accent-600 dark:text-accent-400' : 'text-gray-300 dark:text-gray-600'}`}>
      {index + 1}
    </span>
  </button>
);

const HydrationPage = () => {
  const [hydration, setHydration] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchHydration = useCallback(async () => {
    setLoading(true);
    try {
      const [hRes, histRes] = await Promise.all([
        hydrationApi.getTodayHydration(),
        hydrationApi.getHydrationHistory(),
      ]);
      setHydration(hRes.data.data.hydration);
      setHistory(histRes.data.data.history);
    } catch { toast.error('Failed to load hydration data.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchHydration(); }, [fetchHydration]);

  const setGlasses = async (count) => {
    if (updating) return;
    setUpdating(true);
    try {
      const newCount = count > hydration.completedGlasses ? count : hydration.completedGlasses - 1;
      const safeCount = Math.max(0, Math.min(newCount, hydration.dailyGoal));
      const res = await hydrationApi.updateHydration({ completedGlasses: safeCount });
      setHydration(res.data.data.hydration);
      if (safeCount === hydration.dailyGoal) toast.success('🎉 Daily hydration goal complete!');
    } catch { toast.error('Failed to update hydration.'); }
    finally { setUpdating(false); }
  };

  const handleGlassClick = async (glassIndex) => {
    if (updating || !hydration) return;
    setUpdating(true);
    // Toggle: if already filled, reduce to glassIndex-1; else set to glassIndex
    const newCount = hydration.completedGlasses >= glassIndex
      ? glassIndex - 1
      : glassIndex;
    try {
      const res = await hydrationApi.updateHydration({ completedGlasses: Math.max(0, newCount) });
      setHydration(res.data.data.hydration);
      if (newCount >= hydration.dailyGoal) toast.success('🎉 Daily hydration goal complete!');
    } catch { toast.error('Failed to update hydration.'); }
    finally { setUpdating(false); }
  };

  const handleReset = async () => {
    setUpdating(true);
    try {
      const res = await hydrationApi.resetHydration();
      setHydration(res.data.data.hydration);
      toast.success("Today's hydration reset.");
    } catch { toast.error('Failed to reset.'); }
    finally { setUpdating(false); }
  };

  const handleGoalChange = async (e) => {
    const goal = parseInt(e.target.value, 10);
    if (!goal || goal < 1 || goal > 20) return;
    try {
      const res = await hydrationApi.updateHydration({ dailyGoal: goal, completedGlasses: Math.min(hydration.completedGlasses, goal) });
      setHydration(res.data.data.hydration);
      toast.success('Daily goal updated.');
    } catch { toast.error('Failed to update goal.'); }
  };

  if (loading) return <AppLayout><PageLoader text="Loading hydration data..." /></AppLayout>;

  const pct = hydration ? Math.round((hydration.completedGlasses / hydration.dailyGoal) * 100) : 0;
  const isComplete = pct >= 100;

  return (
    <AppLayout>
      <div className="flex flex-col gap-6 animate-slide-up">
        <div>
          <h1 className="page-title flex items-center gap-2"><Droplets className="w-6 h-6 text-accent-500" /> Hydration Tracker</h1>
          <p className="text-muted">Track your daily water intake to stay healthy and energized.</p>
        </div>

        {/* Main tracker card */}
        <div className="card">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <p className="text-muted text-xs mb-1">Today's Progress</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-extrabold text-accent-600 dark:text-accent-400">{hydration?.completedGlasses}</span>
                <span className="text-xl text-gray-400">/ {hydration?.dailyGoal}</span>
                <span className="text-sm text-gray-400">glasses</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex flex-col gap-1.5">
                <label className="label text-xs">Daily Goal</label>
                <select value={hydration?.dailyGoal || 8} onChange={handleGoalChange}
                  className="input-field py-1.5 text-sm w-24">
                  {[4, 6, 8, 10, 12, 14, 16].map(n => <option key={n} value={n}>{n} glasses</option>)}
                </select>
              </div>
              <Button variant="ghost" size="sm" onClick={handleReset} className="mt-5">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${isComplete ? 'bg-gradient-to-r from-green-400 to-accent-500' : 'bg-gradient-to-r from-accent-300 to-accent-500'}`}
                style={{ width: `${Math.min(100, pct)}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-400">{pct}% completed</p>
              {isComplete && (
                <p className="text-xs text-green-600 dark:text-green-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Goal complete!
                </p>
              )}
            </div>
          </div>

          {/* Water glasses grid */}
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-4">
            {Array.from({ length: hydration?.dailyGoal || 8 }).map((_, i) => (
              <WaterGlass
                key={i}
                index={i}
                filled={i < (hydration?.completedGlasses || 0)}
                onClick={handleGlassClick}
              />
            ))}
          </div>

          {/* Motivation message */}
          <div className={`p-3 rounded-xl text-sm font-medium text-center ${isComplete ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-accent-50 dark:bg-accent-900/20 text-accent-700 dark:text-accent-400'}`}>
            {isComplete
              ? '🎉 Great job! Today\'s hydration goal is complete. Keep it up!'
              : `💧 You've completed ${hydration?.completedGlasses} of ${hydration?.dailyGoal} glasses today. ${(hydration?.dailyGoal || 8) - (hydration?.completedGlasses || 0)} more to go!`
            }
          </div>
        </div>

        {/* History */}
        {history.length > 1 && (
          <div className="card">
            <h3 className="section-title mb-4 flex items-center gap-2"><Trophy className="w-5 h-5 text-amber-500" /> Recent History</h3>
            <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
              {history.slice(0, 7).map((h) => {
                const hp = Math.round((h.completedGlasses / h.dailyGoal) * 100);
                return (
                  <div key={h._id} className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{formatDate(h.date + 'T00:00:00', 'EEEE, MMM d')}</p>
                      <p className="text-xs text-gray-400">{h.completedGlasses} / {h.dailyGoal} glasses</p>
                    </div>
                    <div className="flex items-center gap-3 flex-1 max-w-32">
                      <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${hp >= 100 ? 'bg-green-400' : 'bg-accent-400'}`} style={{ width: `${Math.min(100, hp)}%` }} />
                      </div>
                      <span className={`text-xs font-bold ${hp >= 100 ? 'text-green-500' : 'text-gray-400'}`}>{hp}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default HydrationPage;

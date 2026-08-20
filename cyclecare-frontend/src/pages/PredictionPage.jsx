import { useState, useEffect } from 'react';
import { TrendingUp, Calendar, BarChart3, Info, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { predictionApi } from '../api/predictionApi';
import { PageLoader } from '../components/ui/LoadingSpinner';
import { EmptyState, Disclaimer } from '../components/ui/EmptyState';
import AppLayout from '../components/layout/AppLayout';
import { formatDate, confidenceColor } from '../utils/dateUtils';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

const ConfidenceIcon = ({ level }) => {
  if (level === 'high') return <CheckCircle2 className="w-4 h-4 text-green-500" />;
  if (level === 'moderate' || level === 'low') return <AlertCircle className="w-4 h-4 text-amber-500" />;
  return <HelpCircle className="w-4 h-4 text-gray-400" />;
};

const PredictionPage = () => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    predictionApi.getPrediction()
      .then(res => setPrediction(res.data.data.prediction))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AppLayout><PageLoader text="Calculating your estimate..." /></AppLayout>;

  const p = prediction;

  return (
    <AppLayout>
      <div className="flex flex-col gap-6 animate-slide-up max-w-2xl">
        <div>
          <h1 className="page-title flex items-center gap-2"><TrendingUp className="w-6 h-6 text-primary-500" /> Cycle Prediction</h1>
          <p className="text-muted">Your estimated next period based on cycle history.</p>
        </div>

        {!p?.hasData ? (
          <EmptyState
            icon={Calendar}
            title="No cycle data available"
            description="Add at least one period record to receive your first cycle prediction."
            actionLabel="Add Period Record"
            onAction={() => navigate('/tracker')}
          />
        ) : (
          <>
            {/* Main prediction card */}
            <div className="relative overflow-hidden card bg-gradient-to-br from-primary-500 to-secondary-600 text-white border-0 shadow-glow">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/3" />
              <div className="relative z-10">
                <p className="text-primary-100 text-sm font-medium mb-1">Estimated Next Period</p>
                <h2 className="text-4xl font-extrabold mb-2">{formatDate(p.estimatedDate, 'MMMM d, yyyy')}</h2>
                <div className="flex items-center gap-2 mb-4">
                  {p.daysRemaining > 0 && (
                    <span className="bg-white/20 text-white text-sm font-semibold px-3 py-1 rounded-full">
                      🗓 {p.daysRemaining} day{p.daysRemaining !== 1 ? 's' : ''} from today
                    </span>
                  )}
                  {p.daysRemaining === 0 && <span className="bg-white/20 text-white text-sm font-semibold px-3 py-1 rounded-full">🌸 Today (estimated)</span>}
                  {p.daysRemaining < 0 && <span className="bg-white/20 text-white text-sm font-semibold px-3 py-1 rounded-full">⚠️ Estimated date passed</span>}
                </div>

                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/20`}>
                  <ConfidenceIcon level={p.confidence?.level} />
                  {p.confidence?.label}
                </div>
              </div>
            </div>

            {/* Explanation */}
            <div className="card">
              <div className="flex items-start gap-3 mb-3">
                <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="section-title mb-1">How this was calculated</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{p.explanation}</p>
                </div>
              </div>
              <div className="divider my-3" />
              <div className="flex items-start gap-3">
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${confidenceColor(p.confidence?.level)}`}>
                  <ConfidenceIcon level={p.confidence?.level} />
                  {p.confidence?.label}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{p.confidence?.explanation}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="card">
                <p className="text-muted text-xs mb-1">Average Cycle Length</p>
                <p className="text-3xl font-extrabold text-primary-600 dark:text-primary-400">{p.averageCycleLength}<span className="text-base font-normal text-gray-400 ml-1">days</span></p>
              </div>
              <div className="card">
                <p className="text-muted text-xs mb-1">Recent Cycle Lengths</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {Array.isArray(p?.recentCycleLengths) && p.recentCycleLengths.length > 0
                    ? p.recentCycleLengths.map((c, i) => <span key={i} className="badge-primary">{c}d</span>)
                    : <span className="text-sm text-gray-400">No data yet</span>
                  }
                </div>
              </div>
            </div>

            {/* Daysremaining is far → add more message */}
            {p.daysRemaining > 0 && p.confidence?.level !== 'high' && (
              <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  <span className="font-semibold">Tip:</span> Adding more cycle history improves the accuracy of your prediction.
                  <Button variant="ghost" size="sm" className="ml-2 text-amber-600 dark:text-amber-400 px-2 py-0.5" onClick={() => navigate('/tracker')}>Add Record →</Button>
                </p>
              </div>
            )}

            <div className="card bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800">
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-500 mb-1">⚕️ Important Disclaimer</p>
              <Disclaimer />
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default PredictionPage;

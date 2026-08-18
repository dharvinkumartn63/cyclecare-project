import { useState, useEffect } from 'react';
import { BarChart3, CalendarDays } from 'lucide-react';
import { predictionApi } from '../api/predictionApi';
import { CycleChart, DurationChart } from '../components/charts/Charts';
import { PageLoader } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';
import AppLayout from '../components/layout/AppLayout';
import { formatDate } from '../utils/dateUtils';
import { useNavigate } from 'react-router-dom';

const HistoryPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    predictionApi.getCycleStats()
      .then(res => setData(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AppLayout><PageLoader text="Loading cycle history..." /></AppLayout>;

  return (
    <AppLayout>
      <div className="flex flex-col gap-6 animate-slide-up">
        <div>
          <h1 className="page-title flex items-center gap-2"><BarChart3 className="w-6 h-6 text-secondary-500" /> Cycle History</h1>
          <p className="text-muted">Your full period and cycle history with visualizations.</p>
        </div>

        {!data || data.totalRecords === 0 ? (
          <EmptyState icon={CalendarDays} title="No cycle history yet." description="Add your period records to see your cycle history here." actionLabel="Add Period" onAction={() => navigate('/tracker')} />
        ) : (
          <>
            {/* Summary stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="card text-center">
                <p className="text-3xl font-extrabold text-primary-600 dark:text-primary-400">{data.totalRecords}</p>
                <p className="text-muted text-xs mt-1">Total Records</p>
              </div>
              <div className="card text-center">
                <p className="text-3xl font-extrabold text-secondary-600 dark:text-secondary-400">{data.averageCycleLength ?? '—'}<span className="text-sm font-normal">d</span></p>
                <p className="text-muted text-xs mt-1">Avg Cycle Length</p>
              </div>
              <div className="card text-center">
                <p className="text-3xl font-extrabold text-accent-600 dark:text-accent-400">{data.averagePeriodDuration ?? '—'}<span className="text-sm font-normal">d</span></p>
                <p className="text-muted text-xs mt-1">Avg Duration</p>
              </div>
            </div>

            {/* Charts */}
            <div className="card">
              <h3 className="section-title mb-4">Cycle Length Over Time</h3>
              <CycleChart data={data.cycles} />
            </div>
            <div className="card">
              <h3 className="section-title mb-4">Period Duration History</h3>
              <DurationChart data={data.cycles} />
            </div>

            {/* History table */}
            <div className="card overflow-hidden p-0">
              <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                <h3 className="section-title">All Cycles</h3>
              </div>
              {/* Desktop */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      {['#', 'Start Date', 'End Date', 'Duration', 'Cycle Length'].map(h => (
                        <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {[...data.cycles].reverse().map((c) => (
                      <tr key={c.index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="px-5 py-3 font-bold text-gray-400">#{c.index}</td>
                        <td className="px-5 py-3 font-medium text-gray-800 dark:text-gray-100">{formatDate(c.startDate)}</td>
                        <td className="px-5 py-3 text-gray-500 dark:text-gray-400">{c.endDate ? formatDate(c.endDate) : '—'}</td>
                        <td className="px-5 py-3">{c.duration ? <span className="badge-primary">{c.duration}d</span> : '—'}</td>
                        <td className="px-5 py-3">{c.cycleLength ? <span className="badge-secondary">{c.cycleLength}d</span> : <span className="text-xs text-gray-400">First record</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Mobile cards */}
              <div className="md:hidden flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
                {[...data.cycles].reverse().map((c) => (
                  <div key={c.index} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">{formatDate(c.startDate)}</p>
                      <p className="text-xs text-gray-400">{c.endDate ? `to ${formatDate(c.endDate)}` : 'No end date'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {c.duration && <span className="badge-primary">{c.duration}d</span>}
                      {c.cycleLength && <span className="badge-secondary">{c.cycleLength}d cycle</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default HistoryPage;

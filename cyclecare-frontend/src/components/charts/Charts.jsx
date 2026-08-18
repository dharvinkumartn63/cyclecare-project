import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, Area, AreaChart
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-3 shadow-lg text-sm">
        <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="font-medium">
            {p.name}: <span className="font-bold">{p.value} days</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const CycleChart = ({ data }) => {
  if (!data || data.length < 2) return (
    <div className="flex items-center justify-center h-48 text-muted text-sm">
      Add at least 2 period records to see your cycle chart.
    </div>
  );

  const chartData = data
    .filter((c) => c.cycleLength)
    .map((c) => ({ name: `Cycle ${c.index}`, 'Cycle Length': c.cycleLength, month: c.month }));

  const avg = Math.round(chartData.reduce((a, b) => a + b['Cycle Length'], 0) / chartData.length);

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="cycleGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#e8286a" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#e8286a" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.08} />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'currentColor' }} />
          <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11, fill: 'currentColor' }} unit="d" />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={avg} stroke="#8b5cf6" strokeDasharray="4 4" label={{ value: `Avg ${avg}d`, position: 'right', fontSize: 11, fill: '#8b5cf6' }} />
          <Area type="monotone" dataKey="Cycle Length" stroke="#e8286a" strokeWidth={2.5} fill="url(#cycleGrad)" dot={{ r: 4, fill: '#e8286a', strokeWidth: 0 }} activeDot={{ r: 6 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const DurationChart = ({ data }) => {
  if (!data || data.length === 0) return (
    <div className="flex items-center justify-center h-48 text-muted text-sm">
      Add period records with end dates to see duration history.
    </div>
  );

  const chartData = data
    .filter((c) => c.duration)
    .slice(-8)
    .map((c) => ({ name: c.month, 'Duration': c.duration }));

  if (chartData.length === 0) return (
    <div className="flex items-center justify-center h-48 text-muted text-sm">
      Add end dates to your period records to see duration history.
    </div>
  );

  return (
    <div className="w-full h-56">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.9} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.5} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.08} />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'currentColor' }} />
          <YAxis tick={{ fontSize: 11, fill: 'currentColor' }} unit="d" />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="Duration" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

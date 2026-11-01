import { useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { TrendingUp, PiggyBank, Target, Percent } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useApp } from '../context/AppContext';
import { formatINR } from '../utils/currency';
import TransactionItem from '../components/TransactionItem';
import EditModal from '../components/EditModal';

const COLORS = [
  '#a78bfa', '#818cf8', '#60a5fa', '#34d399', '#facc15',
  '#fb923c', '#f472b6', '#38bdf8', '#4ade80', '#e879f9',
];

// ── helpers ──────────────────────────────────────────────────────────────────
function buildCategoryBreakdown(investments) {
  const map = {};
  investments.forEach((t) => {
    map[t.category] = (map[t.category] ?? 0) + t.amount;
  });
  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

function buildMonthlyTrend(investments) {
  const map = {};
  investments.forEach((t) => {
    const month = format(parseISO(t.date), 'MMM yy');
    map[month] = (map[month] ?? 0) + t.amount;
  });
  return Object.entries(map).map(([month, total]) => ({ month, total })).slice(-12);
}

// ── tooltip ───────────────────────────────────────────────────────────────────
const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-gray-200 mb-0.5">{payload[0].name}</p>
      <p style={{ color: payload[0].payload.fill ?? payload[0].color }}>
        {formatINR(payload[0].value)}
      </p>
    </div>
  );
};

const AreaTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-xs shadow-lg">
      <p className="text-gray-400 mb-1">{label}</p>
      <p className="text-violet-400 font-semibold">{formatINR(payload[0].value)}</p>
    </div>
  );
};

// ── stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, sub }) {
  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5 flex items-center gap-4">
      <div className="rounded-xl p-3 bg-violet-500/10 border border-violet-500/20 text-violet-400 shrink-0">
        <Icon size={22} />
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-violet-400 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ── main page ─────────────────────────────────────────────────────────────────
export default function Investments() {
  const { transactions, totalIncome, totalInvestments } = useApp();
  const [editing, setEditing] = useState(null);

  const investments = transactions.filter((t) => t.type === 'investment');
  const categoryData = buildCategoryBreakdown(investments);
  const monthlyData  = buildMonthlyTrend(investments);

  const investmentRate = totalIncome > 0
    ? ((totalInvestments / totalIncome) * 100).toFixed(1)
    : '0.0';

  const avgMonthly = monthlyData.length > 0
    ? monthlyData.reduce((s, d) => s + d.total, 0) / monthlyData.length
    : 0;

  const topCategory = categoryData[0]?.name ?? '—';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Investments</h1>
        <p className="text-sm text-gray-500">Track your portfolio contributions</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          label="Total Invested"
          value={formatINR(totalInvestments)}
          icon={PiggyBank}
        />
        <StatCard
          label="Investment Rate"
          value={`${investmentRate}%`}
          icon={Percent}
          sub="of total income"
        />
        <StatCard
          label="Avg. Monthly"
          value={formatINR(avgMonthly)}
          icon={TrendingUp}
          sub={`over ${monthlyData.length} month${monthlyData.length !== 1 ? 's' : ''}`}
        />
        <StatCard
          label="Top Category"
          value={topCategory}
          icon={Target}
          sub={categoryData[0] ? formatINR(categoryData[0].value) : ''}
        />
      </div>

      {/* Monthly contribution trend */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
        <h2 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wide">
          Monthly Contributions
        </h2>
        {monthlyData.length === 0 ? (
          <p className="text-gray-600 text-sm text-center py-8">No investment data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gInvest" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#a78bfa" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip content={<AreaTooltip />} />
              <Area type="monotone" dataKey="total" stroke="#a78bfa" fill="url(#gInvest)" strokeWidth={2} name="Invested" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Portfolio breakdown */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
        <h2 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wide">
          Portfolio Breakdown
        </h2>
        {categoryData.length === 0 ? (
          <p className="text-gray-600 text-sm text-center py-8">No investment data yet</p>
        ) : (
          <div className="flex flex-col sm:flex-row gap-6 items-center">
            {/* Donut */}
            <div className="w-full sm:w-64 shrink-0">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%" cy="50%"
                    innerRadius={60} outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend list */}
            <div className="flex-1 w-full space-y-2">
              {categoryData.map((item, i) => {
                const pct = totalInvestments > 0
                  ? ((item.value / totalInvestments) * 100).toFixed(1)
                  : 0;
                return (
                  <div key={item.name} className="flex items-center gap-3">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ background: COLORS[i % COLORS.length] }}
                    />
                    <span className="text-sm text-gray-300 flex-1 truncate">{item.name}</span>
                    <span className="text-xs text-gray-500">{pct}%</span>
                    <span className="text-sm font-semibold text-violet-400 w-28 text-right">
                      {formatINR(item.value)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Investment transactions */}
      <div>
        <h2 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">
          All Investments ({investments.length})
        </h2>
        {investments.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            <p className="text-4xl mb-3">📈</p>
            <p className="font-medium">No investments recorded yet</p>
            <p className="text-sm mt-1">Use the Add tab to record a contribution</p>
          </div>
        ) : (
          <div className="space-y-2">
            {investments.map((t) => (
              <TransactionItem key={t.id} transaction={t} onEdit={setEditing} />
            ))}
          </div>
        )}
      </div>

      {editing && <EditModal transaction={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

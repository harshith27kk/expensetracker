import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { formatINR } from '../utils/currency';
import { format, parseISO } from 'date-fns';

const COLORS = [
  '#34d399', '#60a5fa', '#f87171', '#facc15', '#a78bfa',
  '#fb923c', '#38bdf8', '#e879f9', '#4ade80', '#f472b6',
];

function buildCategoryData(transactions, type) {
  const map = {};
  transactions
    .filter((t) => t.type === type)
    .forEach((t) => {
      map[t.category] = (map[t.category] ?? 0) + t.amount;
    });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

function buildMonthlyData(transactions) {
  const map = {};
  transactions.forEach((t) => {
    const month = format(parseISO(t.date), 'MMM yy');
    if (!map[month]) map[month] = { month, income: 0, expense: 0, investment: 0 };
    if (t.type === 'income')     map[month].income     += t.amount;
    if (t.type === 'expense')    map[month].expense    += t.amount;
    if (t.type === 'investment') map[month].investment += t.amount;
  });
  return Object.values(map).slice(-6);
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-gray-200">{payload[0].name}</p>
      <p style={{ color: payload[0].payload.fill ?? payload[0].color }}>
        {formatINR(payload[0].value)}
      </p>
    </div>
  );
};

export default function Charts() {
  const { transactions, totalIncome, totalExpenses, totalInvestments } = useApp();

  const incomeData     = buildCategoryData(transactions, 'income');
  const expenseData    = buildCategoryData(transactions, 'expense');
  const investData     = buildCategoryData(transactions, 'investment');
  const monthlyData    = buildMonthlyData(transactions);

  // Savings = what's left after expenses AND investments
  const netSavings     = totalIncome - totalExpenses - totalInvestments;
  const savingsRate    = totalIncome > 0
    ? ((netSavings / totalIncome) * 100).toFixed(1)
    : '0.0';
  const investRate     = totalIncome > 0
    ? ((totalInvestments / totalIncome) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Charts</h1>

      {/* Summary banner */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Income</p>
            <p className="text-lg font-bold text-emerald-400">{formatINR(totalIncome)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Expenses</p>
            <p className="text-lg font-bold text-red-400">{formatINR(totalExpenses)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Invested</p>
            <p className="text-lg font-bold text-violet-400">{formatINR(totalInvestments)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Savings Rate</p>
            <p className={`text-lg font-bold ${Number(savingsRate) >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
              {savingsRate}%
            </p>
          </div>
        </div>

        {/* Income allocation bar */}
        {totalIncome > 0 && (
          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-2">Income Allocation</p>
            <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
              <div
                className="bg-red-500 transition-all"
                style={{ width: `${Math.min((totalExpenses / totalIncome) * 100, 100)}%` }}
                title="Expenses"
              />
              <div
                className="bg-violet-500 transition-all"
                style={{ width: `${Math.min((totalInvestments / totalIncome) * 100, 100)}%` }}
                title="Investments"
              />
              <div
                className="bg-blue-500 flex-1 transition-all"
                title="Savings"
              />
            </div>
            <div className="flex gap-4 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block"/>Expenses</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-violet-500 inline-block"/>Invested ({investRate}%)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block"/>Savings ({savingsRate}%)</span>
            </div>
          </div>
        )}
      </div>

      {/* Monthly bar chart */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
        <h2 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wide">Monthly Overview</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 12 }}
              labelStyle={{ color: '#9ca3af', fontSize: 11 }}
              itemStyle={{ fontSize: 12 }}
            />
            <Bar dataKey="income"     fill="#34d399" radius={[4, 4, 0, 0]} name="Income" />
            <Bar dataKey="expense"    fill="#f87171" radius={[4, 4, 0, 0]} name="Expenses" />
            <Bar dataKey="investment" fill="#a78bfa" radius={[4, 4, 0, 0]} name="Investments" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie charts — 3 columns on wide, stacked on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Income */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
          <h2 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wide">Income</h2>
          {incomeData.length === 0 ? (
            <p className="text-gray-600 text-sm text-center py-8">No data</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={incomeData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {incomeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 10, color: '#9ca3af' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Expenses */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
          <h2 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wide">Expenses</h2>
          {expenseData.length === 0 ? (
            <p className="text-gray-600 text-sm text-center py-8">No data</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={expenseData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {expenseData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 10, color: '#9ca3af' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Investments */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
          <h2 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wide">Investments</h2>
          {investData.length === 0 ? (
            <p className="text-gray-600 text-sm text-center py-8">No data</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={investData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {investData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 10, color: '#9ca3af' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

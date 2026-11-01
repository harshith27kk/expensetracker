import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { useApp } from '../context/AppContext';
import { formatINR } from '../utils/currency';
import SummaryCard from '../components/SummaryCard';
import TransactionItem from '../components/TransactionItem';
import { useState } from 'react';
import EditModal from '../components/EditModal';

function buildChartData(transactions) {
  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(now);
  const days = eachDayOfInterval({ start, end });

  return days.map((day) => {
    const dayTxns = transactions.filter((t) => isSameDay(parseISO(t.date), day));
    const income  = dayTxns.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = dayTxns.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { day: format(day, 'd'), income, expense };
  });
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-xs shadow-lg">
      <p className="text-gray-400 mb-1">Day {label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-semibold">
          {p.name.charAt(0).toUpperCase() + p.name.slice(1)}: {formatINR(p.value)}
        </p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const { transactions, totalIncome, totalExpenses, totalInvestments, balance } = useApp();
  const [editing, setEditing] = useState(null);

  const chartData = buildChartData(transactions);
  const recent = transactions.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Overview</h1>
        <p className="text-sm text-gray-500">{format(new Date(), 'MMMM yyyy')}</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SummaryCard label="Balance"      amount={balance}           icon={Wallet}      color="blue" />
        <SummaryCard label="Income"       amount={totalIncome}       icon={TrendingUp}  color="emerald" />
        <SummaryCard label="Expenses"     amount={totalExpenses}     icon={TrendingDown} color="red" />
        <SummaryCard label="Invested"     amount={totalInvestments}  icon={PiggyBank}   color="violet" />
      </div>

      {/* Area chart */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
        <h2 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wide">
          Monthly Cash Flow
        </h2>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#34d399" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#f87171" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="income"  stroke="#34d399" fill="url(#gIncome)"  strokeWidth={2} />
            <Area type="monotone" dataKey="expense" stroke="#f87171" fill="url(#gExpense)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Recent transactions */}
      <div>
        <h2 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">
          Recent Transactions
        </h2>
        <div className="space-y-2">
          {recent.length === 0 ? (
            <p className="text-gray-500 text-sm">No transactions yet.</p>
          ) : (
            recent.map((t) => (
              <TransactionItem key={t.id} transaction={t} onEdit={setEditing} />
            ))
          )}
        </div>
      </div>

      {editing && <EditModal transaction={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

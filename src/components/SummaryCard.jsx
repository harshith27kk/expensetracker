import { formatINR } from '../utils/currency';

export default function SummaryCard({ label, amount, icon: Icon, color }) {
  const colorMap = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    red:     'bg-red-500/10     text-red-400     border-red-500/20',
    blue:    'bg-blue-500/10    text-blue-400    border-blue-500/20',
    violet:  'bg-violet-500/10  text-violet-400  border-violet-500/20',
  };

  const textMap = {
    emerald: 'text-emerald-400',
    red:     'text-red-400',
    blue:    'text-blue-400',
    violet:  'text-violet-400',
  };

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5 flex items-center gap-4">
      <div className={`rounded-xl p-3 border ${colorMap[color]}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
        <p className={`text-2xl font-bold mt-0.5 ${textMap[color]}`}>
          {formatINR(amount)}
        </p>
      </div>
    </div>
  );
}

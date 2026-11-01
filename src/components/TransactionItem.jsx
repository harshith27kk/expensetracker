import { useApp } from '../context/AppContext';
import { Trash2, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import { formatINR } from '../utils/currency';

const CATEGORY_ICONS = {
  // income
  Salary:             '💼',
  Freelance:          '💻',
  Gift:               '🎁',
  Bonus:              '🎉',
  // expense
  Rent:               '🏠',
  Groceries:          '🛒',
  Utilities:          '💡',
  Transport:          '🚗',
  Entertainment:      '🎬',
  Healthcare:         '🏥',
  Education:          '📚',
  Dining:             '🍽️',
  Shopping:           '🛍️',
  Fitness:            '💪🏼',
  // investment
  Stocks:             '📈',
  'SIP / Mutual Fund':'🔄',
  PPF:                '🏛️',
  'Fixed Deposit':    '🏦',
  Gold:               '🪙',
  'Real Estate':      '🏘️',
  Crypto:             '₿',
  NPS:                '🛡️',
  Savings:            '💰',
  Other:              '📋',
};

const TYPE_STYLE = {
  income:     { bg: 'bg-emerald-500/10', amount: 'text-emerald-400', sign: '+' },
  expense:    { bg: 'bg-red-500/10',     amount: 'text-red-400',     sign: '-' },
  investment: { bg: 'bg-violet-500/10',  amount: 'text-violet-400',  sign: '↗' },
};

export default function TransactionItem({ transaction, onEdit }) {
  const { deleteTransaction } = useApp();
  const { id, type, category, amount, description, date } = transaction;

  const style = TYPE_STYLE[type] ?? TYPE_STYLE.expense;

  return (
    <div className="flex items-center gap-3 bg-gray-900 rounded-xl border border-gray-800 px-4 py-3 group hover:border-gray-700 transition-colors">
      {/* Icon */}
      <div className={`text-2xl w-10 h-10 flex items-center justify-center rounded-xl shrink-0 ${style.bg}`}>
        {CATEGORY_ICONS[category] ?? '📋'}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-gray-100 truncate">{description}</p>
        <p className="text-xs text-gray-500 mt-0.5">
          {category} · {format(new Date(date), 'MMM d, yyyy')}
        </p>
      </div>

      {/* Amount */}
      <span className={`font-bold text-sm shrink-0 ${style.amount}`}>
        {style.sign}{formatINR(amount)}
      </span>

      {/* Actions */}
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(transaction)}
          className="p-1.5 rounded-lg text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
          aria-label="Edit transaction"
        >
          <Pencil size={15} />
        </button>
        <button
          onClick={() => deleteTransaction(id)}
          className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          aria-label="Delete transaction"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

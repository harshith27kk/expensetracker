import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useApp } from '../context/AppContext';
import TransactionItem from '../components/TransactionItem';
import EditModal from '../components/EditModal';

const ALL_CATEGORIES = [
  'All',
  'Salary', 'Freelance', 'Investment', 'Gift',
  'Rent', 'Groceries', 'Utilities', 'Transport', 'Entertainment',
  'Healthcare', 'Education', 'Dining', 'Shopping', 'Savings', 'Fitness', 'Other',
];

export default function Transactions() {
  const { filteredTransactions, filter, setFilter } = useApp();
  const [editing, setEditing] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Transactions</h1>
        <button
          onClick={() => setShowFilters((v) => !v)}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition-colors ${
            showFilters
              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
              : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
          }`}
        >
          <SlidersHorizontal size={14} /> Filters
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Search transactions…"
          value={filter.search}
          onChange={(e) => setFilter({ search: e.target.value })}
          className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-colors"
        />
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4 space-y-3">
          {/* Type */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Type</p>
            <div className="flex gap-2 flex-wrap">
              {['all', 'income', 'expense'].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter({ type: t })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    filter.type === t
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                      : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Category</p>
            <select
              value={filter.category === 'all' ? 'All' : filter.category}
              onChange={(e) =>
                setFilter({ category: e.target.value === 'All' ? 'all' : e.target.value })
              }
              className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            >
              {ALL_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
      )}

      {/* Count */}
      <p className="text-xs text-gray-500">
        {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
      </p>

      {/* List */}
      <div className="space-y-2">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-medium">No transactions found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          filteredTransactions.map((t) => (
            <TransactionItem key={t.id} transaction={t} onEdit={setEditing} />
          ))
        )}
      </div>

      {editing && <EditModal transaction={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

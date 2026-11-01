import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatInputINR, stripCommas } from '../utils/currency';

const INCOME_CATEGORIES     = ['Salary', 'Freelance', 'Gift', 'Bonus', 'Other'];
const EXPENSE_CATEGORIES    = ['Rent', 'Groceries', 'Utilities', 'Transport', 'Entertainment', 'Healthcare', 'Education', 'Dining', 'Shopping', 'Fitness', 'Credit Card Bill', 'Other'];
const INVESTMENT_CATEGORIES = ['Stocks', 'SIP / Mutual Fund', 'PPF', 'Fixed Deposit', 'Gold', 'Real Estate', 'Crypto', 'NPS', 'Savings', 'Other'];

const TYPE_CONFIG = {
  income:     { label: 'Income',     default: 'Salary',            active: 'bg-emerald-500/20 border-emerald-500 text-emerald-400' },
  expense:    { label: 'Expense',    default: 'Groceries',         active: 'bg-red-500/20     border-red-500     text-red-400'     },
  investment: { label: 'Investment', default: 'SIP / Mutual Fund', active: 'bg-violet-500/20  border-violet-500  text-violet-400'  },
};

function categoriesFor(type) {
  if (type === 'income')     return INCOME_CATEGORIES;
  if (type === 'investment') return INVESTMENT_CATEGORIES;
  return EXPENSE_CATEGORIES;
}

const today = new Date().toISOString().split('T')[0];

export default function EditModal({ transaction, onClose }) {
  const { editTransaction } = useApp();
  const [form, setForm] = useState({ ...transaction });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm({
      ...transaction,
      // Pre-format the stored plain number for display
      amount: formatInputINR(String(transaction.amount)),
    });
  }, [transaction]);

  function validate() {
    const errs = {};
    if (!form.description.trim()) errs.description = 'Required.';
    const rawAmount = stripCommas(form.amount);
    if (!rawAmount || isNaN(rawAmount) || Number(rawAmount) <= 0)
      errs.amount = 'Enter a valid amount.';
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    editTransaction({ ...form, amount: parseFloat(stripCommas(form.amount)) });
    onClose();
  }

  const field = 'bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-100 w-full focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-gray-900 rounded-t-3xl sm:rounded-2xl border border-gray-800 w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white">Edit Transaction</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type */}
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(TYPE_CONFIG).map(([t, cfg]) => (
              <button
                key={t}
                type="button"
                onClick={() => setForm((f) => ({ ...f, type: t, category: cfg.default }))}
                className={`py-2 rounded-xl text-xs font-semibold border transition-colors ${
                  form.type === t ? cfg.active : 'bg-gray-800 border-gray-700 text-gray-400'
                }`}
              >
                {cfg.label}
              </button>
            ))}
          </div>

          {/* Category */}
          <select
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className={field}
          >
            {categoriesFor(form.type).map((c) => <option key={c}>{c}</option>)}
          </select>

          {/* Amount */}
          <div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">₹</span>
              <input
                type="text"
                inputMode="decimal"
                placeholder="0"
                value={form.amount}
                onChange={(e) => {
                  const formatted = formatInputINR(e.target.value);
                  setForm((f) => ({ ...f, amount: formatted }));
                }}
                className={field + ' pl-8'}
              />
            </div>
            {errors.amount && <p className="text-red-400 text-xs mt-1">{errors.amount}</p>}
          </div>

          {/* Description */}
          <div>
            <input
              type="text" placeholder="Description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className={field}
            />
            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
          </div>

          {/* Date */}
          <input
            type="date" value={form.date} max={today}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            className={field}
          />

          <div className="flex gap-3 pt-1">
            <button
              type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-sm transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

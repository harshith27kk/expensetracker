import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatInputINR, stripCommas } from '../utils/currency';

const INCOME_CATEGORIES     = ['Salary', 'Freelance', 'Gift', 'Bonus', 'Other'];
const EXPENSE_CATEGORIES    = ['Rent', 'Groceries', 'Utilities', 'Transport', 'Entertainment', 'Healthcare', 'Education', 'Dining', 'Shopping', 'Fitness', 'Other'];
const INVESTMENT_CATEGORIES = ['Stocks', 'SIP / Mutual Fund', 'PPF', 'Fixed Deposit', 'Gold', 'Real Estate', 'Crypto', 'NPS', 'Savings', 'Other'];

const TYPE_CONFIG = {
  income:     { label: 'Income',     default: 'Salary',          active: 'bg-emerald-500/20 border-emerald-500 text-emerald-400' },
  expense:    { label: 'Expense',    default: 'Groceries',       active: 'bg-red-500/20     border-red-500     text-red-400'     },
  investment: { label: 'Investment', default: 'SIP / Mutual Fund', active: 'bg-violet-500/20  border-violet-500  text-violet-400'  },
};

const today = new Date().toISOString().split('T')[0];

function categoriesFor(type) {
  if (type === 'income')     return INCOME_CATEGORIES;
  if (type === 'investment') return INVESTMENT_CATEGORIES;
  return EXPENSE_CATEGORIES;
}

export default function AddTransaction() {
  const { addTransaction } = useApp();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    type: 'expense',
    category: 'Groceries',
    amount: '',
    description: '',
    date: today,
  });
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  function handleTypeChange(type) {
    setForm((f) => ({ ...f, type, category: TYPE_CONFIG[type].default }));
  }

  function validate() {
    const errs = {};
    if (!form.description.trim()) errs.description = 'Description is required.';
    const rawAmount = stripCommas(form.amount);
    if (!rawAmount || isNaN(rawAmount) || Number(rawAmount) <= 0)
      errs.amount = 'Enter a valid positive amount.';
    if (!form.date) errs.date = 'Date is required.';
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    addTransaction({
      type: form.type,
      category: form.category,
      amount: parseFloat(stripCommas(form.amount)),
      description: form.description.trim(),
      date: form.date,
    });

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      navigate(form.type === 'investment' ? '/investments' : '/transactions');
    }, 1200);
  }

  const field = 'bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-100 w-full focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors placeholder-gray-600';

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Add Transaction</h1>

      {success && (
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl px-4 py-3 mb-4 text-sm font-medium">
          <CheckCircle size={16} /> Transaction added successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-gray-900 rounded-2xl border border-gray-800 p-6 space-y-5">
        {/* Type toggle */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Type</label>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(TYPE_CONFIG).map(([t, cfg]) => (
              <button
                key={t}
                type="button"
                onClick={() => handleTypeChange(t)}
                className={`py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                  form.type === t ? cfg.active : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                }`}
              >
                {cfg.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className={field}
          >
            {categoriesFor(form.type).map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Amount (₹)</label>
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
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Description</label>
          <input
            type="text"
            placeholder="What was this for?"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className={field}
          />
          {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Date</label>
          <input
            type="date"
            value={form.date}
            max={today}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            className={field}
          />
          {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date}</p>}
        </div>

        <button
          type="submit"
          className={`w-full py-3 rounded-xl font-bold text-sm transition-colors text-gray-950 ${
            form.type === 'investment'
              ? 'bg-violet-500 hover:bg-violet-400'
              : 'bg-emerald-500 hover:bg-emerald-400'
          }`}
        >
          Add {TYPE_CONFIG[form.type].label}
        </button>
      </form>
    </div>
  );
}

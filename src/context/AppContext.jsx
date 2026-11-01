import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import {
  subscribeToTransactions,
  addTransactionFS,
  updateTransactionFS,
  deleteTransactionFS,
} from '../firebase/transactions';

// ─── reducer (local UI state for filters only) ──────────────────────────────
function filterReducer(state, action) {
  switch (action.type) {
    case 'SET_FILTER':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

// ─── context ────────────────────────────────────────────────────────────────
const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Transactions come live from Firestore
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state is local only (no need to persist)
  const [filter, dispatch] = useReducer(filterReducer, {
    type: 'all',
    category: 'all',
    search: '',
  });

  // Subscribe to Firestore on mount, unsubscribe on unmount
  useEffect(() => {
    const unsubscribe = subscribeToTransactions((data) => {
      setTransactions(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // ── derived values ──────────────────────────────────────────────────────
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalInvestments = transactions
    .filter((t) => t.type === 'investment')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses - totalInvestments;

  // ── filtered transactions ───────────────────────────────────────────────
  const filteredTransactions = transactions.filter((t) => {
    if (filter.type !== 'all' && t.type !== filter.type) return false;
    if (filter.category !== 'all' && t.category !== filter.category) return false;
    if (
      filter.search &&
      !t.description?.toLowerCase().includes(filter.search.toLowerCase()) &&
      !t.category?.toLowerCase().includes(filter.search.toLowerCase())
    )
      return false;
    return true;
  });

  // ── actions (write to Firestore, UI updates via real-time listener) ─────
  async function addTransaction(data) {
    await addTransactionFS(data);
  }

  async function deleteTransaction(id) {
    await deleteTransactionFS(id);
  }

  async function editTransaction(data) {
    await updateTransactionFS(data);
  }

  function setFilter(payload) {
    dispatch({ type: 'SET_FILTER', payload });
  }

  return (
    <AppContext.Provider
      value={{
        transactions,
        filteredTransactions,
        filter,
        loading,
        totalIncome,
        totalExpenses,
        totalInvestments,
        balance,
        addTransaction,
        deleteTransaction,
        editTransaction,
        setFilter,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}

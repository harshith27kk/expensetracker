import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { useApp } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import AddTransaction from './pages/AddTransaction';
import Investments from './pages/Investments';
import Charts from './pages/Charts';
import { Wallet } from 'lucide-react';

function AppRoutes() {
  const { loading } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4">
        <Wallet className="text-emerald-400 animate-pulse" size={48} />
        <p className="text-gray-400 text-sm font-medium">Loading your data…</p>
      </div>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/"             element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/add"          element={<AddTransaction />} />
        <Route path="/investments"  element={<Investments />} />
        <Route path="/charts"       element={<Charts />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}

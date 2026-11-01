import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ListOrdered,
  PlusCircle,
  BarChart2,
  TrendingUp,
  Wallet,
} from 'lucide-react';

const navItems = [
  { to: '/',             label: 'Dashboard',   Icon: LayoutDashboard },
  { to: '/transactions', label: 'Transactions', Icon: ListOrdered },
  { to: '/add',          label: 'Add',          Icon: PlusCircle },
  { to: '/investments',  label: 'Invest',       Icon: TrendingUp },
  { to: '/charts',       label: 'Charts',       Icon: BarChart2 },
];

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      {/* Top nav */}
      <header className="sticky top-0 z-20 bg-gray-900 border-b border-gray-800 shadow-md">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center gap-3">
          <Wallet className="text-emerald-400" size={28} />
          <span className="text-xl font-bold tracking-tight text-white">
            Expense<span className="text-emerald-400">Tracker</span>
          </span>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
        {children}
      </main>

      {/* Bottom tab bar */}
      <nav className="sticky bottom-0 z-20 bg-gray-900 border-t border-gray-800">
        <div className="max-w-5xl mx-auto flex justify-around">
          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-3 px-2 text-xs font-medium transition-colors ${
                  isActive ? 'text-emerald-400' : 'text-gray-500 hover:text-gray-300'
                }`
              }
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}

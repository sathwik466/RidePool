import { Link, NavLink, Outlet } from 'react-router-dom';
import {
  Car,
  LayoutDashboard,
  Leaf,
  LogOut,
  Search,
  Shield,
  Trophy,
  User,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100'
  }`;

export default function Layout() {
  const { user, logout, role } = useAuth();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/dashboard" className="flex items-center gap-2 font-bold text-brand-700">
            <Car className="h-6 w-6" />
            RidePool
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            <NavLink to="/dashboard" className={navLinkClass}>
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </NavLink>
            {role === 'COMMUTER' && (
              <NavLink to="/search" className={navLinkClass}>
                <Search className="h-4 w-4" />
                Find Rides
              </NavLink>
            )}
            {role === 'RIDER' && (
              <NavLink to="/rides" className={navLinkClass}>
                <Car className="h-4 w-4" />
                My Rides
              </NavLink>
            )}
            <NavLink to="/bookings" className={navLinkClass}>
              Bookings
            </NavLink>
            <NavLink to="/eco" className={navLinkClass}>
              <Leaf className="h-4 w-4" />
              Eco
            </NavLink>
            <NavLink to="/leaderboard" className={navLinkClass}>
              <Trophy className="h-4 w-4" />
              Leaderboard
            </NavLink>
            {role === 'ADMIN' && (
              <NavLink to="/admin" className={navLinkClass}>
                <Shield className="h-4 w-4" />
                Admin
              </NavLink>
            )}
            <NavLink to="/profile" className={navLinkClass}>
              <User className="h-4 w-4" />
              Profile
            </NavLink>
          </nav>

          <div className="flex items-center gap-3">
            {user?.photoUrl ? (
              <img src={user.photoUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-sm font-medium text-brand-700">
                {user?.name?.[0]?.toUpperCase() ?? '?'}
              </div>
            )}
            <span className="hidden text-sm text-slate-600 sm:block">{user?.name}</span>
            <button onClick={logout} className="btn-secondary !px-2" title="Logout">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

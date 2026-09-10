import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, LogOut, User, LayoutDashboard, MapPin, Search, PlusCircle, Leaf, Trophy, ShieldAlert } from 'lucide-react';

export default function Layout() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getLinks = () => {
    const base = [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/profile', label: 'Profile', icon: User },
      { to: '/bookings', label: 'Bookings', icon: MapPin },
      { to: '/eco', label: 'Eco Impact', icon: Leaf },
      { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    ];

    if (role === 'RIDER') {
      base.push({ to: '/rides', label: 'My Rides', icon: Car });
      base.push({ to: '/rides/new', label: 'Post Ride', icon: PlusCircle });
    } else if (role === 'COMMUTER') {
      base.push({ to: '/search', label: 'Search Rides', icon: Search });
    } else if (role === 'ADMIN') {
      base.push({ to: '/admin', label: 'Admin', icon: ShieldAlert });
    }

    return base;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-brand-700">
            <Car className="h-7 w-7" />
            RidePool
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-700 hidden sm:block">
              {user?.name}
            </span>
            <button onClick={handleLogout} className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-red-600">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col md:flex-row">
        <nav className="w-full md:w-64 p-4 space-y-1">
          {getLinks().map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-brand-50 hover:text-brand-700"
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          ))}
        </nav>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

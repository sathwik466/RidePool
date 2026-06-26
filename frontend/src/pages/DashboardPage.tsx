import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { statsApi } from '../api/stats';
import BookingCard from '../components/BookingCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import type { DashboardData } from '../types';
import { Car, Plus, Search, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const { role, user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const api =
          role === 'RIDER'
            ? statsApi.riderDashboard
            : statsApi.commuterDashboard;
        const { data: dash } = await api();
        setData(dash);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [role]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  const recent = data?.bookings?.slice(0, 5) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
          <p className="text-slate-600">
            {role === 'RIDER' ? 'Manage your rides and bookings' : 'Find and book shared rides'}
          </p>
        </div>
        <div className="flex gap-2">
          {role === 'RIDER' && (
            <Link to="/rides/new" className="btn-primary">
              <Plus className="h-4 w-4" />
              Post Ride
            </Link>
          )}
          {role === 'COMMUTER' && (
            <Link to="/search" className="btn-primary">
              <Search className="h-4 w-4" />
              Search Rides
            </Link>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-brand-600" />
          <div>
            <p className="text-sm text-slate-500">Total Trips</p>
            <p className="text-2xl font-bold">{data?.totalTrips ?? 0}</p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <Car className="h-8 w-8 text-brand-600" />
          <div>
            <p className="text-sm text-slate-500">Karma Points</p>
            <p className="text-2xl font-bold">{user?.karmaPoints ?? 0}</p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-brand-600" />
          <div>
            <p className="text-sm text-slate-500">Rating</p>
            <p className="text-2xl font-bold">{user?.avgRating?.toFixed(1) ?? '0.0'}</p>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Bookings</h2>
          <Link to="/bookings" className="text-sm text-brand-600 hover:underline">
            View all
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="text-sm text-slate-500">No bookings yet.</p>
        ) : (
          <div className="grid gap-3">
            {recent.map((b) => (
              <BookingCard key={b.id} booking={b} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

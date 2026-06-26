import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ridesApi } from '../api/rides';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { formatDateTime } from '../utils/format';
import type { Ride } from '../types';
import { Edit, Plus, Trash2 } from 'lucide-react';

export default function MyRidesPage() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { data } = await ridesApi.getMy();
      setRides(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load rides');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const cancelRide = async (id: number) => {
    if (!confirm('Cancel this ride?')) return;
    try {
      await ridesApi.cancel(id);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cancel failed');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Rides</h1>
        <Link to="/rides/new" className="btn-primary">
          <Plus className="h-4 w-4" />
          Post Ride
        </Link>
      </div>

      {error && <ErrorAlert message={error} />}

      {rides.length === 0 ? (
        <p className="text-slate-500">No rides posted yet.</p>
      ) : (
        <div className="grid gap-4">
          {rides.map((ride) => (
            <div key={ride.id} className="card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">
                    {ride.sourceName} → {ride.destName}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {formatDateTime(ride.departureTime)} · {ride.distanceKm?.toFixed(1)} km
                  </p>
                  <p className="mt-1 text-sm">
                    Seats: {ride.availableSeats}/{ride.totalSeats}
                    {ride.womenOnly && ' · Women only'}
                    {ride.recurrence !== 'NONE' && ` · ${ride.recurrence}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={ride.status} />
                </div>
              </div>
              {ride.status === 'ACTIVE' && (
                <div className="mt-3 flex gap-2">
                  <Link to={`/rides/${ride.id}/edit`} className="btn-secondary !py-1.5 text-xs">
                    <Edit className="h-3 w-3" />
                    Edit
                  </Link>
                  <button
                    className="btn-danger !py-1.5 text-xs"
                    onClick={() => cancelRide(ride.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

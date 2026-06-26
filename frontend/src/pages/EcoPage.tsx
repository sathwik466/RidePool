import { useEffect, useState } from 'react';
import { statsApi } from '../api/stats';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import type { EcoTracker } from '../types';
import { Leaf } from 'lucide-react';

export default function EcoPage() {
  const [stats, setStats] = useState<EcoTracker | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    statsApi
      .eco()
      .then(({ data }) => setStats(data))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Eco Impact</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card flex items-center gap-4">
          <Leaf className="h-10 w-10 text-brand-600" />
          <div>
            <p className="text-sm text-slate-500">CO₂ Saved</p>
            <p className="text-3xl font-bold text-brand-700">
              {stats?.co2SavedKg?.toFixed(2) ?? '0.00'} kg
            </p>
          </div>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Trips Shared</p>
          <p className="text-3xl font-bold">{stats?.tripsShared ?? 0}</p>
        </div>
      </div>
      <p className="text-sm text-slate-500">
        Estimated at ~0.12 kg CO₂ saved per km shared. Keep riding together!
      </p>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { statsApi } from '../api/stats';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import type { User } from '../types';
import { Trophy } from 'lucide-react';

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<User[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    statsApi
      .leaderboard()
      .then(({ data }) => setLeaders(data))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Trophy className="h-7 w-7 text-amber-500" />
        <h1 className="text-2xl font-bold">Karma Leaderboard</h1>
      </div>

      <div className="card overflow-hidden !p-0">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Karma</th>
              <th className="px-4 py-3">Rating</th>
            </tr>
          </thead>
          <tbody>
            {leaders.map((user, i) => (
              <tr key={user.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium">{i + 1}</td>
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3">{user.role}</td>
                <td className="px-4 py-3 font-semibold text-brand-700">{user.karmaPoints}</td>
                <td className="px-4 py-3">{user.avgRating?.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {leaders.length === 0 && (
          <p className="p-4 text-center text-slate-500">No data yet</p>
        )}
      </div>
    </div>
  );
}

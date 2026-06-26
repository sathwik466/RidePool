import { FormEvent, useEffect, useState } from 'react';
import { adminApi } from '../api/stats';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import type { Analytics, Report, User } from '../types';
import { Check, Fuel, Users, X } from 'lucide-react';

export default function AdminPage() {
  const [pending, setPending] = useState<User[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [fuelRate, setFuelRate] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [riders, reps, stats] = await Promise.all([
        adminApi.pendingRiders(),
        adminApi.reports(),
        adminApi.analytics(),
      ]);
      setPending(riders.data);
      setReports(reps.data);
      setAnalytics(stats.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const verifyRider = async (id: number, status: 'APPROVED' | 'REJECTED') => {
    try {
      await adminApi.verifyRider(id, status);
      setMessage(`Rider ${status.toLowerCase()}`);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed');
    }
  };

  const updateFuel = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.updateFuelRate(Number(fuelRate));
      setMessage('Fuel rate updated');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      {error && <ErrorAlert message={error} />}
      {message && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          {message}
        </div>
      )}

      {analytics && (
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            { label: 'Users', value: analytics.users, icon: Users },
            { label: 'Rides', value: analytics.rides, icon: Check },
            { label: 'Bookings', value: analytics.bookings, icon: Check },
            { label: 'Active Rides', value: analytics.activeRides, icon: Check },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="card flex items-center gap-3">
              <Icon className="h-6 w-6 text-brand-600" />
              <div>
                <p className="text-xs text-slate-500">{label}</p>
                <p className="text-xl font-bold">{value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <section>
        <h2 className="mb-3 text-lg font-semibold">Pending Riders</h2>
        {pending.length === 0 ? (
          <p className="text-sm text-slate-500">No pending riders</p>
        ) : (
          <div className="grid gap-3">
            {pending.map((rider) => (
              <div key={rider.id} className="card flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{rider.name}</p>
                  <p className="text-sm text-slate-500">{rider.email}</p>
                  <p className="text-xs">
                    License: {rider.licenseNumber ?? '—'} · Vehicle: {rider.vehicleNumber ?? '—'}
                  </p>
                  <StatusBadge status={rider.verificationStatus} />
                </div>
                <div className="flex gap-2">
                  <button
                    className="btn-primary !py-1.5 text-xs"
                    onClick={() => verifyRider(rider.id, 'APPROVED')}
                  >
                    <Check className="h-3 w-3" />
                    Approve
                  </button>
                  <button
                    className="btn-danger !py-1.5 text-xs"
                    onClick={() => verifyRider(rider.id, 'REJECTED')}
                  >
                    <X className="h-3 w-3" />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Unresolved Reports</h2>
        {reports.length === 0 ? (
          <p className="text-sm text-slate-500">No reports</p>
        ) : (
          <div className="grid gap-3">
            {reports.map((report) => (
              <div key={report.id} className="card">
                <p className="font-medium">{report.reason}</p>
                <p className="text-sm text-slate-600">{report.description}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
          <Fuel className="h-5 w-5" />
          Fuel Rate Config
        </h2>
        <form onSubmit={updateFuel} className="card flex max-w-sm gap-2">
          <input
            type="number"
            step="0.01"
            min={0}
            className="input"
            placeholder="Rate per km"
            value={fuelRate}
            onChange={(e) => setFuelRate(e.target.value)}
            required
          />
          <button type="submit" className="btn-primary">Update</button>
        </form>
      </section>
    </div>
  );
}

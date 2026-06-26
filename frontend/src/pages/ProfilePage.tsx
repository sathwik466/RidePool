import { FormEvent, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usersApi } from '../api/users';
import ErrorAlert from '../components/ErrorAlert';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';

export default function ProfilePage() {
  const { user, refreshUser, role } = useAuth();
  const [form, setForm] = useState({
    name: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    licenseNumber: '',
    vehicleNumber: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name ?? '',
        emergencyContactName: user.emergencyContactName ?? '',
        emergencyContactPhone: user.emergencyContactPhone ?? '',
        licenseNumber: user.licenseNumber ?? '',
        vehicleNumber: user.vehicleNumber ?? '',
      });
    }
  }, [user]);

  if (!user) return <LoadingSpinner />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await usersApi.updateProfile(form);
      await refreshUser();
      setMessage('Profile updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoLoading(true);
    setError('');
    try {
      await usersApi.uploadPhoto(file);
      await refreshUser();
      setMessage('Photo uploaded');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setPhotoLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>

      {error && <ErrorAlert message={error} />}
      {message && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          {message}
        </div>
      )}

      <div className="card flex items-center gap-4">
        {user.photoUrl ? (
          <img src={user.photoUrl} alt="" className="h-20 w-20 rounded-full object-cover" />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 text-2xl font-bold text-brand-700">
            {user.name?.[0]?.toUpperCase()}
          </div>
        )}
        <div>
          <p className="font-semibold">{user.name}</p>
          <p className="text-sm text-slate-500">{user.email}</p>
          <div className="mt-1 flex gap-2">
            <StatusBadge status={user.role} />
            {role === 'RIDER' && <StatusBadge status={user.verificationStatus} />}
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Rating: {user.avgRating?.toFixed(1) ?? '0.0'} · Karma: {user.karmaPoints}
          </p>
          <label className="mt-2 inline-block cursor-pointer text-sm text-brand-600 hover:underline">
            {photoLoading ? 'Uploading...' : 'Change photo'}
            <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
          </label>
        </div>
      </div>

      {!user.emailVerified && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          Email not verified. Please verify before logging in.
        </div>
      )}

      {role === 'RIDER' && user.verificationStatus === 'PENDING' && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
          Your rider profile is pending admin approval. Complete your license and vehicle details below.
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label className="label">Full Name</label>
          <input
            className="input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Emergency Contact Name *</label>
          <input
            className="input"
            value={form.emergencyContactName}
            onChange={(e) => setForm({ ...form, emergencyContactName: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="label">Emergency Contact Phone *</label>
          <input
            className="input"
            value={form.emergencyContactPhone}
            onChange={(e) => setForm({ ...form, emergencyContactPhone: e.target.value })}
            required
          />
        </div>

        {role === 'RIDER' && (
          <>
            <div>
              <label className="label">License Number</label>
              <input
                className="input"
                value={form.licenseNumber}
                onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Vehicle Number</label>
              <input
                className="input"
                value={form.vehicleNumber}
                onChange={(e) => setForm({ ...form, vehicleNumber: e.target.value })}
              />
            </div>
          </>
        )}

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}

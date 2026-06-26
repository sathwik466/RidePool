import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookingsApi } from '../api/bookings';
import BookingCard from '../components/BookingCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import type { Booking } from '../types';

export default function BookingsPage() {
  const { role } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const api = role === 'RIDER' ? bookingsApi.getRider : bookingsApi.getMy;
        const { data } = await api();
        setBookings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [role]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {role === 'RIDER' ? 'Bookings on My Rides' : 'My Bookings'}
      </h1>
      {error && <ErrorAlert message={error} />}
      {bookings.length === 0 ? (
        <p className="text-slate-500">No bookings found.</p>
      ) : (
        <div className="grid gap-3">
          {bookings.map((b) => (
            <BookingCard key={b.id} booking={b} />
          ))}
        </div>
      )}
    </div>
  );
}

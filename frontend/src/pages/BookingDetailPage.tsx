import { FormEvent, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingsApi } from '../api/bookings';
import { reviewsApi, sosApi } from '../api/stats';
import RideMap from '../components/RideMap';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { formatCurrency, formatDateTime } from '../utils/format';
import type { Booking } from '../types';
import {
  AlertTriangle,
  Check,
  MapPin,
  MessageCircle,
  Share2,
  Star,
  X,
} from 'lucide-react';

export default function BookingDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [otp, setOtp] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const load = async () => {
    try {
      const { data } = await bookingsApi.getById(Number(id));
      setBooking(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load booking');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const isRider = booking?.ride?.riderId === user?.id;
  const isCommuter = booking?.commuterId === user?.id;

  const confirm = async () => {
    setActionLoading(true);
    setError('');
    try {
      await bookingsApi.confirm(Number(id));
      setMessage('Booking confirmed. Share trip OTP with commuter at trip end.');
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Confirm failed');
    } finally {
      setActionLoading(false);
    }
  };

  const complete = async (e: FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await bookingsApi.complete(Number(id), otp);
      setMessage('Trip completed!');
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Complete failed');
    } finally {
      setActionLoading(false);
    }
  };

  const cancelBooking = async () => {
    if (!window.confirm('Cancel this booking?')) return;
    setActionLoading(true);
    try {
      await bookingsApi.cancel(Number(id));
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cancel failed');
    } finally {
      setActionLoading(false);
    }
  };

  const triggerSos = async () => {
    if (!window.confirm('Send SOS alert to your emergency contact?')) return;
    try {
      await sosApi.trigger({ bookingId: Number(id) });
      setMessage('SOS alert sent');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'SOS failed');
    }
  };

  const shareTrip = async () => {
    try {
      await sosApi.shareTrip(Number(id));
      setMessage('Trip details shared with emergency contact');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Share failed');
    }
  };

  const submitReview = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await reviewsApi.submit({ bookingId: Number(id), rating, comment });
      setMessage('Review submitted');
      setShowReview(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Review failed');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!booking) return <ErrorAlert message="Booking not found" />;

  const ride = booking.ride;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Booking #{booking.id}</h1>
        <StatusBadge status={booking.status} />
      </div>

      {error && <ErrorAlert message={error} />}
      {message && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          {message}
        </div>
      )}

      <div className="card space-y-3">
        {ride && (
          <>
            <p className="text-lg font-medium">
              {ride.sourceName} → {ride.destName}
            </p>
            <p className="text-sm text-slate-500">{formatDateTime(ride.departureTime)}</p>
            <p className="text-sm">
              Pickup: {booking.pickupName} · Fare: {formatCurrency(Number(booking.fareAmount))}
            </p>
            <p className="text-sm text-slate-500">
              {isRider ? `Commuter: ${booking.commuterName}` : `Rider: ${ride.riderName}`}
            </p>
            {booking.status === 'PENDING' && booking.expiresAt && (
              <p className="text-xs text-amber-600">
                Expires: {formatDateTime(booking.expiresAt)}
              </p>
            )}
          </>
        )}
      </div>

      {ride && (
        <RideMap
          source={{ lat: ride.sourceLat, lng: ride.sourceLng }}
          dest={{ lat: ride.destLat, lng: ride.destLng }}
          pickup={{ lat: booking.pickupLat, lng: booking.pickupLng }}
          polyline={ride.routePolyline}
          height="250px"
        />
      )}

      <div className="flex flex-wrap gap-2">
        {booking.status === 'PENDING' && isRider && (
          <>
            <button className="btn-primary" onClick={confirm} disabled={actionLoading}>
              <Check className="h-4 w-4" />
              Confirm Booking
            </button>
            <button className="btn-danger" onClick={cancelBooking} disabled={actionLoading}>
              <X className="h-4 w-4" />
              Reject
            </button>
          </>
        )}
        {booking.status === 'PENDING' && isCommuter && (
          <button className="btn-danger" onClick={cancelBooking} disabled={actionLoading}>
            Cancel Booking
          </button>
        )}
        {booking.status === 'CONFIRMED' && (
          <>
            <Link to={`/bookings/${id}/tracking`} className="btn-primary">
              <MapPin className="h-4 w-4" />
              Live Tracking
            </Link>
            <Link to={`/bookings/${id}/chat`} className="btn-secondary">
              <MessageCircle className="h-4 w-4" />
              Chat
            </Link>
            <button className="btn-secondary" onClick={shareTrip}>
              <Share2 className="h-4 w-4" />
              Share Trip
            </button>
            <button className="btn-danger" onClick={triggerSos}>
              <AlertTriangle className="h-4 w-4" />
              SOS
            </button>
            <button className="btn-danger" onClick={cancelBooking} disabled={actionLoading}>
              Cancel
            </button>
          </>
        )}
        {booking.status === 'COMPLETED' && (
          <>
            <Link to={`/bookings/${id}/receipt`} className="btn-secondary">
              View Receipt
            </Link>
            <button className="btn-primary" onClick={() => setShowReview(true)}>
              <Star className="h-4 w-4" />
              Leave Review
            </button>
          </>
        )}
      </div>

      {booking.status === 'CONFIRMED' && (
        <form onSubmit={complete} className="card space-y-3">
          <p className="text-sm text-slate-600">
            Enter the 6-digit trip OTP to complete the ride. The rider shares this OTP at trip end.
          </p>
          <div>
            <label className="label">Trip OTP</label>
            <input
              className="input max-w-xs"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="000000"
              required
            />
          </div>
          <button type="submit" className="btn-primary" disabled={actionLoading}>
            Complete Trip
          </button>
        </form>
      )}

      {showReview && (
        <form onSubmit={submitReview} className="card space-y-3">
          <h3 className="font-semibold">Rate this trip</h3>
          <div>
            <label className="label">Rating (1-5)</label>
            <input
              type="number"
              min={1}
              max={5}
              className="input max-w-xs"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="label">Comment</label>
            <textarea
              className="input"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn-primary">Submit</button>
            <button type="button" className="btn-secondary" onClick={() => setShowReview(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

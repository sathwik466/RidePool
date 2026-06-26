import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LocationPicker from '../components/LocationPicker';
import { ridesApi } from '../api/rides';
import { bookingsApi } from '../api/bookings';
import ErrorAlert from '../components/ErrorAlert';
import { formatCurrency, formatDateTime, toApiDateTime, toLocalDateTimeInput } from '../utils/format';
import type { LocationPoint, RideMatch } from '../types';
import { useGeolocation } from '../hooks/useGeolocation';
import { Star } from 'lucide-react';

export default function SearchRidesPage() {
  const navigate = useNavigate();
  const geo = useGeolocation();
  const [pickup, setPickup] = useState<LocationPoint | null>(null);
  const [dest, setDest] = useState<LocationPoint | null>(null);
  const [date, setDate] = useState(toLocalDateTimeInput());
  const [womenOnly, setWomenOnly] = useState(false);
  const [maxDetourKm, setMaxDetourKm] = useState(5);
  const [results, setResults] = useState<RideMatch[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookingId, setBookingId] = useState<number | null>(null);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await ridesApi.search({
        commuterLat: pickup?.lat ?? geo.lat ?? undefined,
        commuterLng: pickup?.lng ?? geo.lng ?? undefined,
        destLat: dest?.lat,
        destLng: dest?.lng,
        date: toApiDateTime(date),
        womenOnly,
        maxDetourKm,
      });
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const bookRide = async (match: RideMatch) => {
    setBookingId(match.rideId);
    setError('');
    try {
      const { data } = await bookingsApi.create({
        rideId: match.rideId,
        pickupName: match.suggestedPickupName,
        pickupLat: match.suggestedPickupLat,
        pickupLng: match.suggestedPickupLng,
        matchScore: match.matchScore,
        detourKm: match.detourKm,
      });
      navigate(`/bookings/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking failed');
    } finally {
      setBookingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Find Rides</h1>
      {error && <ErrorAlert message={error} />}

      <form onSubmit={handleSearch} className="card space-y-4">
        <LocationPicker
          label="Your Pickup (optional — uses GPS if empty)"
          value={pickup}
          onChange={setPickup}
          defaultCenter={geo.lat && geo.lng ? [geo.lat, geo.lng] : undefined}
        />
        <LocationPicker label="Destination" value={dest} onChange={setDest} />
        <div>
          <label className="label">Travel Date & Time</label>
          <input
            type="datetime-local"
            className="input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label">Max Detour (km)</label>
          <input
            type="number"
            min={1}
            max={50}
            className="input"
            value={maxDetourKm}
            onChange={(e) => setMaxDetourKm(Number(e.target.value))}
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={womenOnly} onChange={(e) => setWomenOnly(e.target.checked)} />
          Women-only rides
        </label>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Searching...' : 'Search Rides'}
        </button>
      </form>

      {results.length > 0 && (
        <div className="grid gap-4">
          {results.map((match) => (
            <div key={match.rideId} className="card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">
                    {match.sourceName} → {match.destName}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {formatDateTime(match.departureTime)} · {match.distanceKm?.toFixed(1)} km
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-sm">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {match.riderRating?.toFixed(1)} · {match.riderName}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Pickup: {match.suggestedPickupName} · Detour: {match.detourKm?.toFixed(1)} km ·
                    Score: {match.matchScore?.toFixed(0)}
                  </p>
                  <p className="mt-1 text-xs">
                    {match.availableSeats} seats · {match.womenOnly && 'Women only · '}
                    {formatCurrency(match.farePerSeat)}/seat
                  </p>
                </div>
                <button
                  className="btn-primary"
                  disabled={bookingId === match.rideId}
                  onClick={() => bookRide(match)}
                >
                  {bookingId === match.rideId ? 'Booking...' : 'Book'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

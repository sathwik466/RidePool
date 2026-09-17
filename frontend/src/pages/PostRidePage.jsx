import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LocationPicker from '../components/LocationPicker';
import { ridesApi } from '../api/rides';
import { fareApi } from '../api/fare';
import ErrorAlert from '../components/ErrorAlert';
import { toApiDateTime, toLocalDateTimeInput, formatCurrency, reverseGeocode } from '../utils/format';
import { Navigation, Loader2 } from 'lucide-react';

export default function PostRidePage() {
  const navigate = useNavigate();
  const [source, setSource] = useState(null);
  const [dest, setDest] = useState(null);
  const [departureTime, setDepartureTime] = useState(toLocalDateTimeInput());
  const [totalSeats, setTotalSeats] = useState(3);
  const [tollAmount, setTollAmount] = useState(0);
  const [womenOnly, setWomenOnly] = useState(false);
  const [recurrence, setRecurrence] = useState('NONE');
  const [farePreview, setFarePreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [locatingSource, setLocatingSource] = useState(false);

  const handleSetCurrentAsSource = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }
    setLocatingSource(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        try {
          const name = await reverseGeocode(lat, lng);
          setSource({ name, lat, lng });
        } catch {
          setSource({
            name: `Current Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
            lat,
            lng,
          });
        } finally {
          setLocatingSource(false);
        }
      },
      (err) => {
        setLocatingSource(false);
        setError('Could not access current location: ' + err.message);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const previewFare = async (distanceKm) => {
    try {
      const { data } = await fareApi.preview({
        distanceKm,
        toll: tollAmount,
        seats: totalSeats,
      });
      setFarePreview(data.farePerSeat);
    } catch {
      setFarePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!source || !dest) {
      setError('Please select source and destination');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { data } = await ridesApi.create({
        sourceName: source.name,
        sourceLat: source.lat,
        sourceLng: source.lng,
        destName: dest.name,
        destLat: dest.lat,
        destLng: dest.lng,
        departureTime: toApiDateTime(departureTime),
        totalSeats,
        tollAmount,
        womenOnly,
        recurrence,
      });
      if (data.distanceKm) await previewFare(data.distanceKm);
      navigate('/rides');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post ride');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Post a Ride</h1>
      {error && <ErrorAlert message={error} />}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-brand-200 bg-brand-50/70 p-3.5">
        <div>
          <p className="text-sm font-semibold text-brand-900">Starting from where you are?</p>
          <p className="text-xs text-brand-700">Quickly set your Source to your current GPS location.</p>
        </div>
        <button
          type="button"
          onClick={handleSetCurrentAsSource}
          disabled={locatingSource}
          className="btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-1.5 whitespace-nowrap bg-white font-medium hover:bg-brand-50 shadow-sm"
        >
          {locatingSource ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-600" />
          ) : (
            <Navigation className="h-3.5 w-3.5 text-brand-600" />
          )}
          {locatingSource ? 'Detecting Location...' : 'Use Current Location for Source'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <LocationPicker label="Source" value={source} onChange={setSource} />
        <LocationPicker label="Destination" value={dest} onChange={setDest} />

        <div>
          <label className="label">Departure Time</label>
          <input
            type="datetime-local"
            className="input"
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Total Seats</label>
            <input
              type="number"
              min={1}
              max={8}
              className="input"
              value={totalSeats}
              onChange={(e) => setTotalSeats(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="label">Toll Amount (₹)</label>
            <input
              type="number"
              min={0}
              step={0.01}
              className="input"
              value={tollAmount}
              onChange={(e) => setTollAmount(Number(e.target.value))}
            />
          </div>
        </div>

        <div>
          <label className="label">Recurrence</label>
          <select
            className="input"
            value={recurrence}
            onChange={(e) => setRecurrence(e.target.value)}
          >
            <option value="NONE">One-time</option>
            <option value="DAILY">Daily</option>
            <option value="WEEKLY">Weekly</option>
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={womenOnly}
            onChange={(e) => setWomenOnly(e.target.checked)}
          />
          Women-only ride
        </label>

        {farePreview !== null && (
          <p className="text-sm text-brand-700">
            Estimated fare per seat: {formatCurrency(farePreview)}
          </p>
        )}

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Posting...' : 'Post Ride'}
        </button>
      </form>
    </div>
  );
}

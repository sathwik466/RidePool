import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LocationPicker from '../components/LocationPicker';
import { ridesApi } from '../api/rides';
import ErrorAlert from '../components/ErrorAlert';
import LoadingSpinner from '../components/LoadingSpinner';
import { toApiDateTime, toLocalDateTimeInput } from '../utils/format';
import type { LocationPoint, RecurrenceType } from '../types';

export default function EditRidePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [source, setSource] = useState<LocationPoint | null>(null);
  const [dest, setDest] = useState<LocationPoint | null>(null);
  const [departureTime, setDepartureTime] = useState('');
  const [totalSeats, setTotalSeats] = useState(3);
  const [tollAmount, setTollAmount] = useState(0);
  const [womenOnly, setWomenOnly] = useState(false);
  const [recurrence, setRecurrence] = useState<RecurrenceType>('NONE');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await ridesApi.getById(Number(id));
        setSource({ name: data.sourceName, lat: data.sourceLat, lng: data.sourceLng });
        setDest({ name: data.destName, lat: data.destLat, lng: data.destLng });
        setDepartureTime(toLocalDateTimeInput(data.departureTime));
        setTotalSeats(data.totalSeats);
        setTollAmount(data.tollAmount ?? 0);
        setWomenOnly(data.womenOnly);
        setRecurrence(data.recurrence);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load ride');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!source || !dest) return;
    setSaving(true);
    try {
      await ridesApi.update(Number(id), {
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
      navigate('/rides');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Edit Ride</h1>
      {error && <ErrorAlert message={error} />}

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
              className="input"
              value={totalSeats}
              onChange={(e) => setTotalSeats(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="label">Toll (₹)</label>
            <input
              type="number"
              min={0}
              className="input"
              value={tollAmount}
              onChange={(e) => setTollAmount(Number(e.target.value))}
            />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={womenOnly} onChange={(e) => setWomenOnly(e.target.checked)} />
          Women-only ride
        </label>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}

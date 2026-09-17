import { useEffect, useState, useCallback, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStomp } from '../hooks/useStomp';
import { useGeolocation } from '../hooks/useGeolocation';
import { bookingsApi } from '../api/bookings';
import RideMap from '../components/RideMap';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { fetchRouteEta, formatEtaTime } from '../utils/format';
import { ArrowLeft, Clock, MapPin, Navigation, Compass, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function TrackingPage() {
  const { id } = useParams();
  const { role } = useAuth();
  const geo = useGeolocation();
  const { connected, subscribe, publish } = useStomp(true);

  const bookingId = Number(id);
  const isRider = role === 'RIDER';

  const [booking, setBooking] = useState(null);
  const [loadingBooking, setLoadingBooking] = useState(true);
  const [bookingError, setBookingError] = useState('');

  const [live, setLive] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [etaInfo, setEtaInfo] = useState(null);
  const [calculatingEta, setCalculatingEta] = useState(false);

  // Load booking details (destination, route, pickup, etc.)
  useEffect(() => {
    let mounted = true;
    const fetchBooking = async () => {
      try {
        const { data } = await bookingsApi.getById(bookingId);
        if (mounted) {
          setBooking(data);
        }
      } catch (err) {
        if (mounted) {
          setBookingError(err instanceof Error ? err.message : 'Failed to load booking details');
        }
      } finally {
        if (mounted) setLoadingBooking(false);
      }
    };
    fetchBooking();
    return () => {
      mounted = false;
    };
  }, [bookingId]);

  // Recalculate remaining distance and ETA whenever current location changes
  const updateEta = useCallback(async (currLat, currLng, destLat, destLng) => {
    if (!currLat || !currLng || !destLat || !destLng) return;
    setCalculatingEta(true);
    try {
      const res = await fetchRouteEta(currLat, currLng, destLat, destLng);
      setEtaInfo({
        distanceKm: res.distanceKm,
        durationMin: res.durationMin,
        etaTime: formatEtaTime(res.durationMin),
      });
    } catch (err) {
      console.warn('Failed to calculate ETA:', err);
    } finally {
      setCalculatingEta(false);
    }
  }, []);

  // Update ETA when rider's initial geolocation is ready (for rider view before movement)
  useEffect(() => {
    if (isRider && geo.lat && geo.lng && booking?.ride?.destLat && !live) {
      setLive({ lat: geo.lat, lng: geo.lng });
      setLastUpdated(new Date());
      updateEta(geo.lat, geo.lng, booking.ride.destLat, booking.ride.destLng);
    }
  }, [isRider, geo.lat, geo.lng, booking?.ride?.destLat, booking?.ride?.destLng, live, updateEta]);

  // WebSocket Subscription to live updates
  useEffect(() => {
    if (!connected) return;
    const unsub = subscribe(`/topic/tracking/${bookingId}`, (update) => {
      const newPos = { lat: update.lat, lng: update.lng };
      setLive(newPos);
      setLastUpdated(new Date());

      if (booking?.ride?.destLat && booking?.ride?.destLng) {
        updateEta(update.lat, update.lng, booking.ride.destLat, booking.ride.destLng);
      }
    });
    return unsub;
  }, [connected, bookingId, subscribe, booking?.ride?.destLat, booking?.ride?.destLng, updateEta]);

  // Rider Broadcasting Loop (every 10 seconds)
  useEffect(() => {
    if (!connected || !isRider || !geo.lat || !geo.lng) return;

    // Send initial START broadcast
    publish(`/app/tracking/${bookingId}`, {
      lat: geo.lat,
      lng: geo.lng,
      type: 'START',
    });

    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setLive({ lat, lng });
          setLastUpdated(new Date());

          publish(`/app/tracking/${bookingId}`, {
            lat,
            lng,
            type: 'LIVE',
          });

          if (booking?.ride?.destLat && booking?.ride?.destLng) {
            updateEta(lat, lng, booking.ride.destLat, booking.ride.destLng);
          }
        },
        (err) => console.warn('Broadcast geolocation error:', err),
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }, 10000);

    return () => clearInterval(interval);
  }, [connected, isRider, geo.lat, geo.lng, bookingId, publish, booking?.ride?.destLat, booking?.ride?.destLng, updateEta]);

  if (loadingBooking) return <LoadingSpinner />;
  if (bookingError) return <ErrorAlert message={bookingError} />;

  const ride = booking?.ride;
  const destName = ride?.destName || 'Destination';
  const totalDistanceKm = ride?.distanceKm || 0;
  const remainingKm = etaInfo?.distanceKm ?? null;
  const durationMin = etaInfo?.durationMin ?? null;
  const etaTime = etaInfo?.etaTime ?? null;

  // Calculate progress percentage
  const progressPercent =
    totalDistanceKm > 0 && remainingKm !== null
      ? Math.min(100, Math.max(5, Math.round(((totalDistanceKm - remainingKm) / totalDistanceKm) * 100)))
      : 50;

  const isNearDestination = remainingKm !== null && remainingKm <= 0.3;

  return (
    <div className="space-y-6">
      {/* Header with Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            to={`/bookings/${bookingId}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700 mb-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Booking #{bookingId}
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Live Trip Tracking</h1>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              connected
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                connected ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'
              }`}
            />
            {connected ? (isRider ? 'Broadcasting Live' : 'Live Connected') : 'Connecting...'}
          </span>
        </div>
      </div>

      {/* ETA & Distance Remaining Dashboard Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {/* Distance Remaining */}
          <div className="flex items-center gap-3.5 pr-3">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Navigation className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Distance Remaining
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {remainingKm !== null ? `${remainingKm} km` : '--'}
              </p>
              <p className="text-xs text-slate-500">
                {isNearDestination ? 'Arriving at destination' : 'to destination'}
              </p>
            </div>
          </div>

          {/* Expected Time / ETA */}
          <div className="flex items-center gap-3.5 pt-3 md:pt-0 md:px-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Expected Arrival (ETA)
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {etaTime || '--'}
              </p>
              <p className="text-xs text-slate-500">
                {durationMin !== null ? `~${durationMin} mins travel time` : calculatingEta ? 'Calculating...' : '--'}
              </p>
            </div>
          </div>

          {/* Destination & Ride Info */}
          <div className="flex items-center gap-3.5 pt-3 md:pt-0 md:pl-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <MapPin className="h-6 w-6" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Destination
              </p>
              <p className="text-sm font-semibold text-slate-900 truncate" title={destName}>
                {destName}
              </p>
              <p className="text-xs text-slate-500">
                {isRider ? `Commuter: ${booking?.commuterName}` : `Rider: ${ride?.riderName}`}
              </p>
            </div>
          </div>
        </div>

        {/* Journey Progress Bar */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-medium">
            <span className="truncate max-w-[45%]">📍 {ride?.sourceName || 'Origin'}</span>
            <span className="text-brand-600 font-semibold">{progressPercent}% complete</span>
            <span className="truncate max-w-[45%] text-right">🏁 {destName}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {isNearDestination && (
          <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
            <span>Vehicle is approaching or has arrived at the destination.</span>
          </div>
        )}
      </div>

      {/* Live Map Display */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              {isRider
                ? 'Your device GPS is broadcasting coordinates every 10s'
                : 'Receiving live vehicle GPS position'}
            </span>
          </div>
          {lastUpdated && (
            <span>Last updated: {lastUpdated.toLocaleTimeString('en-IN')}</span>
          )}
        </div>

        {ride && (
          <RideMap
            source={{ lat: ride.sourceLat, lng: ride.sourceLng, name: ride.sourceName }}
            dest={{ lat: ride.destLat, lng: ride.destLng, name: ride.destName }}
            pickup={
              booking.pickupLat && booking.pickupLng
                ? { lat: booking.pickupLat, lng: booking.pickupLng, name: booking.pickupName }
                : undefined
            }
            live={live}
            polyline={ride.routePolyline}
            height="460px"
          />
        )}
      </div>
    </div>
  );
}

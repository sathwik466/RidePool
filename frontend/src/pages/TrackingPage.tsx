import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStomp } from '../hooks/useStomp';
import { useGeolocation } from '../hooks/useGeolocation';
import RideMap from '../components/RideMap';
import LoadingSpinner from '../components/LoadingSpinner';
import type { TrackingUpdate } from '../types';

export default function TrackingPage() {
  const { id } = useParams();
  const { role } = useAuth();
  const geo = useGeolocation();
  const { connected, subscribe, publish } = useStomp(true);
  const [live, setLive] = useState<{ lat: number; lng: number } | null>(null);
  const bookingId = Number(id);
  const isRider = role === 'RIDER';

  useEffect(() => {
    if (!connected) return;
    const unsub = subscribe<TrackingUpdate>(`/topic/tracking/${bookingId}`, (update: TrackingUpdate) => {
      setLive({ lat: update.lat, lng: update.lng });
    });
    return unsub;
  }, [connected, bookingId, subscribe]);

  useEffect(() => {
    if (!connected || !isRider || !geo.lat || !geo.lng) return;

    publish(`/app/tracking/${bookingId}`, {
      lat: geo.lat,
      lng: geo.lng,
      type: 'START',
    });

    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition((pos) => {
        publish(`/app/tracking/${bookingId}`, {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          type: 'LIVE',
        });
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [connected, isRider, geo.lat, geo.lng, bookingId, publish]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Live Tracking</h1>
      <p className="text-sm text-slate-500">
        {connected ? 'Connected to live feed' : 'Connecting...'}
        {isRider ? ' · Broadcasting your location' : ' · Watching rider location'}
      </p>
      {!live && <LoadingSpinner />}
      {live && <RideMap live={live} height="400px" />}
    </div>
  );
}

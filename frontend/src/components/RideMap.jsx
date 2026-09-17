import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useMemo } from 'react';

const liveIcon = L.divIcon({
  className: 'custom-live-marker',
  html: `<div style="background-color: #059669; width: 34px; height: 34px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 14px rgba(5,150,105,0.8); display: flex; align-items: center; justify-content: center; font-size: 17px; cursor: pointer; animation: pulse 2s infinite;">🚗</div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

const destIcon = L.divIcon({
  className: 'custom-dest-marker',
  html: `<div style="background-color: #dc2626; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(220,38,38,0.6); display: flex; align-items: center; justify-content: center; font-size: 16px; cursor: pointer;">🏁</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const srcIcon = L.divIcon({
  className: 'custom-src-marker',
  html: `<div style="background-color: #2563eb; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(37,99,235,0.6); display: flex; align-items: center; justify-content: center; font-size: 15px; cursor: pointer;">📍</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const pickupIcon = L.divIcon({
  className: 'custom-pickup-marker',
  html: `<div style="background-color: #7c3aed; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(124,58,237,0.6); display: flex; align-items: center; justify-content: center; font-size: 15px; cursor: pointer;">🙋</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

function MapFollower({ live }) {
  const map = useMap();
  useEffect(() => {
    if (live && live.lat && live.lng) {
      map.panTo([live.lat, live.lng], { animate: true });
    }
  }, [live?.lat, live?.lng, map]);
  return null;
}

function decodePolyline(encoded) {
  const points = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let shift = 0;
    let result = 0;
    let byte;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    lat += result & 1 ? ~(result >> 1) : result >> 1;

    shift = 0;
    result = 0;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    lng += result & 1 ? ~(result >> 1) : result >> 1;

    points.push([lat / 1e5, lng / 1e5]);
  }
  return points;
}

export default function RideMap({
  source,
  dest,
  pickup,
  live,
  polyline,
  height = '300px',
}) {
  const route = useMemo(
    () => (polyline ? decodePolyline(polyline) : []),
    [polyline]
  );

  const center = live
    ? [live.lat, live.lng]
    : source
      ? [source.lat, source.lng]
      : dest
        ? [dest.lat, dest.lng]
        : [17.385, 78.4867];

  return (
    <div style={{ height }} className="overflow-hidden rounded-lg border border-slate-200 shadow-inner relative">
      <MapContainer center={center} zoom={12} className="h-full w-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapFollower live={live} />
        {source && (
          <Marker position={[source.lat, source.lng]} icon={srcIcon}>
            <Popup><strong>Start:</strong> {source.name || 'Origin'}</Popup>
          </Marker>
        )}
        {pickup && (
          <Marker position={[pickup.lat, pickup.lng]} icon={pickupIcon}>
            <Popup><strong>Pickup:</strong> {pickup.name || 'Passenger Pickup'}</Popup>
          </Marker>
        )}
        {dest && (
          <Marker position={[dest.lat, dest.lng]} icon={destIcon}>
            <Popup><strong>Destination:</strong> {dest.name || 'Final Destination'}</Popup>
          </Marker>
        )}
        {live && (
          <Marker position={[live.lat, live.lng]} icon={liveIcon}>
            <Popup><strong>🚗 Live Vehicle Location</strong></Popup>
          </Marker>
        )}
        {route.length > 0 && (
          <Polyline positions={route} color="#059669" weight={5} opacity={0.8} />
        )}
      </MapContainer>
    </div>
  );
}

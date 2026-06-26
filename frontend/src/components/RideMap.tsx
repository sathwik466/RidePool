import { MapContainer, Marker, Polyline, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import { useMemo } from 'react';

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface Props {
  source?: { lat: number; lng: number };
  dest?: { lat: number; lng: number };
  pickup?: { lat: number; lng: number };
  live?: { lat: number; lng: number };
  polyline?: string;
  height?: string;
}

function decodePolyline(encoded: string): [number, number][] {
  const points: [number, number][] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let shift = 0;
    let result = 0;
    let byte: number;
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
}: Props) {
  const route = useMemo(
    () => (polyline ? decodePolyline(polyline) : []),
    [polyline]
  );

  const center: [number, number] = live
    ? [live.lat, live.lng]
    : source
      ? [source.lat, source.lng]
      : [17.385, 78.4867];

  return (
    <div style={{ height }} className="overflow-hidden rounded-lg border border-slate-200">
      <MapContainer center={center} zoom={12} className="h-full w-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {source && <Marker position={[source.lat, source.lng]} icon={defaultIcon} />}
        {dest && <Marker position={[dest.lat, dest.lng]} icon={defaultIcon} />}
        {pickup && <Marker position={[pickup.lat, pickup.lng]} icon={defaultIcon} />}
        {live && <Marker position={[live.lat, live.lng]} icon={defaultIcon} />}
        {route.length > 0 && (
          <Polyline positions={route} color="#059669" weight={4} />
        )}
      </MapContainer>
    </div>
  );
}

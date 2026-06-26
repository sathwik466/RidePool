import { useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { geocodeSearch } from '../utils/format';
import type { LocationPoint } from '../types';
import { MapPin, Search } from 'lucide-react';

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

interface Props {
  label: string;
  value: LocationPoint | null;
  onChange: (point: LocationPoint) => void;
  defaultCenter?: [number, number];
}

function MapClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function LocationPicker({ label, value, onChange, defaultCenter }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationPoint[]>([]);
  const [searching, setSearching] = useState(false);

  const center: [number, number] = value
    ? [value.lat, value.lng]
    : defaultCenter ?? [17.385, 78.4867];

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const items = await geocodeSearch(query);
        setResults(items);
      } finally {
        setSearching(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  const pickFromMap = (lat: number, lng: number) => {
    onChange({ name: value?.name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`, lat, lng });
  };

  return (
    <div className="space-y-2">
      <label className="label">{label}</label>
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <input
          className="input pl-9"
          placeholder="Search place..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {results.length > 0 && (
          <ul className="absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg">
            {results.map((r) => (
              <li key={`${r.lat}-${r.lng}`}>
                <button
                  type="button"
                  className="w-full px-3 py-2 text-left text-sm hover:bg-brand-50"
                  onClick={() => {
                    onChange(r);
                    setQuery(r.name);
                    setResults([]);
                  }}
                >
                  {r.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {value && (
        <p className="flex items-center gap-1 text-xs text-slate-500">
          <MapPin className="h-3 w-3" />
          {value.name}
        </p>
      )}

      <div className="h-48 overflow-hidden rounded-lg border border-slate-200">
        <MapContainer center={center} zoom={13} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onPick={pickFromMap} />
          {value && <Marker position={[value.lat, value.lng]} />}
        </MapContainer>
      </div>
      {searching && <p className="text-xs text-slate-400">Searching...</p>}
    </div>
  );
}

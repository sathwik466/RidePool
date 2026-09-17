import { useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { geocodeSearch, reverseGeocode } from '../utils/format';
import { MapPin, Search, Navigation, Loader2 } from 'lucide-react';

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

function MapClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MapCenterUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, 14);
    }
  }, [center[0], center[1], map]);
  return null;
}

export default function LocationPicker({
  label,
  value,
  onChange,
  defaultCenter,
  allowCurrentLocation = true,
}) {
  const [query, setQuery] = useState(value?.name || '');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);

  // Sync query input if value changed externally
  useEffect(() => {
    if (value?.name && value.name !== query) {
      setQuery(value.name);
    }
  }, [value?.name]);

  const center = value
    ? [value.lat, value.lng]
    : defaultCenter ?? [17.385, 78.4867];

  useEffect(() => {
    if (!query.trim() || query === value?.name) {
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
  }, [query, value?.name]);

  const pickFromMap = async (lat, lng) => {
    try {
      const name = await reverseGeocode(lat, lng);
      onChange({ name, lat, lng });
      setQuery(name);
    } catch {
      onChange({ name: `${lat.toFixed(4)}, ${lng.toFixed(4)}`, lat, lng });
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        try {
          const name = await reverseGeocode(lat, lng);
          onChange({ name, lat, lng });
          setQuery(name);
        } catch {
          const fallback = `Current Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
          onChange({ name: fallback, lat, lng });
          setQuery(fallback);
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setLocating(false);
        alert('Could not get current location: ' + err.message);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="label mb-0">{label}</label>
        {allowCurrentLocation && (
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={locating}
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700 disabled:opacity-60 transition-colors"
            title="Use current GPS position"
          >
            {locating ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Navigation className="h-3.5 w-3.5" />
            )}
            {locating ? 'Locating...' : 'Use Current Location'}
          </button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <input
          className="input pl-9"
          placeholder={`Search ${label?.toLowerCase() || 'place'}...`}
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
        <p className="flex items-center gap-1 text-xs text-slate-500 truncate">
          <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-brand-600" />
          <span className="truncate">{value.name}</span>
        </p>
      )}

      <div className="h-48 overflow-hidden rounded-lg border border-slate-200 shadow-inner">
        <MapContainer center={center} zoom={13} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapCenterUpdater center={center} />
          <MapClickHandler onPick={pickFromMap} />
          {value && <Marker position={[value.lat, value.lng]} />}
        </MapContainer>
      </div>
      {searching && <p className="text-xs text-slate-400">Searching...</p>}
    </div>
  );
}

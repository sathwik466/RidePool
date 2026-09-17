// ✅ All times handled in IST (UTC+5:30)

const IST_OFFSET = 5.5 * 60; // 330 minutes

function toISTDate(date) {
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  return new Date(utc + IST_OFFSET * 60000);
}

function padZ(n) {
  return String(n).padStart(2, '0');
}

// For datetime-local input default value
export function toLocalDateTimeInput(iso) {
  const date = iso ? new Date(iso) : new Date();
  const ist = toISTDate(date);
  const year = ist.getFullYear();
  const month = padZ(ist.getMonth() + 1);
  const day = padZ(ist.getDate());
  const hours = padZ(ist.getHours());
  const minutes = padZ(ist.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// For sending to backend API — IST local time, no UTC conversion
export function toApiDateTime(localValue) {
  // localValue is "2026-06-23T10:00" from datetime-local input (already IST)
  return localValue + ':00'; // append seconds → "2026-06-23T10:00:00"
}

// For displaying date/time to user in IST
export function formatDateTime(iso) {
  const ist = toISTDate(new Date(iso));
  return ist.toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  });
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
}

export async function geocodeSearch(query) {
  if (!query.trim()) return [];
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`;
  const res = await fetch(url, {
    headers: { 'Accept-Language': 'en' },
  });
  const data = await res.json();
  return data.map((item) => ({
    name: item.display_name,
    lat: parseFloat(item.lat),
    lng: parseFloat(item.lon),
  }));
}

export async function reverseGeocode(lat, lng) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
    const res = await fetch(url, {
      headers: { 'Accept-Language': 'en' },
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.display_name) {
        const addr = data.address;
        if (addr) {
          const parts = [
            addr.road || addr.suburb || addr.neighbourhood,
            addr.city || addr.town || addr.county,
            addr.state,
          ].filter(Boolean);
          if (parts.length > 0) {
            return parts.join(', ');
          }
        }
        return data.display_name;
      }
    }
  } catch (err) {
    console.error('Reverse geocoding error:', err);
  }
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}

export function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function fetchRouteEta(srcLat, srcLng, destLat, destLng) {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${srcLng},${srcLat};${destLng},${destLat}?overview=false`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const distanceKm = Number((route.distance / 1000).toFixed(1));
        const durationMin = Math.max(1, Math.round(route.duration / 60));
        return { distanceKm, durationMin };
      }
    }
  } catch (err) {
    console.warn('OSRM routing fetch failed, falling back to haversine:', err);
  }

  // Fallback: Haversine with 1.3 road detour factor and 35 km/h average traffic speed
  const straightKm = haversineDistanceKm(srcLat, srcLng, destLat, destLng);
  const roadKm = Number((straightKm * 1.3).toFixed(1));
  const estMin = Math.max(1, Math.round((roadKm / 35) * 60));
  return { distanceKm: roadKm, durationMin: estMin };
}

export function formatEtaTime(durationMin) {
  const arrivalDate = new Date(Date.now() + durationMin * 60000);
  return arrivalDate.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
  });
}

export function statusColor(status) {
  const map = {
    PENDING: 'bg-amber-100 text-amber-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-gray-100 text-gray-700',
    EXPIRED: 'bg-red-100 text-red-800',
    ACTIVE: 'bg-green-100 text-green-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
  };
  return map[status] ?? 'bg-gray-100 text-gray-700';
}

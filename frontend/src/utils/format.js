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

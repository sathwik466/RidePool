// export function formatDateTime(iso: string): string {
//   return new Date(iso).toLocaleString(undefined, {
//     dateStyle: 'medium',
//     timeStyle: 'short',
//   });
// }

// export function formatCurrency(amount: number): string {
//   return `₹${amount.toFixed(2)}`;
// }

// export function toLocalDateTimeInput(iso?: string): string {
//   if (!iso) {
//     const d = new Date();
//     d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
//     return d.toISOString().slice(0, 16);
//   }
//   const d = new Date(iso);
//   d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
//   return d.toISOString().slice(0, 16);
// }

// export function toApiDateTime(localValue: string): string {
//   return new Date(localValue).toISOString().slice(0, 19);
// }

// export async function geocodeSearch(query: string): Promise<
//   { name: string; lat: number; lng: number }[]
// > {
//   if (!query.trim()) return [];
//   const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`;
//   const res = await fetch(url, {
//     headers: { 'Accept-Language': 'en' },
//   });
//   const data = await res.json();
//   return data.map((item: { display_name: string; lat: string; lon: string }) => ({
//     name: item.display_name,
//     lat: parseFloat(item.lat),
//     lng: parseFloat(item.lon),
//   }));
// }

// export function statusColor(status: string): string {
//   const map: Record<string, string> = {
//     PENDING: 'bg-amber-100 text-amber-800',
//     CONFIRMED: 'bg-blue-100 text-blue-800',
//     COMPLETED: 'bg-green-100 text-green-800',
//     CANCELLED: 'bg-gray-100 text-gray-700',
//     EXPIRED: 'bg-red-100 text-red-800',
//     ACTIVE: 'bg-green-100 text-green-800',
//     APPROVED: 'bg-green-100 text-green-800',
//     REJECTED: 'bg-red-100 text-red-800',
//   };
//   return map[status] ?? 'bg-gray-100 text-gray-700';
// }



// ✅ All times handled in IST (UTC+5:30)

const IST_OFFSET = 5.5 * 60; // 330 minutes

function toISTDate(date: Date): Date {
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  return new Date(utc + IST_OFFSET * 60000);
}

function padZ(n: number): string {
  return String(n).padStart(2, '0');
}

function formatISTparts(date: Date): string {
  const ist = toISTDate(date);
  const year = ist.getFullYear();
  const month = padZ(ist.getMonth() + 1);
  const day = padZ(ist.getDate());
  const hours = padZ(ist.getHours());
  const minutes = padZ(ist.getMinutes());
  const seconds = padZ(ist.getSeconds());
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

// For datetime-local input default value
export function toLocalDateTimeInput(iso?: string): string {
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
export function toApiDateTime(localValue: string): string {
  // localValue is "2026-06-23T10:00" from datetime-local input (already IST)
  return localValue + ':00'; // append seconds → "2026-06-23T10:00:00"
}

// For displaying date/time to user in IST
export function formatDateTime(iso: string): string {
  const ist = toISTDate(new Date(iso));
  return ist.toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata', // ✅ explicit IST
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount); // ✅ shows ₹ correctly instead of â‚¹ (encoding bug fixed)
}

export async function geocodeSearch(query: string): Promise<
  { name: string; lat: number; lng: number }[]
> {
  if (!query.trim()) return [];
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`;
  const res = await fetch(url, {
    headers: { 'Accept-Language': 'en' },
  });
  const data = await res.json();
  return data.map((item: { display_name: string; lat: string; lon: string }) => ({
    name: item.display_name,
    lat: parseFloat(item.lat),
    lng: parseFloat(item.lon),
  }));
}

export function statusColor(status: string): string {
  const map: Record<string, string> = {
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

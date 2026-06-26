import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { formatCurrency, formatDateTime } from '../utils/format';
import type { Booking } from '../types';

export default function BookingCard({ booking }: { booking: Booking }) {
  return (
    <Link to={`/bookings/${booking.id}`} className="card block transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-slate-900">
            {booking.ride?.sourceName ?? 'Pickup'} → {booking.ride?.destName ?? 'Destination'}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {booking.ride?.departureTime ? formatDateTime(booking.ride.departureTime) : ''}
          </p>
          <p className="mt-1 text-sm text-slate-600">
            {booking.commuterName && `Commuter: ${booking.commuterName}`}
          </p>
        </div>
        <div className="text-right">
          <StatusBadge status={booking.status} />
          <p className="mt-2 text-sm font-semibold text-brand-700">
            {formatCurrency(Number(booking.fareAmount))}
          </p>
        </div>
      </div>
    </Link>
  );
}

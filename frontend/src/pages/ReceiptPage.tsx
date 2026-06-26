import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { bookingsApi } from '../api/bookings';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { formatCurrency, formatDateTime } from '../utils/format';
import type { Receipt } from '../types';

export default function ReceiptPage() {
  const { id } = useParams();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingsApi
      .receipt(Number(id))
      .then(({ data }) => setReceipt(data))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load receipt'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;
  if (!receipt) return null;

  return (
    <div className="mx-auto max-w-md">
      <div className="card space-y-4">
        <h1 className="text-xl font-bold text-brand-700">Trip Receipt</h1>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Booking</span>
            <span>#{receipt.bookingId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Route</span>
            <span className="text-right">{receipt.source} → {receipt.destination}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Distance</span>
            <span>{receipt.distanceKm?.toFixed(1)} km</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Rider</span>
            <span>{receipt.riderName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Commuter</span>
            <span>{receipt.commuterName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Completed</span>
            <span>{formatDateTime(receipt.completedAt)}</span>
          </div>
          <hr />
          <div className="flex justify-between text-lg font-bold">
            <span>Fare Paid</span>
            <span className="text-brand-700">{formatCurrency(Number(receipt.farePaid))}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

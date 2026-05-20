import { ChevronLeft, CheckCircle2 } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { WasherLayout } from '@/shared/components/layout/WasherLayout';
import { ErrorState } from '@/shared/components/feedback/ErrorState';
import { LoadingSpinner } from '@/shared/components/feedback/LoadingSpinner';
import { formatAppointmentDate } from '@/shared/lib/formatDate';
import { useJobDetail } from '../hooks/useJobDetail';
import { useUpdateJobStatus } from '../hooks/useUpdateJobStatus';
import type { BookingResponse } from '../types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_TO_BADGE: Record<
  BookingResponse['status'],
  'pending' | 'confirmed' | 'inProgress' | 'completed' | 'cancelled'
> = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'inProgress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

function extractTime(isoString: string): string {
  return isoString.slice(11, 16);
}

// ─── InfoRow ──────────────────────────────────────────────────────────────────

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-900 font-medium">{value}</span>
    </div>
  );
}

// ─── ActionArea ───────────────────────────────────────────────────────────────

interface ActionAreaProps {
  status: BookingResponse['status'];
  onAction: () => void;
  isPending: boolean;
}

function ActionArea({ status, onAction, isPending }: ActionAreaProps) {
  if (status === 'COMPLETED') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
        <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto" />
        <p className="text-sm font-semibold text-green-700 mt-1">Wash completed</p>
      </div>
    );
  }

  return (
    <Button variant="primary" size="lg" className="w-full" onClick={onAction} isLoading={isPending}>
      {status === 'CONFIRMED' ? 'Start wash' : 'Mark as complete'}
    </Button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function WasherJobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: booking, isLoading, isError } = useJobDetail(id!);
  const updateStatus = useUpdateJobStatus();

  function handleAction() {
    if (!booking) return;
    if (booking.status !== 'CONFIRMED' && booking.status !== 'IN_PROGRESS') return;
    const nextStatus = booking.status === 'CONFIRMED' ? 'IN_PROGRESS' : 'COMPLETED';
    updateStatus.mutate({ id: booking.id, status: nextStatus });
  }

  const ref = booking?.id.slice(-8).toUpperCase() ?? '';

  return (
    <WasherLayout>
      <>
        <header className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Go back"
              className="text-gray-500 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <p className="text-sm font-semibold text-gray-900">
              {ref ? `Job ${ref}` : 'Job detail'}
            </p>
          </div>
        </header>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : isError || !booking ? (
          <div className="flex items-center justify-center py-20">
            <ErrorState message="Could not load job details." />
          </div>
        ) : (
          <div className="px-4 pt-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Badge variant={STATUS_TO_BADGE[booking.status]} />
              <span className="font-mono text-xs text-gray-500">{ref}</span>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                Booking info
              </p>
              <div className="flex flex-col gap-2">
                <InfoRow label="Date" value={formatAppointmentDate(booking.appointmentDateTime)} />
                <InfoRow label="Time" value={extractTime(booking.appointmentDateTime)} />
                <InfoRow label="Service" value={booking.washServiceName} />
                <InfoRow label="Duration" value={`${booking.durationMinutes} min`} />
              </div>
              {booking.status === 'IN_PROGRESS' && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">In progress</p>
                  <div className="bg-gray-100 h-2 rounded-full">
                    <div className="bg-amber-500 h-2 rounded-full w-3/5" />
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                Vehicle
              </p>
              <img src="/images/vehicle-side.png" alt="Vehicle photo" className="w-full mb-3 aspect-video object-cover" />
              <div className="flex flex-col gap-2">
                <InfoRow label="Plate" value={booking.vehicleLicensePlate} />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                Client
              </p>
              <div className="flex flex-col gap-2">
                <InfoRow label="Email" value={booking.customerEmail} />
              </div>
            </div>

            <div className="mt-4 mb-6">
              <ActionArea
                status={booking.status}
                onAction={handleAction}
                isPending={updateStatus.isPending}
              />
            </div>
          </div>
        )}
      </>
    </WasherLayout>
  );
}

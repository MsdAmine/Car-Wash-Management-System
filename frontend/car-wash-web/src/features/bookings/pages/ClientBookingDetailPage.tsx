import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { Loader } from 'lucide-react';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { StepTracker } from '@/shared/components/ui/StepTracker';
import { ConfirmDialog } from '@/shared/components/ui/ConfirmDialog';
import { ClientLayout } from '@/shared/components/layout/ClientLayout';
import { LoadingSpinner } from '@/shared/components/feedback/LoadingSpinner';
import { ErrorState } from '@/shared/components/feedback/ErrorState';
import { RescheduleBookingModal } from '../components/RescheduleBookingModal';
import { useMyBookings } from '../hooks/useMyBookings';
import { useCancelBooking } from '../hooks/useCancelBooking';
import { ROUTES } from '@/router/routes';
import type { BookingResponse } from '../types';
import { formatAppointmentDate, formatAppointmentDateTime } from '@/shared/lib/formatDate';

// ─── Types ────────────────────────────────────────────────────────────────────

type BadgeVariant = 'pending' | 'confirmed' | 'inProgress' | 'completed' | 'cancelled';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function printReceipt(booking: BookingResponse) {
  const date = new Date(booking.appointmentDateTime).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  const time = new Date(booking.appointmentDateTime).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit',
  });

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Receipt</title>
  <style>
    body{font-family:ui-sans-serif,system-ui,sans-serif;padding:48px;max-width:480px;margin:0 auto;color:#111827}
    h1{font-size:22px;font-weight:700;margin:0 0 4px}
    .id{font-size:12px;color:#6b7280;font-family:monospace;margin-bottom:24px}
    hr{border:none;border-top:1px solid #e5e7eb;margin:16px 0}
    .row{display:flex;justify-content:space-between;padding:6px 0;font-size:14px}
    .label{color:#6b7280}
    .total{display:flex;justify-content:space-between;padding:12px 0;font-weight:700;font-size:16px;border-top:2px solid #111827;margin-top:8px}
    @media print{.no-print{display:none}}
  </style>
</head>
<body>
  <h1>Car Wash Receipt</h1>
  <p class="id">${booking.id}</p>
  <hr/>
  <div class="row"><span class="label">Service</span><span>${booking.washServiceName}</span></div>
  <div class="row"><span class="label">Date</span><span>${date}</span></div>
  <div class="row"><span class="label">Time</span><span>${time}</span></div>
  <div class="row"><span class="label">Duration</span><span>${booking.durationMinutes} min</span></div>
  <div class="row"><span class="label">Vehicle</span><span>${booking.vehicleLicensePlate}</span></div>
  <hr/>
  <div class="total"><span>Total</span><span>$${booking.totalPrice}</span></div>
  <script>window.onload=function(){window.print();}</script>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const w = window.open(url, '_blank', 'width=620,height=520');
  if (w) {
    w.addEventListener('afterprint', () => URL.revokeObjectURL(url));
  } else {
    URL.revokeObjectURL(url);
  }
}

const STATUS_TO_BADGE: Record<BookingResponse['status'], BadgeVariant> = {
  PENDING:     'pending',
  CONFIRMED:   'confirmed',
  IN_PROGRESS: 'inProgress',
  COMPLETED:   'completed',
  CANCELLED:   'cancelled',
};

const STATUS_TO_STEP: Record<BookingResponse['status'], number> = {
  PENDING:     0,
  CONFIRMED:   1,
  IN_PROGRESS: 2,
  COMPLETED:   3,
  CANCELLED:   0,
};

const STEPS = [
  { label: 'Pending' },
  { label: 'Confirmed' },
  { label: 'In Progress' },
  { label: 'Completed' },
];

function getAssignedWasherName(booking: BookingResponse): string | null {
  const name = [booking.assignedEmployeeFirstName, booking.assignedEmployeeLastName]
    .filter(Boolean)
    .join(' ')
    .trim();
  return name || null;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface InfoFieldProps {
  label: string;
  value: string;
  italic?: boolean;
  muted?: boolean;
}

function InfoField({ label, value, italic, muted }: InfoFieldProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-gray-500">{label}</span>
      <span
        className={`text-sm font-medium ${muted ? 'text-gray-400' : 'text-gray-900'}${italic ? ' italic' : ''}`}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ClientBookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: bookings, isLoading, isError, refetch } = useMyBookings();
  const cancelMutation = useCancelBooking();
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);

  const booking = bookings?.find((b) => b.id === id) ?? null;

  const cancelError = cancelMutation.error
    ? isAxiosError(cancelMutation.error) && cancelMutation.error.response?.data?.message
      ? (cancelMutation.error.response.data.message as string)
      : 'Could not cancel this booking.'
    : null;

  if (isLoading) {
    return (
      <ClientLayout>
        <div className="flex h-64 items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </ClientLayout>
    );
  }

  if (isError) {
    return (
      <ClientLayout>
        <div className="flex h-64 items-center justify-center">
          <ErrorState onRetry={() => refetch()} />
        </div>
      </ClientLayout>
    );
  }

  if (!booking) {
    return (
      <ClientLayout>
        <div className="flex h-64 items-center justify-center">
          <ErrorState message="Booking not found." />
        </div>
      </ClientLayout>
    );
  }

  const badgeVariant = STATUS_TO_BADGE[booking.status];
  const currentStep = STATUS_TO_STEP[booking.status];
  const dateLabel = formatAppointmentDate(booking.appointmentDateTime);
  const timeLabel = formatAppointmentDateTime(booking.appointmentDateTime).split(' at ')[1] ?? '';
  const assignedWasherName = getAssignedWasherName(booking);

  return (
    <ClientLayout>
      <main className="max-w-3xl mx-auto px-6 py-8 flex flex-col gap-6">

        {/* Section 1 — Title row */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{booking.washServiceName}</h1>
            <p className="font-mono text-sm text-gray-500 mt-0.5">{booking.id}</p>
          </div>
          <Badge variant={badgeVariant} />
        </div>

        {/* Section 2 — Progress tracker */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <StepTracker steps={STEPS} currentStep={currentStep} />
        </div>

        {/* Section 3 — Info grid */}
        <div className="grid grid-cols-3 gap-4">

          {/* Booking Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">
              Booking Info
            </p>
            <div className="flex flex-col gap-3">
              <InfoField label="Date" value={dateLabel} />
              <InfoField label="Time" value={timeLabel} />
              <InfoField label="Service" value={booking.washServiceName} />
              <InfoField label="Duration" value={`${booking.durationMinutes} min`} />
              <InfoField label="Price" value={`$${booking.totalPrice}`} />
            </div>
          </div>

          {/* Vehicle */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">
              Vehicle
            </p>
            <div className="flex flex-col gap-3">
              <InfoField label="Plate" value={booking.vehicleLicensePlate} />
            </div>
          </div>

          {/* Washer */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">
              Washer
            </p>
            <InfoField
              label="Name"
              value={assignedWasherName ?? 'To be confirmed'}
              italic={!assignedWasherName}
              muted={!assignedWasherName}
            />
          </div>

        </div>

        {/* Section 4 — Service summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-base font-semibold text-gray-900">
                {booking.washServiceName}
              </span>
              <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full ml-2">
                {booking.durationMinutes} min
              </span>
            </div>
            <span className="text-xl font-bold text-indigo-600">
              ${booking.totalPrice}
            </span>
          </div>
        </div>

        {/* Section 5 — Contextual actions */}
        {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
          <div className="flex flex-col gap-2 items-end">
            <div className="flex gap-3">
              <Button variant="ghost" size="sm" onClick={() => setIsRescheduleOpen(true)}>
                Reschedule
              </Button>
              <Button variant="danger" size="sm" onClick={() => setIsCancelOpen(true)}>
                Cancel
              </Button>
            </div>
            {cancelError && (
              <p className="text-sm text-red-600">{cancelError}</p>
            )}
          </div>
        )}

        {booking.status === 'IN_PROGRESS' && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
            <Loader className="w-5 h-5 text-amber-500 animate-spin" />
            <div>
              <p className="text-sm font-semibold text-amber-700">Your wash is in progress</p>
              <p className="text-xs text-amber-600 mt-0.5">We'll notify you when it's complete.</p>
            </div>
          </div>
        )}

        {booking.status === 'COMPLETED' && (
          <div className="flex gap-3 justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`${ROUTES.CLIENT.BOOK}?serviceId=${booking.washServiceId}`)}
            >
              Book again
            </Button>
            <Button variant="ghost" size="sm" onClick={() => printReceipt(booking)}>
              Receipt
            </Button>
          </div>
        )}

        {booking.status === 'CANCELLED' && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm text-red-600">This booking has been cancelled.</p>
          </div>
        )}

      </main>

      <RescheduleBookingModal
        isOpen={isRescheduleOpen}
        onClose={() => setIsRescheduleOpen(false)}
        bookingId={booking.id}
        washServiceId={booking.washServiceId}
      />

      <ConfirmDialog
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        onConfirm={() => {
          cancelMutation.mutate(booking.id, {
            onSuccess: () => setIsCancelOpen(false),
          });
        }}
        title="Cancel booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmLabel="Yes, cancel booking"
        cancelLabel="Keep booking"
        variant="danger"
        isLoading={cancelMutation.isPending}
      />
    </ClientLayout>
  );
}

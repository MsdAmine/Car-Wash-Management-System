import { useState } from 'react';
import { Loader } from 'lucide-react';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { StepTracker } from '@/shared/components/ui/StepTracker';
import { ConfirmDialog } from '@/shared/components/ui/ConfirmDialog';
import { ClientLayout } from '@/shared/components/layout/ClientLayout';

// ─── Mock data (not exported) ─────────────────────────────────────────────────

const MOCK_BOOKING = {
  id: '1',
  ref: 'CW-000101',
  service: { name: 'Full Detail', price: 65, duration: 90 },
  vehicle: { make: 'Toyota', model: 'Camry', plate: 'ABC-1234', type: 'Sedan' },
  washer: { name: 'Maria L.' },
  date: 'Monday, 19 May 2025',
  time: '10:00',
  status: 'confirmed' as const,
  steps: [
    { label: 'Pending',     completedAt: 'May 19, 09:30' },
    { label: 'Confirmed',   completedAt: 'May 19, 09:45' },
    { label: 'In Progress', completedAt: undefined },
    { label: 'Completed',   completedAt: undefined },
  ],
};

// ─── Types ────────────────────────────────────────────────────────────────────

type BookingStatus = 'pending' | 'confirmed' | 'inProgress' | 'completed' | 'cancelled';

// ─── Sub-components ───────────────────────────────────────────────────────────

interface InfoFieldProps {
  label: string;
  value: string;
}

function InfoField({ label, value }: InfoFieldProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-sm text-gray-900 font-medium">{value}</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ClientBookingDetailPage() {
  const [status, setStatus] = useState<BookingStatus>(MOCK_BOOKING.status);
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  const firstIncompleteIndex = MOCK_BOOKING.steps.findIndex((s) => s.completedAt === undefined);
  const currentStep = firstIncompleteIndex === -1
    ? MOCK_BOOKING.steps.length - 1
    : firstIncompleteIndex - 1;

  return (
    <ClientLayout>
      <main className="max-w-3xl mx-auto px-6 py-8 flex flex-col gap-6">

        {/* Section 1 — Title row */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{MOCK_BOOKING.service.name}</h1>
            <p className="font-mono text-sm text-gray-500 mt-0.5">{MOCK_BOOKING.ref}</p>
          </div>
          <Badge variant={status} />
        </div>

        {/* Section 2 — Progress tracker */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <StepTracker steps={MOCK_BOOKING.steps} currentStep={currentStep} />
        </div>

        {/* Section 3 — Info grid */}
        <div className="grid grid-cols-3 gap-4">

          {/* Booking Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">
              Booking Info
            </p>
            <div className="flex flex-col gap-3">
              <InfoField label="Date" value={MOCK_BOOKING.date} />
              <InfoField label="Time" value={MOCK_BOOKING.time} />
              <InfoField label="Service" value={MOCK_BOOKING.service.name} />
              <InfoField label="Duration" value={`${MOCK_BOOKING.service.duration} min`} />
              <InfoField label="Price" value={`$${MOCK_BOOKING.service.price}`} />
            </div>
          </div>

          {/* Vehicle */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">
              Vehicle
            </p>
            <div className="flex flex-col gap-3">
              <InfoField
                label="Make & Model"
                value={`${MOCK_BOOKING.vehicle.make} ${MOCK_BOOKING.vehicle.model}`}
              />
              <InfoField label="Plate" value={MOCK_BOOKING.vehicle.plate} />
              <InfoField label="Type" value={MOCK_BOOKING.vehicle.type} />
            </div>
          </div>

          {/* Washer */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">
              Washer
            </p>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-gray-500">Name</span>
              {MOCK_BOOKING.washer ? (
                <span className="text-sm text-gray-900 font-medium">{MOCK_BOOKING.washer.name}</span>
              ) : (
                <span className="text-sm text-gray-400 italic font-medium">Not yet assigned</span>
              )}
            </div>
          </div>

        </div>

        {/* Section 4 — Service summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-base font-semibold text-gray-900">
                {MOCK_BOOKING.service.name}
              </span>
              <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full ml-2">
                {MOCK_BOOKING.service.duration} min
              </span>
            </div>
            <span className="text-xl font-bold text-indigo-600">
              ${MOCK_BOOKING.service.price}
            </span>
          </div>
        </div>

        {/* Section 5 — Contextual actions */}
        {status === 'confirmed' && (
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" size="sm" onClick={() => console.log('reschedule')}>
              Reschedule
            </Button>
            <Button variant="danger" size="sm" onClick={() => setIsCancelOpen(true)}>
              Cancel
            </Button>
          </div>
        )}

        {status === 'inProgress' && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
            <Loader className="w-5 h-5 text-amber-500 animate-spin" />
            <div>
              <p className="text-sm font-semibold text-amber-700">Your wash is in progress</p>
              <p className="text-xs text-amber-600 mt-0.5">We'll notify you when it's complete.</p>
            </div>
          </div>
        )}

        {status === 'completed' && (
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" size="sm" onClick={() => console.log('book again')}>
              Book again
            </Button>
            <Button variant="ghost" size="sm" onClick={() => console.log('receipt')}>
              Receipt
            </Button>
          </div>
        )}

        {status === 'cancelled' && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm text-red-600">This booking has been cancelled.</p>
          </div>
        )}

      </main>

      <ConfirmDialog
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        onConfirm={() => {
          console.log('cancelled');
          setIsCancelOpen(false);
          setStatus('cancelled');
        }}
        title="Cancel booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmLabel="Yes, cancel booking"
        cancelLabel="Keep booking"
        variant="danger"
      />
    </ClientLayout>
  );
}

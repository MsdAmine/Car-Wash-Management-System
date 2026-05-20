import { ChevronLeft, UserX } from 'lucide-react';
import { AdminLayout } from '@/shared/components/layout/AdminLayout';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { ImagePlaceholder } from '@/shared/components/ui/ImagePlaceholder';
import { StepTracker } from '@/shared/components/ui/StepTracker';

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_BOOKING = {
  id: '1',
  ref: 'CW-000101',
  service: { name: 'Full Detail', price: 65, duration: 90 },
  vehicle: { make: 'Toyota', model: 'Camry', plate: 'ABC-1234', type: 'Sedan' },
  client: { name: 'Alex Morgan', email: 'alex@example.com', phone: '+1 555 0192' },
  washer: { id: '2', name: 'Maria L.', assignedAt: 'May 19, 2025 09:45' },
  date: 'Monday, 19 May 2025',
  time: '10:00',
  status: 'inProgress' as const,
  steps: [
    { label: 'Pending',     completedAt: 'May 19, 09:30' },
    { label: 'Confirmed',   completedAt: 'May 19, 09:45' },
    { label: 'In Progress', completedAt: 'May 19, 10:02' },
    { label: 'Completed',   completedAt: undefined },
  ],
};

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

export function AdminBookingDetailPage() {
  const firstIncompleteIndex = MOCK_BOOKING.steps.findIndex((s) => s.completedAt === undefined);
  const currentStep = firstIncompleteIndex - 1;

  const topBar = (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        <button
          aria-label="Back to bookings"
          onClick={() => console.log('back')}
          className="p-1 rounded-md hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <ChevronLeft className="w-5 h-5 text-gray-500 hover:text-gray-700" />
        </button>
        <nav className="flex items-center">
          <span className="text-sm text-gray-500">Bookings</span>
          <span className="text-gray-300 mx-1">/</span>
          <span className="font-mono text-sm text-gray-900">{MOCK_BOOKING.ref}</span>
        </nav>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={() => console.log('reschedule')}>
          Reschedule
        </Button>
        <Button variant="danger" size="sm" onClick={() => console.log('cancel')}>
          Cancel
        </Button>
      </div>
    </div>
  );

  return (
    <AdminLayout topBar={topBar}>
      <div className="flex flex-col gap-6">

        {/* Section 1 — Title row */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{MOCK_BOOKING.service.name}</h1>
            <p className="font-mono text-sm text-gray-500 mt-0.5">{MOCK_BOOKING.ref}</p>
          </div>
          <Badge variant={MOCK_BOOKING.status} />
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

          {/* Client Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">
              Client Details
            </p>
            <div className="flex flex-col gap-3">
              <InfoField label="Name" value={MOCK_BOOKING.client.name} />
              <InfoField label="Email" value={MOCK_BOOKING.client.email} />
              <InfoField label="Phone" value={MOCK_BOOKING.client.phone} />
            </div>
          </div>
        </div>

        {/* Section 4 — Washer assignment */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-base font-semibold text-gray-900">Assigned Washer</p>

          {MOCK_BOOKING.washer ? (
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ImagePlaceholder label="Washer avatar" className="w-10 h-10 rounded-full" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{MOCK_BOOKING.washer.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Assigned at {MOCK_BOOKING.washer.assignedAt}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => console.log('reassign')}>
                Reassign
              </Button>
            </div>
          ) : (
            <div className="mt-4 border-2 border-dashed border-indigo-300 rounded-xl p-6 text-center">
              <UserX className="w-8 h-8 text-indigo-400 mx-auto" />
              <p className="text-sm font-semibold text-gray-700 mt-2">No washer assigned</p>
              <p className="text-xs text-gray-500 mt-1">Assign a washer to this booking.</p>
              <div className="mt-3 flex justify-center">
                <Button variant="primary" size="sm" onClick={() => console.log('assign')}>
                  Assign washer
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Section 5 — Service summary */}
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

      </div>
    </AdminLayout>
  );
}

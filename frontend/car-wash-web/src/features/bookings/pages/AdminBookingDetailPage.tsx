import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, UserX } from 'lucide-react';
import { AdminLayout } from '@/shared/components/layout/AdminLayout';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { ImagePlaceholder } from '@/shared/components/ui/ImagePlaceholder';
import { StepTracker } from '@/shared/components/ui/StepTracker';
import { LoadingSpinner } from '@/shared/components/feedback/LoadingSpinner';
import { ErrorState } from '@/shared/components/feedback/ErrorState';
import { ADMIN_KEYS } from '@/features/admin/hooks/useAdminDashboard';
import { useBookingDetail } from '@/features/admin/hooks/useBookingDetail';
import { fetchBookingAssignments } from '@/features/admin/api';
import { ROUTES } from '@/router/routes';
import type { BookingResponse } from '../types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statusToVariant(
  status: BookingResponse['status'],
): 'pending' | 'confirmed' | 'inProgress' | 'completed' | 'cancelled' {
  switch (status) {
    case 'IN_PROGRESS': return 'inProgress';
    case 'CONFIRMED':   return 'confirmed';
    case 'COMPLETED':   return 'completed';
    case 'CANCELLED':   return 'cancelled';
    default:            return 'pending';
  }
}

function deriveCurrentStep(status: BookingResponse['status']): number {
  switch (status) {
    case 'PENDING':     return 0;
    case 'CONFIRMED':   return 1;
    case 'IN_PROGRESS': return 2;
    case 'COMPLETED':   return 3;
    default:            return 0;
  }
}

const BOOKING_STEPS = [
  { label: 'Pending' },
  { label: 'Confirmed' },
  { label: 'In Progress' },
  { label: 'Completed' },
];

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
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: booking, isLoading, isError } = useBookingDetail(id!);

  const { data: assignments } = useQuery({
    queryKey: ADMIN_KEYS.assignments(id!),
    queryFn: () => fetchBookingAssignments(id!),
    enabled: !!id,
  });

  const ref = booking ? booking.id.slice(-8).toUpperCase() : '…';

  const topBar = (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        <button
          aria-label="Back to bookings"
          onClick={() => navigate(ROUTES.ADMIN.BOOKINGS)}
          className="p-1 rounded-md hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <ChevronLeft className="w-5 h-5 text-gray-500 hover:text-gray-700" />
        </button>
        <nav className="flex items-center">
          <span className="text-sm text-gray-500">Bookings</span>
          <span className="text-gray-300 mx-1">/</span>
          <span className="font-mono text-sm text-gray-900">{ref}</span>
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

  if (isLoading) {
    return (
      <AdminLayout topBar={topBar}>
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  if (isError || !booking) {
    return (
      <AdminLayout topBar={topBar}>
        <div className="flex justify-center py-20">
          <ErrorState message="Could not load booking details." />
        </div>
      </AdminLayout>
    );
  }

  const currentStep = deriveCurrentStep(booking.status);
  const assignedWasher = assignments && assignments.length > 0 ? assignments[0] : null;
  const appointmentDate = new Date(booking.appointmentDateTime);

  return (
    <AdminLayout topBar={topBar}>
      <div className="flex flex-col gap-6">

        {/* Section 1 — Title row */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{booking.washServiceName}</h1>
            <p className="font-mono text-sm text-gray-500 mt-0.5">{ref}</p>
          </div>
          <Badge variant={statusToVariant(booking.status)} />
        </div>

        {/* Section 2 — Progress tracker */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <StepTracker steps={BOOKING_STEPS} currentStep={currentStep} />
        </div>

        {/* Section 3 — Info grid */}
        <div className="grid grid-cols-3 gap-4">
          {/* Booking Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">
              Booking Info
            </p>
            <div className="flex flex-col gap-3">
              <InfoField label="Date" value={appointmentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} />
              <InfoField label="Time" value={appointmentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} />
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

          {/* Client Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">
              Client Details
            </p>
            <div className="flex flex-col gap-3">
              <InfoField label="Email" value={booking.customerEmail} />
            </div>
          </div>
        </div>

        {/* Section 4 — Washer assignment */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-base font-semibold text-gray-900">Assigned Washer</p>

          {assignedWasher ? (
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ImagePlaceholder label="Washer avatar" className="w-10 h-10 rounded-full" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {assignedWasher.employeeFirstName} {assignedWasher.employeeLastName}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Assigned at {new Date(assignedWasher.assignedAt).toLocaleString()}
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

      </div>
    </AdminLayout>
  );
}

import { useState } from 'react';
import { CalendarPlus, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';
import { ConfirmDialog } from '@/shared/components/ui/ConfirmDialog';
import { ClientLayout } from '@/shared/components/layout/ClientLayout';
import { ErrorState } from '@/shared/components/feedback/ErrorState';
import { useAuth } from '@/shared/context/AuthContext';
import { ROUTES } from '@/router/routes';
import { useMyBookings } from '../hooks/useMyBookings';
import { useCancelBooking } from '../hooks/useCancelBooking';
import { RescheduleBookingModal } from '../components/RescheduleBookingModal';

const SERVICE_IMAGES: Record<string, string> = {
  'Basic Wash':     '/images/service-basic-wash.png',
  'Express Wash':   '/images/service-express-wash.png',
  'Full Detail':    '/images/service-full-detail.png',
  'Premium Detail': '/images/service-premium-detail.png',
};
const DEFAULT_SERVICE_IMAGE = '/images/service-basic-wash.png';
import { useMyVehicles } from '@/features/vehicles/hooks/useMyVehicles';
import { useActiveServices } from '@/features/services/hooks/useActiveServices';
import { formatAppointmentDate, formatAppointmentDateTime, formatShortDate } from '@/shared/lib/formatDate';
import type { BookingResponse } from '../types';
import type { WashServiceResponse } from '@/features/services/types';

// ─── Types ────────────────────────────────────────────────────────────────────

type BookingStatus = 'pending' | 'confirmed' | 'inProgress' | 'completed' | 'cancelled';

interface UpcomingBooking {
  id: string;
  washServiceId: string;
  service: string;
  dateTime: string;
  vehicle: string;
  washer: string;
  status: BookingStatus;
}

interface Vehicle {
  id: string;
  make: string;
  model: string;
  plate: string;
}

interface RecentBooking {
  id: string;
  service: string;
  date: string;
  status: BookingStatus;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

const STATUS_MAP: Record<BookingResponse['status'], BookingStatus> = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'inProgress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

const statusBorderClass: Record<BookingStatus, string> = {
  confirmed: 'border-l-indigo-500',
  inProgress: 'border-l-amber-500',
  pending: 'border-l-gray-400',
  completed: 'border-l-green-500',
  cancelled: 'border-l-red-500',
};

function getAssignedWasherName(booking: BookingResponse): string {
  const name = [booking.assignedEmployeeFirstName, booking.assignedEmployeeLastName]
    .filter(Boolean)
    .join(' ')
    .trim();
  return name || 'Unassigned';
}

// ─── Upcoming booking card ────────────────────────────────────────────────────

interface UpcomingBookingCardProps {
  booking: UpcomingBooking;
  onReschedule: () => void;
  onCancel: () => void;
}

function UpcomingBookingCard({ booking, onReschedule, onCancel }: UpcomingBookingCardProps) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 border-l-4 ${statusBorderClass[booking.status]} p-5 flex justify-between items-start`}
    >
      <div>
        <p className="text-base font-semibold text-gray-900">{booking.service}</p>
        <p className="text-sm text-gray-500 mt-1">{booking.dateTime}</p>
        <p className="text-sm text-gray-500 mt-0.5">{booking.vehicle}</p>
        <p className="text-sm text-gray-500 mt-0.5">Washer: {booking.washer}</p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <Badge variant={booking.status} />
        <div className="flex flex-col gap-2 mt-3">
          <Button variant="ghost" size="sm" onClick={onReschedule}>
            Reschedule
          </Button>
          <Button variant="danger" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

interface UpcomingEmptyStateProps {
  onBook: () => void;
}

function UpcomingEmptyState({ onBook }: UpcomingEmptyStateProps) {
  return (
    <div className="border-dashed border-2 border-gray-300 bg-white rounded-xl p-8 text-center">
      <CalendarPlus className="w-8 h-8 text-gray-400 mx-auto" />
      <p className="text-base font-semibold text-gray-900 mt-3">No upcoming bookings</p>
      <p className="text-sm text-gray-500 mt-1">Book your first wash to get started.</p>
      <div className="mt-4 flex justify-center">
        <Button variant="primary" size="sm" onClick={onBook}>
          Book a wash
        </Button>
      </div>
    </div>
  );
}

// ─── Quick book ───────────────────────────────────────────────────────────────

interface QuickServiceCardProps {
  service: WashServiceResponse;
  onBook: () => void;
}

function QuickServiceCard({ service, onBook }: QuickServiceCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onBook}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onBook();
        }
      }}
      className="bg-white rounded-xl border border-gray-200 p-4 hover:border-indigo-300 hover:shadow-sm cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
    >
      <img
        src={SERVICE_IMAGES[service.name] ?? DEFAULT_SERVICE_IMAGE}
        alt={service.name}
        className="w-full mb-3 aspect-video object-cover"
      />
      <p className="text-sm font-semibold text-gray-900">{service.name}</p>
      <div className="flex justify-between items-center mt-1">
        <span className="text-sm text-gray-900">${service.price}</span>
        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
          {service.durationMinutes} min
        </span>
      </div>
      <Button
        variant="primary"
        size="sm"
        className="w-full mt-3"
        onClick={e => {
          e.stopPropagation();
          onBook();
        }}
      >
        Book
      </Button>
    </div>
  );
}

// ─── Vehicle strip ────────────────────────────────────────────────────────────

interface VehicleCardProps {
  vehicle: Vehicle;
}

function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex-shrink-0 w-48">
      <img src="/images/vehicle-overhead.png" alt="Vehicle photo" className="w-full mb-3 aspect-square object-cover" />
      <p className="text-sm font-semibold text-gray-900">
        {vehicle.make} {vehicle.model}
      </p>
      <p className="text-xs text-gray-500 mt-0.5">{vehicle.plate}</p>
    </div>
  );
}

interface AddVehicleCardProps {
  onAdd: () => void;
}

function AddVehicleCard({ onAdd }: AddVehicleCardProps) {
  return (
    <button
      type="button"
      onClick={onAdd}
      className="flex-shrink-0 w-48 bg-white rounded-xl border-2 border-dashed border-gray-300 p-4 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
    >
      <Plus className="w-6 h-6 text-gray-400" />
      <span className="text-xs text-gray-500 mt-1">Add vehicle</span>
    </button>
  );
}

// ─── Recent activity ──────────────────────────────────────────────────────────

interface RecentBookingRowProps {
  booking: RecentBooking;
}

function RecentBookingRow({ booking }: RecentBookingRowProps) {
  return (
    <div className="bg-white px-5 py-4 flex justify-between items-center">
      <div>
        <p className="text-sm font-semibold text-gray-900">{booking.service}</p>
        <p className="text-xs text-gray-500 mt-0.5">{booking.date}</p>
      </div>
      <Badge variant={booking.status} />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ClientHomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: bookings, isLoading, isError } = useMyBookings();
  const { data: vehicles, isLoading: vehiclesLoading } = useMyVehicles();
  const { data: quickServices = [], isLoading: servicesLoading } = useActiveServices();
  const cancelMutation = useCancelBooking();
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  const cancelError = cancelMutation.error
    ? isAxiosError(cancelMutation.error) && cancelMutation.error.response?.data?.message
      ? (cancelMutation.error.response.data.message as string)
      : 'Could not cancel this booking.'
    : null;

  const todayDate = formatAppointmentDate(new Date().toISOString());
  const greeting = getGreeting();

  const rawUpcoming = bookings?.find(
    b => b.status === 'CONFIRMED' || b.status === 'PENDING'
  ) ?? null;

  const upcomingBooking: UpcomingBooking | null = rawUpcoming
    ? {
        id: rawUpcoming.id,
        washServiceId: rawUpcoming.washServiceId,
        service: rawUpcoming.washServiceName,
        dateTime: formatAppointmentDateTime(rawUpcoming.appointmentDateTime),
        vehicle: rawUpcoming.vehicleLicensePlate,
        washer: getAssignedWasherName(rawUpcoming),
        status: STATUS_MAP[rawUpcoming.status],
      }
    : null;

  const recentBookings: RecentBooking[] = (bookings ?? [])
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)
    .map(b => ({
      id: b.id,
      service: b.washServiceName,
      date: formatShortDate(b.createdAt),
      status: STATUS_MAP[b.status],
    }));

  const vehiclesList: Vehicle[] = (vehicles ?? []).map(v => ({
    id: v.id,
    make: v.brand,
    model: v.model,
    plate: v.licensePlate,
  }));

  return (
    <ClientLayout>
      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Section 1 — Greeting */}
        <section>
          <h1 className="text-2xl font-semibold text-gray-900">
            {greeting}, {user?.firstName}
          </h1>
          <p className="text-sm text-gray-500">{todayDate}</p>
        </section>

        {/* Section 2 — Upcoming booking */}
        <section className="mt-6">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
            Upcoming
          </p>
          {isLoading ? (
            <div className="bg-gray-100 rounded-xl h-28 animate-pulse" />
          ) : isError ? (
            <ErrorState message="Could not load bookings." />
          ) : upcomingBooking !== null ? (
            <>
              <UpcomingBookingCard
                booking={upcomingBooking}
                onReschedule={() => setIsRescheduleOpen(true)}
                onCancel={() => setIsCancelOpen(true)}
              />
              {cancelError && (
                <p className="text-sm text-red-600 mt-1">{cancelError}</p>
              )}
            </>
          ) : (
            <UpcomingEmptyState onBook={() => navigate(ROUTES.CLIENT.BOOK)} />
          )}
        </section>

        {/* Section 3 — Quick book */}
        <section className="mt-8">
          <div className="flex justify-between items-center mb-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Quick book
            </p>
            <button
              type="button"
              onClick={() => navigate(ROUTES.CLIENT.BOOK)}
              className="text-sm text-indigo-600 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
            >
              See all services
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {servicesLoading
              ? [0, 1, 2].map(i => (
                  <div key={i} className="bg-gray-100 rounded-xl h-48 animate-pulse" />
                ))
              : quickServices.slice(0, 3).map(service => (
                  <QuickServiceCard
                    key={service.id}
                    service={service}
                    onBook={() => navigate(`${ROUTES.CLIENT.BOOK}?serviceId=${service.id}`)}
                  />
                ))}
          </div>
        </section>

        {/* Section 4 — My vehicles */}
        <section className="mt-8">
          <div className="flex justify-between items-center mb-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              My vehicles
            </p>
            <button
              type="button"
              onClick={() => navigate(ROUTES.CLIENT.VEHICLES)}
              className="text-sm text-indigo-600 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
            >
              Manage vehicles
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {vehiclesLoading ? (
              <>
                {[0, 1, 2].map(i => (
                  <div key={i} className="flex-shrink-0 w-48 h-32 bg-gray-100 animate-pulse rounded-xl" />
                ))}
              </>
            ) : (
              <>
                {vehiclesList.map(vehicle => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
                <AddVehicleCard onAdd={() => navigate(ROUTES.CLIENT.VEHICLES)} />
              </>
            )}
          </div>
        </section>

        {/* Section 5 — Recent activity */}
        <section className="mt-8">
          <div className="flex justify-between items-center mb-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Recent activity
            </p>
            <button
              type="button"
              onClick={() => navigate(ROUTES.CLIENT.BOOKINGS)}
              className="text-sm text-indigo-600 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
            >
              View all
            </button>
          </div>
          {isLoading ? (
            <div className="rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
              {[0, 1, 2].map(i => (
                <div key={i} className="bg-white px-5 py-4 h-14 animate-pulse" />
              ))}
            </div>
          ) : isError ? (
            <ErrorState message="Could not load recent activity." />
          ) : recentBookings.length === 0 ? (
            <p className="text-sm text-gray-500">No recent activity.</p>
          ) : (
            <div className="rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
              {recentBookings.map(booking => (
                <RecentBookingRow key={booking.id} booking={booking} />
              ))}
            </div>
          )}
        </section>
      </main>

      {upcomingBooking && (
        <>
          <RescheduleBookingModal
            isOpen={isRescheduleOpen}
            onClose={() => setIsRescheduleOpen(false)}
            bookingId={upcomingBooking.id}
            washServiceId={upcomingBooking.washServiceId}
          />
          <ConfirmDialog
            isOpen={isCancelOpen}
            onClose={() => setIsCancelOpen(false)}
            onConfirm={() => {
              cancelMutation.mutate(upcomingBooking.id, {
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
        </>
      )}
    </ClientLayout>
  );
}

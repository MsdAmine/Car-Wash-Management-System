import { useState } from 'react';
import { Calendar, Car } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { ErrorState } from '@/shared/components/feedback/ErrorState';
import { ClientLayout } from '@/shared/components/layout/ClientLayout';
import { ROUTES } from '@/router/routes';
import { useMyBookings } from '../hooks/useMyBookings';
import { formatAppointmentDateTime } from '@/shared/lib/formatDate';
import type { BookingResponse } from '../types';

// ─── Types ────────────────────────────────────────────────────────────────────

type BookingStatus = 'pending' | 'confirmed' | 'inProgress' | 'completed' | 'cancelled';
type TabId = 'upcoming' | 'past';

interface Booking {
  id: string;
  ref: string;
  service: string;
  dateTime: string;
  vehicle: string;
  status: BookingStatus;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_MAP: Record<BookingResponse['status'], BookingStatus> = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'inProgress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

const statusBorderClass: Record<BookingStatus, string> = {
  pending: 'border-l-gray-400',
  confirmed: 'border-l-indigo-500',
  inProgress: 'border-l-amber-500',
  completed: 'border-l-green-500',
  cancelled: 'border-l-gray-300',
};

// ─── Booking card bottom ──────────────────────────────────────────────────────

interface BookingCardBottomProps {
  booking: Booking;
}

function BookingCardBottom({ booking }: BookingCardBottomProps) {
  if (booking.status === 'inProgress') {
    return (
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>In progress</span>
          <span>~45 min remaining</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div className="bg-amber-500 rounded-full h-2" style={{ width: '60%' }} />
        </div>
      </div>
    );
  }

  if (booking.status === 'pending' || booking.status === 'confirmed') {
    return (
      <div className="mt-4 flex gap-2">
        <Button variant="ghost" size="sm" onClick={() => console.log('reschedule', booking.id)}>
          Reschedule
        </Button>
        <Button variant="danger" size="sm" onClick={() => console.log('cancel', booking.id)}>
          Cancel
        </Button>
      </div>
    );
  }

  if (booking.status === 'completed') {
    return (
      <div className="mt-4 flex gap-2">
        <Button variant="ghost" size="sm" onClick={() => console.log('book-again', booking.id)}>
          Book again
        </Button>
        <Button variant="ghost" size="sm" onClick={() => console.log('receipt', booking.id)}>
          Receipt
        </Button>
      </div>
    );
  }

  return <p className="mt-4 text-sm text-gray-400 italic">This booking was cancelled.</p>;
}

// ─── Booking card ─────────────────────────────────────────────────────────────

interface BookingCardProps {
  booking: Booking;
}

function BookingCard({ booking }: BookingCardProps) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 border-l-4 ${statusBorderClass[booking.status]} overflow-hidden`}
    >
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-base font-semibold text-gray-900">{booking.service}</p>
            <p className="font-mono text-xs text-gray-500 mt-0.5">{booking.ref}</p>
          </div>
          <Badge variant={booking.status} />
        </div>

        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1">
          <span className="flex items-center gap-1.5 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            {booking.dateTime}
          </span>
          <span className="flex items-center gap-1.5 text-sm text-gray-500">
            <Car className="w-4 h-4" />
            {booking.vehicle}
          </span>
        </div>

        <BookingCardBottom booking={booking} />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ClientBookingsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>('upcoming');
  const { data: bookings, isLoading, isError } = useMyBookings();

  const allBookings: Booking[] = (bookings ?? []).map(b => ({
    id: b.id,
    ref: b.id.slice(-8).toUpperCase(),
    service: b.washServiceName,
    dateTime: formatAppointmentDateTime(b.appointmentDateTime),
    vehicle: b.vehicleLicensePlate,
    status: STATUS_MAP[b.status],
  }));

  const upcomingCount = (bookings ?? []).filter(
    b => b.status === 'PENDING' || b.status === 'CONFIRMED' || b.status === 'IN_PROGRESS'
  ).length;

  const filtered = allBookings.filter(b =>
    activeTab === 'upcoming'
      ? b.status === 'pending' || b.status === 'confirmed' || b.status === 'inProgress'
      : b.status === 'completed' || b.status === 'cancelled'
  );

  return (
    <ClientLayout>
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">My Bookings</h1>
          <Button variant="primary" size="sm" onClick={() => navigate(ROUTES.CLIENT.BOOK)}>
            + New booking
          </Button>
        </div>

        <div className="flex gap-6 border-b border-gray-200 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('upcoming')}
            className={`text-sm px-1 pb-3 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-t ${
              activeTab === 'upcoming'
                ? 'text-indigo-600 border-b-2 border-indigo-600 font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Upcoming
            <span className="ml-2 bg-indigo-100 text-indigo-700 text-xs font-medium px-2 py-0.5 rounded-full">
              {upcomingCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('past')}
            className={`text-sm px-1 pb-3 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-t ${
              activeTab === 'past'
                ? 'text-indigo-600 border-b-2 border-indigo-600 font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Past
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-4">
            {[0, 1, 2].map(i => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 h-32 animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <ErrorState message="Could not load bookings." />
        ) : filtered.length === 0 ? (
          activeTab === 'upcoming' ? (
            <EmptyState
              title="No upcoming bookings"
              subtitle="Book a wash to get started."
              action={{ label: '+ New booking', onClick: () => navigate(ROUTES.CLIENT.BOOK) }}
            />
          ) : (
            <EmptyState
              title="No past bookings"
              subtitle="Your completed bookings will appear here."
            />
          )
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map(booking => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </main>
    </ClientLayout>
  );
}

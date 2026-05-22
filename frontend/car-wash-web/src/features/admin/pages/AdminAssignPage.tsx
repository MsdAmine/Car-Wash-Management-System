import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarClock, ClipboardList, Search, TriangleAlert } from 'lucide-react';
import { AdminLayout } from '@/shared/components/layout/AdminLayout';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { ErrorState } from '@/shared/components/feedback/ErrorState';
import { LoadingSpinner } from '@/shared/components/feedback/LoadingSpinner';
import { formatAppointmentDateTime } from '@/shared/lib/formatDate';
import { ROUTES } from '@/router/routes';
import { AssignJobModal } from '@/features/bookings/components/AssignJobModal';
import { useAllBookings } from '@/features/admin/hooks/useAllBookings';
import type { BookingResponse } from '@/features/bookings/types';

function isAssignableBooking(booking: BookingResponse): boolean {
  return (
    booking.assignedEmployeeId === null &&
    (booking.status === 'PENDING' || booking.status === 'CONFIRMED')
  );
}

function isSameDay(isoString: string, target: Date): boolean {
  const date = new Date(isoString);
  return (
    date.getFullYear() === target.getFullYear() &&
    date.getMonth() === target.getMonth() &&
    date.getDate() === target.getDate()
  );
}

function getBookingRef(bookingId: string): string {
  return bookingId.slice(-8).toUpperCase();
}

function getPriorityMeta(booking: BookingResponse): { label: string; classes: string } {
  const appointment = new Date(booking.appointmentDateTime);
  const now = new Date();
  const diffMs = appointment.getTime() - now.getTime();

  if (diffMs < 0) {
    return {
      label: 'Past due',
      classes: 'bg-red-100 text-red-700',
    };
  }

  if (isSameDay(booking.appointmentDateTime, now)) {
    return {
      label: 'Today',
      classes: 'bg-amber-100 text-amber-800',
    };
  }

  if (diffMs <= 24 * 60 * 60 * 1000) {
    return {
      label: 'Next 24h',
      classes: 'bg-blue-100 text-blue-700',
    };
  }

  return {
    label: 'Upcoming',
    classes: 'bg-gray-100 text-gray-700',
  };
}

function statusToVariant(
  status: BookingResponse['status'],
): 'pending' | 'confirmed' | 'inProgress' | 'completed' | 'cancelled' {
  switch (status) {
    case 'IN_PROGRESS': return 'inProgress';
    case 'CONFIRMED': return 'confirmed';
    case 'COMPLETED': return 'completed';
    case 'CANCELLED': return 'cancelled';
    default: return 'pending';
  }
}

function buildAssignBooking(booking: BookingResponse) {
  return {
    ref: getBookingRef(booking.id),
    service: booking.washServiceName,
    datetime: new Date(booking.appointmentDateTime).toLocaleString(),
    appointmentDateTime: booking.appointmentDateTime,
    durationMinutes: booking.durationMinutes,
  };
}

interface StatCardProps {
  label: string;
  value: number;
  tone?: 'default' | 'warning';
}

function StatCard({ label, value, tone = 'default' }: StatCardProps) {
  const toneClass = tone === 'warning'
    ? 'bg-amber-50 border-amber-100'
    : 'bg-white border-gray-200';

  return (
    <Card className={toneClass}>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900 tabular-nums">{value}</p>
    </Card>
  );
}

export function AdminAssignPage() {
  const { data: bookings, isLoading, isError } = useAllBookings();
  const [query, setQuery] = useState('');
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [assignModal, setAssignModal] = useState<{
    isOpen: boolean;
    booking: {
      ref: string;
      service: string;
      datetime: string;
      appointmentDateTime: string;
      durationMinutes: number;
    } | null;
    bookingId: string | null;
  }>({ isOpen: false, booking: null, bookingId: null });

  const assignableBookings = (bookings ?? [])
    .filter(isAssignableBooking)
    .sort(
      (a, b) =>
        new Date(a.appointmentDateTime).getTime() - new Date(b.appointmentDateTime).getTime(),
    );

  const trimmedQuery = query.trim().toLowerCase();
  const filteredBookings = assignableBookings.filter((booking) => {
    if (!trimmedQuery) return true;

    return (
      booking.customerEmail.toLowerCase().includes(trimmedQuery) ||
      booking.vehicleLicensePlate.toLowerCase().includes(trimmedQuery) ||
      booking.washServiceName.toLowerCase().includes(trimmedQuery) ||
      getBookingRef(booking.id).toLowerCase().includes(trimmedQuery)
    );
  });

  useEffect(() => {
    if (filteredBookings.length === 0) {
      if (selectedBookingId !== null) {
        setSelectedBookingId(null);
      }
      return;
    }

    const selectionStillVisible = filteredBookings.some((booking) => booking.id === selectedBookingId);
    if (!selectionStillVisible) {
      setSelectedBookingId(filteredBookings[0].id);
    }
  }, [filteredBookings, selectedBookingId]);

  const selectedBooking = filteredBookings.find((booking) => booking.id === selectedBookingId) ?? null;
  const now = new Date();
  const todayCount = assignableBookings.filter((booking) => isSameDay(booking.appointmentDateTime, now)).length;
  const confirmedCount = assignableBookings.filter((booking) => booking.status === 'CONFIRMED').length;
  const overdueCount = assignableBookings.filter(
    (booking) => new Date(booking.appointmentDateTime).getTime() < now.getTime(),
  ).length;

  function handleAssignClick(booking: BookingResponse) {
    setAssignModal({
      isOpen: true,
      booking: buildAssignBooking(booking),
      bookingId: booking.id,
    });
  }

  const topBar = (
    <>
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Assign Jobs</h1>
      </div>
      <Link
        to={ROUTES.ADMIN.BOOKINGS}
        className="inline-flex items-center justify-center rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-200 transition-colors hover:bg-gray-50"
      >
        View all bookings
      </Link>
    </>
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

  if (isError || !bookings) {
    return (
      <AdminLayout topBar={topBar}>
        <div className="flex justify-center py-20">
          <ErrorState message="Could not load assignment queue." />
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <AdminLayout topBar={topBar}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Unassigned queue" value={assignableBookings.length} />
          <StatCard label="Due today" value={todayCount} />
          <StatCard label="Confirmed only" value={confirmedCount} />
          <StatCard label="Past due" value={overdueCount} tone="warning" />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_24rem]">
          <Card padding="none" className="overflow-hidden">
            <div className="border-b border-gray-200 px-5 py-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">Assignment queue</h2>
                  <p className="text-sm text-gray-500">Choose a booking, then assign an available washer.</p>
                </div>
                <div className="relative w-full max-w-xs">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search email, ref, plate, service"
                    className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {filteredBookings.length === 0 ? (
                <div className="px-6 py-14">
                  <EmptyState
                    title={assignableBookings.length === 0 ? 'No jobs waiting for assignment' : 'No matching jobs'}
                    subtitle={
                      assignableBookings.length === 0
                        ? 'All pending and confirmed bookings currently have washers assigned.'
                        : 'Try a different search term.'
                    }
                  />
                </div>
              ) : (
                filteredBookings.map((booking) => {
                  const priority = getPriorityMeta(booking);
                  const isSelected = booking.id === selectedBookingId;

                  return (
                    <button
                      key={booking.id}
                      type="button"
                      onClick={() => setSelectedBookingId(booking.id)}
                      className={`w-full px-5 py-4 text-left transition-colors ${
                        isSelected ? 'bg-indigo-50' : 'bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-mono text-xs font-semibold tracking-wide text-gray-500">
                              {getBookingRef(booking.id)}
                            </p>
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${priority.classes}`}>
                              {priority.label}
                            </span>
                          </div>
                          <p className="mt-2 text-sm font-semibold text-gray-900">{booking.customerEmail}</p>
                          <p className="mt-1 text-sm text-gray-600">
                            {booking.washServiceName} · {booking.vehicleLicensePlate}
                          </p>
                          <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                            <CalendarClock className="h-4 w-4" />
                            <span>{formatAppointmentDateTime(booking.appointmentDateTime)}</span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <Badge variant={statusToVariant(booking.status)} />
                          <span className="text-xs text-gray-500">{booking.durationMinutes} min</span>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </Card>

          <Card className="h-fit xl:sticky xl:top-6" padding="lg">
            {!selectedBooking ? (
              <div className="py-10">
                <EmptyState
                  title="Select a booking"
                  subtitle="Pick a queue item to review its details and assign a washer."
                />
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-xs font-semibold tracking-wide text-gray-500">
                      {getBookingRef(selectedBooking.id)}
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-gray-900">Booking details</h2>
                    <p className="mt-1 text-sm text-gray-500">{selectedBooking.customerEmail}</p>
                  </div>
                  <Badge variant={statusToVariant(selectedBooking.status)} />
                </div>

                <div className="mt-6 space-y-4">
                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Service</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">{selectedBooking.washServiceName}</p>
                    <p className="mt-1 text-sm text-gray-500">Vehicle plate: {selectedBooking.vehicleLicensePlate}</p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Appointment</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {formatAppointmentDateTime(selectedBooking.appointmentDateTime)}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">Duration: {selectedBooking.durationMinutes} minutes</p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Notes</p>
                    <p className="mt-1 text-sm text-gray-700">
                      {selectedBooking.notes?.trim() || 'No notes were added for this booking.'}
                    </p>
                  </div>

                  <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                    <div className="flex items-start gap-3">
                      <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                      <div>
                        <p className="text-sm font-semibold text-red-900">Assignment required</p>
                        <p className="mt-1 text-sm text-red-700">
                          This booking still has no washer assigned. Use the action below to see available staff for this slot.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <Button onClick={() => handleAssignClick(selectedBooking)}>
                    <ClipboardList className="h-4 w-4" />
                    Assign washer
                  </Button>
                  <Link
                    to={ROUTES.ADMIN.BOOKING_DETAIL(selectedBooking.id)}
                    className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Open booking details
                  </Link>
                </div>
              </>
            )}
          </Card>
        </div>
      </AdminLayout>

      <AssignJobModal
        isOpen={assignModal.isOpen}
        onClose={() => setAssignModal((prev) => ({ ...prev, isOpen: false }))}
        booking={assignModal.booking}
        bookingId={assignModal.bookingId}
      />
    </>
  );
}

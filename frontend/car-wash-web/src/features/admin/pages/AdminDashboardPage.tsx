import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { AdminLayout } from '@/shared/components/layout/AdminLayout';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';
import { ErrorState } from '@/shared/components/feedback/ErrorState';
import { ROUTES } from '@/router/routes';
import { useAdminDashboard } from '@/features/admin/hooks/useAdminDashboard';
import { useAllBookings } from '@/features/admin/hooks/useAllBookings';
import { useRevenueTimeSeries } from '@/features/admin/hooks/useRevenueTimeSeries';
import { AssignJobModal } from '@/features/bookings/components/AssignJobModal';
import { AdminNewBookingModal } from '@/features/bookings/components/AdminNewBookingModal';
import type { BookingResponse } from '@/features/bookings/types';

// ─── Sub-components ───────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  trend: string;
  prefix?: string;
}

function StatCard({ label, value, trend, prefix }: StatCardProps) {
  return (
    <div className="bg-white border-gray-200 rounded-xl border p-5">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-semibold text-gray-900 mt-2 leading-none tabular-nums">
        {prefix}{value}
      </p>
      <p className="text-xs text-gray-500 mt-2">{trend}</p>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <>
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
            <div className="h-7 w-14 bg-gray-100 rounded animate-pulse mt-3" />
            <div className="h-3 w-24 bg-gray-100 rounded animate-pulse mt-2" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
          <div className="h-3 w-16 bg-gray-100 rounded animate-pulse ml-2" />
        </div>
        <div className="w-full h-64 bg-gray-100 rounded-lg animate-pulse" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <div className="h-4 w-32 bg-gray-100 rounded animate-pulse mb-4" />
          <div className="flex flex-col divide-y divide-gray-100">
            {[0, 1, 2].map(i => (
              <div key={i} className="py-3 flex items-center gap-3">
                <div className="flex-1">
                  <div className="h-3.5 w-40 bg-gray-100 rounded animate-pulse" />
                  <div className="h-3 w-32 bg-gray-100 rounded animate-pulse mt-1.5" />
                </div>
                <div className="h-6 w-20 bg-gray-100 rounded-full animate-pulse shrink-0" />
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-1 bg-white rounded-xl border border-gray-200 p-5">
          <div className="h-4 w-28 bg-gray-100 rounded animate-pulse mb-4" />
          <div className="flex flex-col divide-y divide-gray-100">
            {[0, 1].map(i => (
              <div key={i} className="py-3">
                <div className="h-3 w-full bg-gray-100 rounded animate-pulse mb-2" />
                <div className="h-3 w-3/4 bg-gray-100 rounded animate-pulse mb-3" />
                <div className="h-7 w-full bg-gray-100 rounded-lg animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function RevenueChart() {
  const { data: revenueData, isLoading, isError } = useRevenueTimeSeries('daily', 7);

  const chartData = revenueData ?? [];
  const maxRevenue = Math.max(...chartData.map((d) => d.revenue), 1);
  const leftPad = 42;
  const chartWidth = 700;
  const slotWidth = (chartWidth - leftPad) / Math.max(chartData.length, 1);
  const barWidth = 52;
  const maxBarHeight = 145;
  const barsBottom = 172;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 mb-8">
      <div className="flex items-center mb-4">
        <h2 className="text-base font-semibold text-gray-900">Revenue</h2>
        <span className="ml-2 text-sm text-gray-400">Last 7 days</span>
      </div>

      <div className="w-full h-64">
        {isLoading ? (
          <div className="w-full h-full bg-gray-100 animate-pulse rounded-lg" />
        ) : isError ? (
          <div className="w-full h-full flex items-center justify-center">
            <ErrorState message="Could not load revenue data." />
          </div>
        ) : chartData.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-sm text-gray-500">No revenue data available yet.</p>
          </div>
        ) : (
          <svg
            viewBox="0 0 700 195"
            preserveAspectRatio="none"
            className="w-full h-full"
            aria-label="Revenue bar chart"
            role="img"
          >
            {[0.25, 0.5, 0.75, 1].map((pct) => {
              const y = barsBottom - pct * maxBarHeight;
              const val = Math.round(pct * maxRevenue);
              return (
                <g key={pct}>
                  <line x1={leftPad} y1={y} x2={chartWidth} y2={y} stroke="#f3f4f6" strokeWidth={1} />
                  <text x={leftPad - 5} y={y + 4} fontSize="10" fill="#9ca3af" textAnchor="end">${val}</text>
                </g>
              );
            })}

            <line x1={leftPad} y1={barsBottom} x2={chartWidth} y2={barsBottom} stroke="#e5e7eb" strokeWidth={1} />

            {chartData.map((d, i) => {
              const barHeight = (d.revenue / maxRevenue) * maxBarHeight;
              const barX = leftPad + i * slotWidth + (slotWidth - barWidth) / 2;
              const barY = barsBottom - barHeight;
              const labelX = leftPad + i * slotWidth + slotWidth / 2;

              return (
                <g key={d.label}>
                  <rect x={barX} y={barY} width={barWidth} height={barHeight} fill="#4F46E5" rx="4" />
                  <text x={labelX} y={barY - 5} fontSize="10" fill="#6B7280" textAnchor="middle">${d.revenue}</text>
                  <text x={labelX} y={barsBottom + 15} fontSize="11" fill="#6B7280" textAnchor="middle">{d.label}</text>
                </g>
              );
            })}
          </svg>
        )}
      </div>
    </div>
  );
}

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

interface ActiveBookingsListProps {
  bookings: BookingResponse[];
}

function ActiveBookingsList({ bookings }: ActiveBookingsListProps) {
  const active = bookings.filter(
    (b) => b.status === 'CONFIRMED' || b.status === 'IN_PROGRESS',
  );

  return (
    <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-base font-semibold text-gray-900">Active bookings</h2>
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium">
          {active.length}
        </span>
      </div>

      <div className="flex flex-col divide-y divide-gray-100">
        {active.length === 0 ? (
          <p className="text-sm text-gray-500 py-4">No active bookings right now.</p>
        ) : active.map((booking) => (
          <div key={booking.id} className="py-3 flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900 truncate">{booking.customerEmail}</p>
              <p className="font-mono text-xs text-gray-500 truncate">
                {booking.id.slice(-8).toUpperCase()} &middot; {booking.washServiceName}
              </p>
            </div>
            <p className="text-sm text-gray-500 shrink-0">
              {new Date(booking.appointmentDateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </p>
            <div className="flex items-center gap-3 shrink-0">
              <Link to={ROUTES.ADMIN.BOOKING_DETAIL(booking.id)} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                View details
              </Link>
              <Badge variant={statusToVariant(booking.status)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface UnassignedStripProps {
  bookings: BookingResponse[];
  onAssign: (booking: BookingResponse) => void;
}

function UnassignedStrip({ bookings, onAssign }: UnassignedStripProps) {
  const unassigned = bookings.filter((b) => b.status === 'PENDING');

  const hasUrgent = unassigned.length > 0;

  return (
    <div className="col-span-1 bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className={`w-4 h-4 shrink-0 ${hasUrgent ? 'text-amber-500' : 'text-gray-400'}`} />
        <h2 className="text-sm font-semibold text-gray-900">Needs assignment</h2>
        {hasUrgent && (
          <span className="ml-auto inline-flex items-center justify-center h-5 rounded-full bg-red-50 text-red-700 text-xs font-semibold px-2">
            {unassigned.length}
          </span>
        )}
      </div>

      <div className="flex flex-col divide-y divide-gray-100">
        {unassigned.map((item) => (
          <div key={item.id} className="py-3 first:pt-0">
            <p className="font-mono text-xs text-gray-400">{item.id.slice(-8).toUpperCase()}</p>
            <p className="text-sm text-gray-900">{item.customerEmail} &middot; {item.washServiceName}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {new Date(item.appointmentDateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </p>
            <Button
              variant="primary"
              size="sm"
              className="w-full mt-2"
              onClick={() => onAssign(item)}
            >
              Assign washer
            </Button>
          </div>
        ))}

        {unassigned.length === 0 && (
          <p className="text-sm text-gray-500">All bookings are assigned.</p>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function AdminDashboardPage() {
  const { data: dashboard, isLoading: dashLoading, isError: dashError } = useAdminDashboard();
  const { data: bookings, isLoading: bookingsLoading, isError: bookingsError } = useAllBookings();

  const [assignModal, setAssignModal] = useState<{
    isOpen: boolean;
    booking: { ref: string; service: string; datetime: string; appointmentDateTime: string; durationMinutes: number } | null;
    bookingId: string | null;
  }>({ isOpen: false, booking: null, bookingId: null });

  const [newBookingOpen, setNewBookingOpen] = useState(false);

  function handleOpenAssign(booking: BookingResponse) {
    const ref = booking.id.slice(-8).toUpperCase();
    setAssignModal({
      isOpen: true,
      booking: {
        ref,
        service: booking.washServiceName,
        datetime: new Date(booking.appointmentDateTime).toLocaleString(),
        appointmentDateTime: booking.appointmentDateTime,
        durationMinutes: booking.durationMinutes,
      },
      bookingId: booking.id,
    });
  }

  const isLoading = dashLoading || bookingsLoading;
  const isError = dashError || bookingsError;

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const topBar = (
    <>
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <span className="text-sm text-gray-400">{today}</span>
      </div>
      <Button size="sm" onClick={() => setNewBookingOpen(true)}>
        New booking
      </Button>
    </>
  );

  if (isLoading) {
    return (
      <AdminLayout topBar={topBar}>
        <DashboardSkeleton />
      </AdminLayout>
    );
  }

  if (isError || !dashboard || !bookings) {
    return (
      <AdminLayout topBar={topBar}>
        <div className="flex justify-center py-20">
          <ErrorState message="Could not load dashboard data." />
        </div>
      </AdminLayout>
    );
  }

  const activeWashCount = bookings.filter((b) => b.status === 'IN_PROGRESS').length;

  return (
    <>
      <AdminLayout topBar={topBar}>
        {/* Section 1 — Stat cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Today's Bookings"
            value={dashboard.todaysBookings}
            trend="Confirmed & pending"
          />
          <StatCard
            label="Revenue Today"
            value={dashboard.dailyRevenue}
            trend="Collected today"
            prefix="$"
          />
          <StatCard
            label="Active Washes"
            value={activeWashCount}
            trend="In progress"
          />
          {/* TODO: distinct staff-on-duty count not available from API */}
          <StatCard
            label="Pending Bookings"
            value={dashboard.pendingBookings}
            trend="Awaiting assignment"
          />
        </div>

        {/* Section 2 — Revenue chart */}
        <RevenueChart />

        {/* Section 3 — Active bookings + Unassigned strip */}
        <div className="grid grid-cols-3 gap-4">
          <ActiveBookingsList bookings={bookings} />
          <UnassignedStrip bookings={bookings} onAssign={handleOpenAssign} />
        </div>
      </AdminLayout>

      <AssignJobModal
        isOpen={assignModal.isOpen}
        onClose={() => setAssignModal((prev) => ({ ...prev, isOpen: false }))}
        booking={assignModal.booking}
        bookingId={assignModal.bookingId}
      />

      <AdminNewBookingModal
        isOpen={newBookingOpen}
        onClose={() => setNewBookingOpen(false)}
      />
    </>
  );
}

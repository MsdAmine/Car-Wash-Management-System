import { Bell, Car, CheckCircle2, Clock, Droplets, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/shared/components/ui/Badge';
import { WasherLayout } from '@/shared/components/layout/WasherLayout';
import { ErrorState } from '@/shared/components/feedback/ErrorState';
import { useAuth } from '@/shared/context/AuthContext';
import { useMyJobsToday } from '../hooks/useMyJobsToday';
import { ROUTES } from '@/router/routes';
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

const LEFT_BORDER: Record<BookingResponse['status'], string> = {
  PENDING: 'border-l-gray-400',
  CONFIRMED: 'border-l-indigo-500',
  IN_PROGRESS: 'border-l-amber-500',
  COMPLETED: 'border-l-gray-200',
  CANCELLED: 'border-l-red-300',
};

function extractTime(isoString: string): string {
  return isoString.slice(11, 16);
}

// ─── JobCardSkeleton ──────────────────────────────────────────────────────────

function JobCardSkeleton() {
  return <div className="bg-white rounded-xl h-24 animate-pulse border border-gray-100" />;
}

// ─── JobCard ──────────────────────────────────────────────────────────────────

interface JobCardProps {
  booking: BookingResponse;
  onClick: () => void;
}

function JobCard({ booking, onClick }: JobCardProps) {
  return (
    <button
      type="button"
      className={`w-full text-left bg-white rounded-xl border border-gray-200 border-l-4 ${LEFT_BORDER[booking.status]} overflow-hidden p-4 hover:shadow-sm transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <span className="font-mono text-xs text-gray-500">
          {booking.id.slice(-8).toUpperCase()}
        </span>
        <Badge variant={STATUS_TO_BADGE[booking.status]} />
      </div>

      <div className="mt-2">
        <p className="text-sm font-semibold text-gray-900">{booking.customerEmail}</p>
        <div className="flex gap-3 mt-1 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Car className="w-3 h-3" />
            {booking.vehicleLicensePlate}
          </span>
          <span className="flex items-center gap-1">
            <Droplets className="w-3 h-3" />
            {booking.washServiceName}
          </span>
        </div>
        <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          {extractTime(booking.appointmentDateTime)}
        </div>
      </div>

      {booking.status === 'IN_PROGRESS' && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>In progress</span>
          </div>
          <div className="bg-gray-100 h-2 rounded-full">
            <div className="bg-amber-500 h-2 rounded-full w-3/5" />
          </div>
        </div>
      )}
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function WasherJobsPage() {
  const { user } = useAuth();
  const { data: bookings, isLoading, isError } = useMyJobsToday();
  const navigate = useNavigate();

  const activeJobs = bookings?.filter(
    b => b.status === 'CONFIRMED' || b.status === 'IN_PROGRESS',
  ) ?? [];
  const completedJobs = bookings?.filter(b => b.status === 'COMPLETED') ?? [];
  const hasAssignedJobs = (bookings?.length ?? 0) > 0;

  return (
    <WasherLayout>
      <>
        <header className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img src="/images/avatar-washer.png" alt="Avatar" className="w-10 h-10 rounded-full flex-shrink-0 object-cover" />
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">Car Washer</p>
              </div>
            </div>
            <button
              type="button"
              aria-label="Notifications"
              className="text-gray-500 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
            >
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="px-4 py-3 bg-white border-b border-gray-200">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs…"
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        <div className="px-4 pt-4">
          {isLoading ? (
            <div className="flex flex-col gap-3">
              <JobCardSkeleton />
              <JobCardSkeleton />
              <JobCardSkeleton />
            </div>
          ) : isError ? (
            <div className="py-12">
              <ErrorState message="Could not load today's jobs." />
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Today's jobs
                </span>
                <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2 py-0.5 rounded-full">
                  {activeJobs.length}
                </span>
              </div>

              {activeJobs.length === 0 ? (
                <div className="py-12">
                  <CheckCircle2 className="w-10 h-10 text-gray-300 mx-auto" />
                  <p className="text-sm font-medium text-gray-500 mt-3 text-center">
                    {hasAssignedJobs ? 'No active jobs left' : 'No jobs assigned for today'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 text-center max-w-56 mx-auto">
                    {hasAssignedJobs
                      ? 'Completed jobs are listed below for reference.'
                      : 'Assigned jobs will appear here when an admin schedules them.'}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {activeJobs.map(booking => (
                    <JobCard
                      key={booking.id}
                      booking={booking}
                      onClick={() => navigate(ROUTES.WASHER.JOB_DETAIL(booking.id))}
                    />
                  ))}
                </div>
              )}

              {completedJobs.length > 0 && (
                <div className="mt-6 opacity-50">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Completed today
                    </span>
                    <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2 py-0.5 rounded-full">
                      {completedJobs.length}
                    </span>
                  </div>
                  <div className="flex flex-col gap-3">
                    {completedJobs.map(booking => (
                      <JobCard
                        key={booking.id}
                        booking={booking}
                        onClick={() => navigate(ROUTES.WASHER.JOB_DETAIL(booking.id))}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </>
    </WasherLayout>
  );
}

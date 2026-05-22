import { useState } from 'react';
import { Bell, Car, CheckCircle2, Clock, Search } from 'lucide-react';
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


function extractTime(isoString: string): string {
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return '--:--';
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
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
  const isActive = booking.status === 'IN_PROGRESS';

  return (
    <button
      type="button"
      className={`w-full text-left rounded-xl border overflow-hidden p-4 hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 ${
        isActive ? 'bg-white border-amber-200' : 'bg-white border-gray-200'
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <span className="font-mono text-xs text-gray-400">
          {booking.id.slice(-8).toUpperCase()}
        </span>
        <Badge variant={STATUS_TO_BADGE[booking.status]} />
      </div>

      <div className="mt-2">
        <p className="text-base font-semibold text-gray-900">{booking.washServiceName}</p>
        <div className="flex gap-3 mt-1 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Car className="w-3 h-3" />
            {booking.vehicleLicensePlate}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {extractTime(booking.appointmentDateTime)}
          </span>
        </div>
      </div>

    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function WasherJobsPage() {
  const { user } = useAuth();
  const { data: bookings, isLoading, isError } = useMyJobsToday();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const filtered = query.trim()
    ? (bookings ?? []).filter(b => {
        const q = query.toLowerCase();
        return (
          b.vehicleLicensePlate.toLowerCase().includes(q) ||
          b.washServiceName.toLowerCase().includes(q) ||
          b.id.slice(-8).toLowerCase().includes(q)
        );
      })
    : (bookings ?? []);

  const activeJobs = filtered.filter(
    b => b.status === 'CONFIRMED' || b.status === 'IN_PROGRESS',
  );
  const completedJobs = filtered.filter(b => b.status === 'COMPLETED');
  const hasAssignedJobs = (bookings?.length ?? 0) > 0;

  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase() || '?';

  return (
    <WasherLayout>
      <header className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                <span className="text-xs font-semibold text-indigo-700">{initials}</span>
                <img
                  src="/images/avatar-washer.png"
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={e => { (e.currentTarget as HTMLImageElement).remove(); }}
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">Washer</p>
              </div>
            </div>
            <button
              type="button"
              aria-label="Notifications"
              className="text-gray-500 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
              onClick={() => navigate(ROUTES.WASHER.ALERTS)}
            >
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="px-4 py-3 bg-white border-b border-gray-200">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by plate or service…"
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
                    {query.trim()
                      ? 'No jobs match your search'
                      : hasAssignedJobs
                        ? 'No active jobs left'
                        : 'No jobs assigned for today'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 text-center max-w-56 mx-auto">
                    {query.trim()
                      ? 'Try a different customer name, plate, or service.'
                      : hasAssignedJobs
                        ? 'Completed jobs are shown below.'
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
    </WasherLayout>
  );
}

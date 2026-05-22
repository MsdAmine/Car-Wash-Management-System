import { Bell, CheckCircle2, Clock3, Sparkles, TriangleAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/router/routes';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { WasherLayout } from '@/shared/components/layout/WasherLayout';
import { Badge } from '@/shared/components/ui/Badge';
import { Card } from '@/shared/components/ui/Card';
import { ErrorState } from '@/shared/components/feedback/ErrorState';
import { useMyBookingHistory } from '../hooks/useMyBookingHistory';
import { useMyJobsToday } from '../hooks/useMyJobsToday';
import type { BookingResponse } from '../types';

type AlertTone = 'info' | 'warning' | 'success';

interface WasherAlert {
  id: string;
  title: string;
  detail: string;
  timeLabel: string;
  tone: AlertTone;
}

function toTimeLabel(isoString: string): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return 'Unknown time';
  }

  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function toOptionalTimeLabel(isoString: string | null): string {
  return isoString ? toTimeLabel(isoString) : 'recently';
}

function buildAlerts(
  todaysJobs: BookingResponse[] | undefined,
  history: BookingResponse[] | undefined,
): WasherAlert[] {
  const current = todaysJobs ?? [];
  const completedHistory = history ?? [];

  const inProgressAlerts = current
    .filter((job) => job.status === 'IN_PROGRESS')
    .map((job) => ({
      id: `progress-${job.id}`,
      title: 'Wash in progress',
      detail: `${job.vehicleLicensePlate} is currently being washed for ${job.customerEmail}.`,
      timeLabel: `Started ${job.startedAt ? toTimeLabel(job.startedAt) : 'recently'}`,
      tone: 'warning' as const,
    }));

  const readyAlerts = current
    .filter((job) => job.status === 'CONFIRMED')
    .sort((a, b) => a.appointmentDateTime.localeCompare(b.appointmentDateTime))
    .slice(0, 3)
    .map((job) => ({
      id: `ready-${job.id}`,
      title: 'Ready to start',
      detail: `${job.washServiceName} for ${job.vehicleLicensePlate} is scheduled today.`,
      timeLabel: `Appointment ${toTimeLabel(job.appointmentDateTime)}`,
      tone: 'info' as const,
    }));

  const completionAlerts = completedHistory
    .slice(0, 2)
    .map((job) => ({
      id: `done-${job.id}`,
      title: 'Completion recorded',
      detail: `${job.washServiceName} for ${job.vehicleLicensePlate} was completed successfully.`,
      timeLabel: `Finished ${toOptionalTimeLabel(job.endDateTime)}`,
      tone: 'success' as const,
    }));

  return [...inProgressAlerts, ...readyAlerts, ...completionAlerts];
}

function toneClasses(tone: AlertTone): string {
  if (tone === 'warning') {
    return 'border-amber-200 bg-amber-50/70';
  }
  if (tone === 'success') {
    return 'border-green-200 bg-green-50/70';
  }
  return 'border-blue-200 bg-blue-50/70';
}

function toneIcon(tone: AlertTone) {
  if (tone === 'warning') {
    return <TriangleAlert className="w-5 h-5 text-amber-600" />;
  }
  if (tone === 'success') {
    return <CheckCircle2 className="w-5 h-5 text-green-600" />;
  }
  return <Bell className="w-5 h-5 text-blue-600" />;
}

export function WasherAlertsPage() {
  const navigate = useNavigate();
  const {
    data: todaysJobs,
    isLoading: jobsLoading,
    isError: jobsError,
  } = useMyJobsToday();
  const {
    data: history,
    isLoading: historyLoading,
    isError: historyError,
  } = useMyBookingHistory();

  const isLoading = jobsLoading || historyLoading;
  const isError = jobsError || historyError;
  const alerts = buildAlerts(todaysJobs, history);
  const hasAnyAssignments = (todaysJobs?.length ?? 0) > 0 || (history?.length ?? 0) > 0;

  return (
    <WasherLayout>
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-lg font-semibold text-gray-900">Alerts</p>
            <p className="text-sm text-gray-500 mt-1">
              Live updates from your assigned washes and recent completions.
            </p>
          </div>
          <div className="flex-shrink-0 whitespace-nowrap">
            <Badge variant="confirmed" label={`${alerts.length} items`} />
          </div>
        </div>
      </header>

      <div className="px-4 py-4 flex flex-col gap-4">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-28 rounded-xl border border-gray-200 bg-white animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="py-12">
            <ErrorState message="Could not load washer alerts." />
          </div>
        ) : alerts.length === 0 ? (
          <>
            <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900 text-white border-0" padding="lg">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-sky-200">Queue status</p>
                  <p className="text-2xl font-semibold mt-2">{(todaysJobs ?? []).length} assigned today</p>
                  <p className="text-sm text-slate-200 mt-2">
                    {(todaysJobs ?? []).filter((job) => job.status === 'IN_PROGRESS').length} active and {(todaysJobs ?? []).filter((job) => job.status === 'CONFIRMED').length} ready to start.
                  </p>
                </div>
                <Sparkles className="w-5 h-5 text-sky-200 flex-shrink-0" />
              </div>
            </Card>
            <Card padding="lg">
              <EmptyState
                title={hasAnyAssignments ? 'You are all caught up' : 'No washer alerts yet'}
                subtitle={
                  hasAnyAssignments
                    ? 'There are no active washes or start-ready jobs needing attention right now.'
                    : 'Alerts will appear here after jobs are assigned or completed.'
                }
                action={{
                  label: 'View jobs',
                  onClick: () => navigate(ROUTES.WASHER.HOME),
                }}
              />
            </Card>
          </>
        ) : (
          <div className="flex flex-col gap-3">
            {alerts.map((alert) => (
              <Card key={alert.id} className={toneClasses(alert.tone)} padding="md">
                <div className="flex gap-3">
                  <div className="mt-0.5">{toneIcon(alert.tone)}</div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-gray-900">{alert.title}</p>
                      <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                        <Clock3 className="w-3 h-3" />
                        {alert.timeLabel}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{alert.detail}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </WasherLayout>
  );
}

import { useState } from 'react';
import { CheckCircle2, ChevronLeft } from 'lucide-react';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { ImagePlaceholder } from '@/shared/components/ui/ImagePlaceholder';
import { WasherLayout } from '@/shared/components/layout/WasherLayout';

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_JOB = {
  id: '1',
  ref: 'CW-000101',
  client: 'Alex Morgan',
  clientPhone: '+1 555 0192',
  vehicle: { make: 'Toyota', model: 'Camry', plate: 'ABC-1234' },
  service: 'Full Detail',
  date: 'Monday, 19 May 2025',
  time: '10:00',
  duration: 90,
  status: 'inProgress' as const,
};

// ─── Types ────────────────────────────────────────────────────────────────────

type JobStatus = 'confirmed' | 'inProgress' | 'completed';

// ─── InfoRow ──────────────────────────────────────────────────────────────────

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-900 font-medium">{value}</span>
    </div>
  );
}

// ─── ActionArea ───────────────────────────────────────────────────────────────

interface ActionAreaProps {
  status: JobStatus;
  onAction: () => void;
}

function ActionArea({ status, onAction }: ActionAreaProps) {
  if (status === 'completed') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
        <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto" />
        <p className="text-sm font-semibold text-green-700 mt-1">Wash completed</p>
      </div>
    );
  }

  return (
    <Button variant="primary" size="lg" className="w-full" onClick={onAction}>
      {status === 'confirmed' ? 'Start wash' : 'Mark as complete'}
    </Button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function WasherJobDetailPage() {
  const [status, setStatus] = useState<JobStatus>(MOCK_JOB.status);

  function handleAction() {
    if (status === 'confirmed') setStatus('inProgress');
    else if (status === 'inProgress') setStatus('completed');
  }

  // WasherLayout's BottomNav shows on this page — intentional for static pass; revisit in hooks pass
  return (
    <WasherLayout>
      <>
        <header className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Go back"
              className="text-gray-500 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
              onClick={() => console.log('go back')}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <p className="text-sm font-semibold text-gray-900">Job {MOCK_JOB.ref}</p>
          </div>
        </header>

        <div className="px-4 pt-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Badge variant={status} />
            <span className="font-mono text-xs text-gray-500">{MOCK_JOB.ref}</span>
          </div>

          {/* Booking info */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
              Booking info
            </p>
            <div className="flex flex-col gap-2">
              <InfoRow label="Date" value={MOCK_JOB.date} />
              <InfoRow label="Time" value={MOCK_JOB.time} />
              <InfoRow label="Service" value={MOCK_JOB.service} />
              <InfoRow label="Duration" value={`${MOCK_JOB.duration} min`} />
            </div>
            {status === 'inProgress' && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-1">In progress</p>
                <div className="bg-gray-100 h-2 rounded-full">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '60%' }} />
                </div>
                <p className="text-xs text-gray-400 mt-1">~45 min remaining</p>
              </div>
            )}
          </div>

          {/* Vehicle */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
              Vehicle
            </p>
            <ImagePlaceholder label="Vehicle photo" aspectRatio="video" className="w-full mb-3" />
            <div className="flex flex-col gap-2">
              <InfoRow
                label="Make & model"
                value={`${MOCK_JOB.vehicle.make} ${MOCK_JOB.vehicle.model}`}
              />
              <InfoRow label="Plate" value={MOCK_JOB.vehicle.plate} />
            </div>
          </div>

          {/* Client */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
              Client
            </p>
            <div className="flex flex-col gap-2">
              <InfoRow label="Name" value={MOCK_JOB.client} />
              <InfoRow label="Phone" value={MOCK_JOB.clientPhone} />
            </div>
          </div>

          {/* Action */}
          <div className="mt-4 mb-6">
            <ActionArea status={status} onAction={handleAction} />
          </div>
        </div>
      </>
    </WasherLayout>
  );
}

import { Bell, Car, CheckCircle2, Clock, Droplets, Search } from 'lucide-react';
import { Badge } from '@/shared/components/ui/Badge';
import { ImagePlaceholder } from '@/shared/components/ui/ImagePlaceholder';
import { WasherLayout } from '@/shared/components/layout/WasherLayout';

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_WASHER = { firstName: 'James', lastName: 'K.' };

const MOCK_JOBS = [
  {
    id: '1',
    ref: 'CW-000101',
    client: 'Alex Morgan',
    vehicle: 'Toyota Camry',
    service: 'Full Detail',
    time: '10:00',
    status: 'inProgress' as const,
  },
  {
    id: '2',
    ref: 'CW-000103',
    client: 'Sarah Chen',
    vehicle: 'Honda Civic',
    service: 'Basic Wash',
    time: '13:00',
    status: 'confirmed' as const,
  },
  {
    id: '3',
    ref: 'CW-000099',
    client: 'Mike Torres',
    vehicle: 'BMW X5',
    service: 'Premium Detail',
    time: '08:00',
    status: 'completed' as const,
  },
];

// ─── Types ────────────────────────────────────────────────────────────────────

type JobStatus = 'inProgress' | 'confirmed' | 'completed';

interface Job {
  id: string;
  ref: string;
  client: string;
  vehicle: string;
  service: string;
  time: string;
  status: JobStatus;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const leftBorderClass: Record<JobStatus, string> = {
  inProgress: 'border-l-amber-500',
  confirmed: 'border-l-indigo-500',
  completed: 'border-l-gray-200',
};

// ─── JobCard ──────────────────────────────────────────────────────────────────

interface JobCardProps {
  job: Job;
}

function JobCard({ job }: JobCardProps) {
  return (
    <button
      type="button"
      className={`w-full text-left bg-white rounded-xl border border-gray-200 border-l-4 ${leftBorderClass[job.status]} overflow-hidden p-4 hover:shadow-sm transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500`}
      onClick={() => console.log('open job', job.id)}
    >
      <div className="flex justify-between items-start">
        <span className="font-mono text-xs text-gray-500">{job.ref}</span>
        <Badge variant={job.status} />
      </div>

      <div className="mt-2">
        <p className="text-sm font-semibold text-gray-900">{job.client}</p>
        <div className="flex gap-3 mt-1 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Car className="w-3 h-3" />
            {job.vehicle}
          </span>
          <span className="flex items-center gap-1">
            <Droplets className="w-3 h-3" />
            {job.service}
          </span>
        </div>
        <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          {job.time}
        </div>
      </div>

      {job.status === 'inProgress' && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>In progress</span>
            <span>~45 min remaining</span>
          </div>
          <div className="bg-gray-100 h-2 rounded-full">
            <div className="bg-amber-500 h-2 rounded-full" style={{ width: '60%' }} />
          </div>
        </div>
      )}
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function WasherJobsPage() {
  const activeJobs = MOCK_JOBS.filter(j => j.status !== 'completed');
  const completedJobs = MOCK_JOBS.filter(j => j.status === 'completed');

  return (
    <WasherLayout>
      <>
        <header className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <ImagePlaceholder label="Avatar" className="w-10 h-10 rounded-full flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {MOCK_WASHER.firstName} {MOCK_WASHER.lastName}
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
                No jobs assigned yet
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {activeJobs.map(job => (
                <JobCard key={job.id} job={job} />
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
                {completedJobs.map(job => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </div>
          )}
        </div>
      </>
    </WasherLayout>
  );
}

import { useState, useMemo } from 'react';
import { Car, Clock, Droplets, Search, SlidersHorizontal } from 'lucide-react';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { WasherLayout } from '@/shared/components/layout/WasherLayout';

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_HISTORY = [
  { id: '1', ref: 'CW-000099', client: 'Mike Torres', vehicle: 'BMW X5',        service: 'Premium Detail', date: 'May 19, 2025', time: '08:00', status: 'completed' as const },
  { id: '2', ref: 'CW-000095', client: 'Dana Wu',     vehicle: 'Tesla Model 3', service: 'Full Detail',    date: 'May 19, 2025', time: '09:30', status: 'completed' as const },
  { id: '3', ref: 'CW-000088', client: 'Alex Morgan', vehicle: 'Toyota Camry',  service: 'Basic Wash',     date: 'May 18, 2025', time: '14:00', status: 'completed' as const },
  { id: '4', ref: 'CW-000082', client: 'Sarah Chen',  vehicle: 'Honda Civic',   service: 'Express Wash',   date: 'May 18, 2025', time: '10:00', status: 'completed' as const },
  { id: '5', ref: 'CW-000071', client: 'Chris Park',  vehicle: 'Ford F-150',    service: 'Full Detail',    date: 'May 17, 2025', time: '11:00', status: 'completed' as const },
];

// ─── Constants ────────────────────────────────────────────────────────────────

const TODAY = 'May 19, 2025';
const YESTERDAY = 'May 18, 2025';

const SERVICE_FILTERS = ['All', 'Basic Wash', 'Express Wash', 'Full Detail', 'Premium Detail'] as const;
type ServiceFilter = (typeof SERVICE_FILTERS)[number];

// ─── Types ────────────────────────────────────────────────────────────────────

interface HistoryJob {
  id: string;
  ref: string;
  client: string;
  vehicle: string;
  service: string;
  date: string;
  time: string;
  status: 'completed';
}

interface JobGroup {
  label: string;
  jobs: HistoryJob[];
}

// ─── FilterSheet ──────────────────────────────────────────────────────────────

interface FilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

function FilterSheet({ isOpen, onClose }: FilterSheetProps) {
  const [selected, setSelected] = useState<ServiceFilter>('All');

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed bottom-0 left-0 right-0 max-w-sm mx-auto bg-white rounded-t-2xl z-50 transition-transform duration-300 pb-[env(safe-area-inset-bottom)] ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-4" />
        <div className="px-4 pb-6">
          <p className="text-base font-semibold text-gray-900 mb-4">Filter jobs</p>

          <p className="text-sm font-medium text-gray-700 mb-2">Service type</p>
          <div className="flex flex-wrap gap-2">
            {SERVICE_FILTERS.map(option => (
              <button
                key={option}
                type="button"
                onClick={() => setSelected(option)}
                className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                  selected === option
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              variant="ghost"
              size="sm"
              className="flex-1"
              onClick={() => console.log('clear filters')}
            >
              Clear filters
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
              onClick={onClose}
            >
              Apply
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── HistoryJobCard ───────────────────────────────────────────────────────────

interface HistoryJobCardProps {
  job: HistoryJob;
}

function HistoryJobCard({ job }: HistoryJobCardProps) {
  return (
    <button
      type="button"
      className="w-full text-left bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500"
      onClick={() => console.log('view job', job.id)}
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
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function WasherHistoryPage() {
  const [search, setSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return MOCK_HISTORY;
    return MOCK_HISTORY.filter(
      j =>
        j.client.toLowerCase().includes(q) ||
        j.vehicle.toLowerCase().includes(q) ||
        j.service.toLowerCase().includes(q)
    );
  }, [search]);

  const grouped = useMemo<JobGroup[]>(() => {
    const map = new Map<string, HistoryJob[]>();
    const order: string[] = [];

    for (const job of filtered) {
      const label =
        job.date === TODAY ? 'Today' : job.date === YESTERDAY ? 'Yesterday' : job.date;
      if (!map.has(label)) {
        map.set(label, []);
        order.push(label);
      }
      map.get(label)!.push(job);
    }

    return order.map(label => ({ label, jobs: map.get(label)! }));
  }, [filtered]);

  return (
    <WasherLayout>
      <>
        <header className="bg-white border-b border-gray-200 px-4 py-3">
          <p className="text-lg font-semibold text-gray-900">History</p>
          <p className="text-xs text-gray-500 mt-0.5">{MOCK_HISTORY.length} jobs completed</p>
        </header>

        <div className="flex gap-2 px-4 py-3 bg-white border-b border-gray-200">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
          <Button variant="ghost" size="sm" onClick={() => setFilterOpen(true)}>
            <SlidersHorizontal className="w-4 h-4" />
            Filter
          </Button>
        </div>

        <div className="px-4 pt-4">
          {grouped.length === 0 ? (
            <p className="py-12 text-center text-sm text-gray-500">No jobs match your search.</p>
          ) : (
            grouped.map((group, index) => (
              <div key={group.label}>
                <p
                  className={`text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 ${
                    index === 0 ? 'mt-0' : 'mt-4'
                  }`}
                >
                  {group.label}
                </p>
                <div className="flex flex-col gap-3">
                  {group.jobs.map(job => (
                    <HistoryJobCard key={job.id} job={job} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
        <FilterSheet isOpen={filterOpen} onClose={() => setFilterOpen(false)} />
      </>
    </WasherLayout>
  );
}

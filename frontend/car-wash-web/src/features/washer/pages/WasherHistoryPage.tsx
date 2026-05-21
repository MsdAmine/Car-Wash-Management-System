import { useState, useMemo } from 'react';
import { Car, Clock, Droplets, Search, SlidersHorizontal } from 'lucide-react';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { WasherLayout } from '@/shared/components/layout/WasherLayout';
import { ErrorState } from '@/shared/components/feedback/ErrorState';
import { useMyBookingHistory } from '../hooks/useMyBookingHistory';
import type { BookingResponse } from '../types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SERVICE_FILTERS = ['All', 'Basic Wash', 'Express Wash', 'Full Detail', 'Premium Detail'] as const;
type ServiceFilter = (typeof SERVICE_FILTERS)[number];

interface JobGroup {
  label: string;
  jobs: BookingResponse[];
}

function toLocalDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function HistorySkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[0, 1, 2].map(i => (
        <div key={i} className="bg-white rounded-xl h-20 animate-pulse border border-gray-100" />
      ))}
    </div>
  );
}

// ─── FilterSheet ──────────────────────────────────────────────────────────────

interface FilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  activeFilter: ServiceFilter;
  onApply: (filter: ServiceFilter) => void;
}

function FilterSheet({ isOpen, onClose, activeFilter, onApply }: FilterSheetProps) {
  const [selected, setSelected] = useState<ServiceFilter>(activeFilter);

  function handleApply() {
    onApply(selected);
    onClose();
  }

  function handleClear() {
    setSelected('All');
  }

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
              onClick={handleClear}
            >
              Clear filters
            </Button>
            <Button variant="primary" size="sm" className="flex-1" onClick={handleApply}>
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
  booking: BookingResponse;
}

function HistoryJobCard({ booking }: HistoryJobCardProps) {
  return (
    <div className="w-full text-left bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex justify-between items-start">
        <span className="font-mono text-xs text-gray-500">
          {booking.id.slice(-8).toUpperCase()}
        </span>
        <Badge variant="completed" />
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
          {booking.appointmentDateTime.slice(11, 16)}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function WasherHistoryPage() {
  const [search, setSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<ServiceFilter>('All');

  // The today endpoint returns all statuses; filter to completed only.
  // TODO: replace with a real history endpoint when available
  const { data: assignments, isLoading, isError } = useMyBookingHistory();

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const todayKey = toLocalDateKey(today);
  const yesterdayKey = toLocalDateKey(yesterday);

  const completed = useMemo(
    () => (assignments ?? []).filter(b => b.status === 'COMPLETED'),
    [assignments],
  );

  const filtered = useMemo(() => {
    let result = activeFilter === 'All'
      ? completed
      : completed.filter(b => b.washServiceName === activeFilter);
    const q = search.trim().toLowerCase();
    if (!q) return result;
    return result.filter(
      b =>
        b.customerEmail.toLowerCase().includes(q) ||
        b.vehicleLicensePlate.toLowerCase().includes(q) ||
        b.washServiceName.toLowerCase().includes(q),
    );
  }, [search, completed, activeFilter]);

  const grouped = useMemo<JobGroup[]>(() => {
    const map = new Map<string, BookingResponse[]>();
    const order: string[] = [];

    for (const booking of filtered) {
      const dateKey = booking.appointmentDateTime.slice(0, 10);
      const label =
        dateKey === todayKey ? 'Today' : dateKey === yesterdayKey ? 'Yesterday' : dateKey;
      if (!map.has(label)) {
        map.set(label, []);
        order.push(label);
      }
      map.get(label)!.push(booking);
    }

    return order.map(label => ({ label, jobs: map.get(label)! }));
  }, [filtered, todayKey, yesterdayKey]);

  return (
    <WasherLayout>
      <>
        <header className="bg-white border-b border-gray-200 px-4 py-3">
          <p className="text-lg font-semibold text-gray-900">History</p>
          <p className="text-xs text-gray-500 mt-0.5">{completed.length} jobs completed</p>
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
          {isLoading ? (
            <HistorySkeleton />
          ) : isError ? (
            <div className="py-12">
              <ErrorState message="Could not load job history." />
            </div>
          ) : grouped.length === 0 ? (
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
                  {group.jobs.map(booking => (
                    <HistoryJobCard key={booking.id} booking={booking} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <FilterSheet
          isOpen={filterOpen}
          onClose={() => setFilterOpen(false)}
          activeFilter={activeFilter}
          onApply={setActiveFilter}
        />
      </>
    </WasherLayout>
  );
}

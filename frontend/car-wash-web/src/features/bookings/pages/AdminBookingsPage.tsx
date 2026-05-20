import { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
} from 'lucide-react';
import { AdminLayout } from '@/shared/components/layout/AdminLayout';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';
import { ImagePlaceholder } from '@/shared/components/ui/ImagePlaceholder';
import {
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from '@/shared/components/ui/Table';
import { Pagination } from '@/shared/components/ui/Pagination';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { ErrorState } from '@/shared/components/feedback/ErrorState';
import { AssignJobModal } from '@/features/bookings/components/AssignJobModal';
import { useAllBookings } from '@/features/admin/hooks/useAllBookings';
import type { BookingResponse } from '../types';

// ─── Types ────────────────────────────────────────────────────────────────────

type TabKey = 'all' | 'today' | 'upcoming' | 'inProgress' | 'completed' | 'cancelled';

// ─── Tab config ───────────────────────────────────────────────────────────────

const TABS: { key: TabKey; label: string }[] = [
  { key: 'all',        label: 'All' },
  { key: 'today',      label: 'Today' },
  { key: 'upcoming',   label: 'Upcoming' },
  { key: 'inProgress', label: 'In Progress' },
  { key: 'completed',  label: 'Completed' },
  { key: 'cancelled',  label: 'Cancelled' },
];

const EMPTY_COPY: Record<TabKey, { title: string; subtitle: string }> = {
  all:        { title: 'No bookings found',        subtitle: 'Try adjusting your filters.' },
  today:      { title: 'No bookings today',        subtitle: 'There are no bookings scheduled for today.' },
  upcoming:   { title: 'No upcoming bookings',     subtitle: 'Try adjusting your filters.' },
  inProgress: { title: 'No active washes',         subtitle: 'No bookings are currently in progress.' },
  completed:  { title: 'No completed bookings',    subtitle: 'No bookings have been completed yet.' },
  cancelled:  { title: 'No cancelled bookings',    subtitle: 'No bookings have been cancelled.' },
};

// ─── Filter helpers ───────────────────────────────────────────────────────────

function isSameDay(dateStr: string, target: Date): boolean {
  const d = new Date(dateStr);
  return (
    d.getFullYear() === target.getFullYear() &&
    d.getMonth() === target.getMonth() &&
    d.getDate() === target.getDate()
  );
}

function filterByTab(bookings: BookingResponse[], tab: TabKey): BookingResponse[] {
  const today = new Date();
  switch (tab) {
    case 'all':        return bookings;
    case 'today':      return bookings.filter((b) => isSameDay(b.appointmentDateTime, today));
    case 'upcoming':   return bookings.filter((b) => b.status === 'PENDING' || b.status === 'CONFIRMED');
    case 'inProgress': return bookings.filter((b) => b.status === 'IN_PROGRESS');
    case 'completed':  return bookings.filter((b) => b.status === 'COMPLETED');
    case 'cancelled':  return bookings.filter((b) => b.status === 'CANCELLED');
  }
}

function applySearch(bookings: BookingResponse[], query: string): BookingResponse[] {
  const q = query.trim().toLowerCase();
  if (!q) return bookings;
  return bookings.filter(
    (b) =>
      b.customerEmail.toLowerCase().includes(q) ||
      b.id.toLowerCase().includes(q),
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

// ─── BookingRow ───────────────────────────────────────────────────────────────

interface BookingRowProps {
  booking: BookingResponse;
  selected: boolean;
  onToggle: () => void;
  onOpenAssign: (data: { ref: string; service: string; datetime: string; bookingId: string }) => void;
}

function BookingRow({ booking, selected, onToggle, onOpenAssign }: BookingRowProps) {
  const ref = booking.id.slice(-8).toUpperCase();
  const datetime = new Date(booking.appointmentDateTime).toLocaleString();
  const assignData = { ref, service: booking.washServiceName, datetime, bookingId: booking.id };

  return (
    <TableRow selected={selected}>
      <TableCell className="w-10">
        <input
          type="checkbox"
          aria-label="Select booking"
          checked={selected}
          onChange={onToggle}
          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-3">
          <ImagePlaceholder label="Avatar" className="w-8 h-8 rounded-full flex-shrink-0" />
          <span className="text-sm font-semibold text-gray-900">{booking.customerEmail}</span>
        </div>
      </TableCell>

      <TableCell>{booking.washServiceName}</TableCell>
      <TableCell>{booking.vehicleLicensePlate}</TableCell>
      <TableCell>{datetime}</TableCell>

      <TableCell>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">—</span>
          {booking.status === 'PENDING' && (
            <Button size="sm" onClick={() => onOpenAssign(assignData)}>Assign</Button>
          )}
        </div>
      </TableCell>

      <TableCell>
        <Badge variant={statusToVariant(booking.status)} />
      </TableCell>

      <TableCell className="w-16 text-right">
        <button
          type="button"
          aria-label="Booking actions"
          onClick={() => onOpenAssign(assignData)}
          className="text-gray-400 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-1"
        >
          ···
        </button>
      </TableCell>
    </TableRow>
  );
}

// ─── Skeleton rows ────────────────────────────────────────────────────────────

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="border-b border-gray-100">
          {Array.from({ length: 8 }).map((__, j) => (
            <td key={j} className="px-4 py-3">
              <div className="h-4 bg-gray-100 rounded animate-pulse" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function AdminBookingsPage() {
  const { data: bookings, isLoading, isError } = useAllBookings();

  const [activeTab, setActiveTab]   = useState<TabKey>('today');
  const [search, setSearch]         = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [assignModal, setAssignModal] = useState<{
    isOpen: boolean;
    booking: { ref: string; service: string; datetime: string } | null;
    bookingId: string | null;
  }>({ isOpen: false, booking: null, bookingId: null });

  const allBookings = bookings ?? [];
  const tabFiltered = filterByTab(allBookings, activeTab);
  const visibleBookings = applySearch(tabFiltered, search);
  const allVisibleIds = visibleBookings.map((b) => b.id);
  const allSelected =
    allVisibleIds.length > 0 && allVisibleIds.every((id) => selectedIds.has(id));

  function handleSelectAll() {
    setSelectedIds(allSelected ? new Set() : new Set(allVisibleIds));
  }

  function handleToggleRow(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleTabChange(tab: TabKey) {
    setActiveTab(tab);
    setCurrentPage(1);
  }

  function handleOpenAssign(data: { ref: string; service: string; datetime: string; bookingId: string }) {
    setAssignModal({ isOpen: true, booking: data, bookingId: data.bookingId });
  }

  function handleCloseAssign() {
    setAssignModal((prev) => ({ ...prev, isOpen: false }));
  }

  const topBar = (
    <>
      <h1 className="text-lg font-semibold text-gray-900">Bookings</h1>
      <Button size="sm" onClick={() => console.log('new booking')}>
        + New booking
      </Button>
    </>
  );

  return (
    <>
      <AdminLayout topBar={topBar}>
        {/* Tab filters */}
        <div className="flex gap-6 border-b border-gray-200 mb-4">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => handleTabChange(key)}
              className={`text-sm px-1 pb-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                activeTab === key
                  ? 'text-indigo-600 border-b-2 border-indigo-600 font-medium'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 my-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by email or booking ref"
              className="w-64 pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => console.log('filter')}>
              <SlidersHorizontal className="w-4 h-4" />
              Filter
            </Button>
            <Button variant="ghost" size="sm" onClick={() => console.log('sort')}>
              <ArrowUpDown className="w-4 h-4" />
              Sort
            </Button>
          </div>
        </div>

        {/* Table card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {isError ? (
            <div className="py-12">
              <ErrorState message="Could not load bookings." />
            </div>
          ) : (
            <Table>
              <TableHead>
                <tr>
                  <TableHeader className="w-10">
                    <input
                      type="checkbox"
                      aria-label="Select all"
                      checked={allSelected}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </TableHeader>
                  <TableHeader>Client</TableHeader>
                  <TableHeader>Service</TableHeader>
                  <TableHeader>Vehicle</TableHeader>
                  <TableHeader>Date &amp; Time</TableHeader>
                  <TableHeader>Washer</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader className="w-16">
                    <span className="sr-only">Actions</span>
                  </TableHeader>
                </tr>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <SkeletonRows />
                ) : visibleBookings.length === 0 ? (
                  <tr>
                    <td colSpan={8}>
                      <EmptyState
                        title={EMPTY_COPY[activeTab].title}
                        subtitle={EMPTY_COPY[activeTab].subtitle}
                      />
                    </td>
                  </tr>
                ) : (
                  visibleBookings.map((booking) => (
                    <BookingRow
                      key={booking.id}
                      booking={booking}
                      selected={selectedIds.has(booking.id)}
                      onToggle={() => handleToggleRow(booking.id)}
                      onOpenAssign={handleOpenAssign}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          <div className="border-t border-gray-200 px-4 py-3 bg-white">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.max(1, Math.ceil(visibleBookings.length / 20))}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </AdminLayout>

      <AssignJobModal
        isOpen={assignModal.isOpen}
        onClose={handleCloseAssign}
        booking={assignModal.booking}
        bookingId={assignModal.bookingId}
      />
    </>
  );
}

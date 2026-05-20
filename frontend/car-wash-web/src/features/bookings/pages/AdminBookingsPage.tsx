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
import { AssignJobModal } from '@/features/bookings/components/AssignJobModal';

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_BOOKINGS = [
  { id: '1', ref: 'CW-000101', client: { name: 'Alex Morgan', avatar: null }, service: 'Full Detail', vehicle: 'Toyota Camry', datetime: 'May 19, 2025 10:00', washer: 'James K.', status: 'inProgress' as const },
  { id: '2', ref: 'CW-000103', client: { name: 'Sarah Chen', avatar: null }, service: 'Basic Wash', vehicle: 'Honda Civic', datetime: 'May 19, 2025 11:00', washer: 'Maria L.', status: 'confirmed' as const },
  { id: '3', ref: 'CW-000105', client: { name: 'Mike Torres', avatar: null }, service: 'Express Wash', vehicle: 'BMW X5', datetime: 'May 19, 2025 11:30', washer: null, status: 'confirmed' as const },
  { id: '4', ref: 'CW-000098', client: { name: 'Dana Wu', avatar: null }, service: 'Premium Detail', vehicle: 'Tesla Model 3', datetime: 'May 20, 2025 14:00', washer: 'James K.', status: 'confirmed' as const },
  { id: '5', ref: 'CW-000085', client: { name: 'Alex Morgan', avatar: null }, service: 'Basic Wash', vehicle: 'Toyota Camry', datetime: 'May 12, 2025 09:00', washer: 'Maria L.', status: 'completed' as const },
  { id: '6', ref: 'CW-000079', client: { name: 'Chris Park', avatar: null }, service: 'Full Detail', vehicle: 'Ford F-150', datetime: 'Apr 28, 2025 11:00', washer: 'James K.', status: 'cancelled' as const },
];

// ─── Types ────────────────────────────────────────────────────────────────────

type BookingStatus = 'inProgress' | 'confirmed' | 'completed' | 'cancelled';
type TabKey = 'all' | 'today' | 'upcoming' | 'inProgress' | 'completed' | 'cancelled';

interface Booking {
  id: string;
  ref: string;
  client: { name: string; avatar: string | null };
  service: string;
  vehicle: string;
  datetime: string;
  washer: string | null;
  status: BookingStatus;
}

// ─── Tab config ───────────────────────────────────────────────────────────────

const TABS: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'today', label: 'Today' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'inProgress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

const EMPTY_COPY: Record<TabKey, { title: string; subtitle: string }> = {
  all: { title: 'No bookings found', subtitle: 'Try adjusting your filters.' },
  today: { title: 'No bookings today', subtitle: 'There are no bookings scheduled for today.' },
  upcoming: { title: 'No bookings found', subtitle: 'Try adjusting your filters.' },
  inProgress: { title: 'No active washes', subtitle: 'No bookings are currently in progress.' },
  completed: { title: 'No completed bookings', subtitle: 'No bookings have been completed yet.' },
  cancelled: { title: 'No cancelled bookings', subtitle: 'No bookings have been cancelled.' },
};

// ─── Filter helpers ───────────────────────────────────────────────────────────

function filterByTab(bookings: Booking[], tab: TabKey): Booking[] {
  switch (tab) {
    case 'all':        return bookings;
    case 'today':      return bookings.filter(b => b.datetime.includes('May 19'));
    case 'upcoming':   return bookings.filter(b => b.status === 'confirmed');
    case 'inProgress': return bookings.filter(b => b.status === 'inProgress');
    case 'completed':  return bookings.filter(b => b.status === 'completed');
    case 'cancelled':  return bookings.filter(b => b.status === 'cancelled');
  }
}

function applySearch(bookings: Booking[], query: string): Booking[] {
  const q = query.trim().toLowerCase();
  if (!q) return bookings;
  return bookings.filter(
    b => b.client.name.toLowerCase().includes(q) || b.ref.toLowerCase().includes(q)
  );
}

// ─── BookingRow ───────────────────────────────────────────────────────────────

interface BookingRowProps {
  booking: Booking;
  selected: boolean;
  onToggle: () => void;
  onOpenAssign: (data: { ref: string; service: string; datetime: string }) => void;
}

function BookingRow({ booking, selected, onToggle, onOpenAssign }: BookingRowProps) {
  const assignData = { ref: booking.ref, service: booking.service, datetime: booking.datetime };

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
          <span className="text-sm font-semibold text-gray-900">{booking.client.name}</span>
        </div>
      </TableCell>

      <TableCell>{booking.service}</TableCell>
      <TableCell>{booking.vehicle}</TableCell>
      <TableCell>{booking.datetime}</TableCell>

      <TableCell>
        {booking.washer !== null ? (
          <span className="text-sm text-gray-700">{booking.washer}</span>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm text-red-500 font-medium">Unassigned</span>
            <Button size="sm" onClick={() => onOpenAssign(assignData)}>Assign</Button>
          </div>
        )}
      </TableCell>

      <TableCell>
        <Badge variant={booking.status} />
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export function AdminBookingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('today');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [assignModal, setAssignModal] = useState<{
    isOpen: boolean;
    booking: { ref: string; service: string; datetime: string } | null;
  }>({ isOpen: false, booking: null });

  const tabFiltered = filterByTab(MOCK_BOOKINGS, activeTab);
  const visibleBookings = applySearch(tabFiltered, search);
  const allVisibleIds = visibleBookings.map(b => b.id);
  const allSelected =
    allVisibleIds.length > 0 && allVisibleIds.every(id => selectedIds.has(id));

  function handleSelectAll() {
    setSelectedIds(allSelected ? new Set() : new Set(allVisibleIds));
  }

  function handleToggleRow(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleTabChange(tab: TabKey) {
    setActiveTab(tab);
    setCurrentPage(1);
  }

  function handleOpenAssign(booking: { ref: string; service: string; datetime: string }) {
    setAssignModal({ isOpen: true, booking });
  }

  function handleCloseAssign() {
    setAssignModal(prev => ({ ...prev, isOpen: false }));
  }

  function handleAssign(washerId: string) {
    console.log('assigned', washerId);
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
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by client or booking ref"
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
          {visibleBookings.length === 0 ? (
            <EmptyState
              title={EMPTY_COPY[activeTab].title}
              subtitle={EMPTY_COPY[activeTab].subtitle}
            />
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
                {visibleBookings.map(booking => (
                  <BookingRow
                    key={booking.id}
                    booking={booking}
                    selected={selectedIds.has(booking.id)}
                    onToggle={() => handleToggleRow(booking.id)}
                    onOpenAssign={handleOpenAssign}
                  />
                ))}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          <div className="border-t border-gray-200 px-4 py-3 bg-white">
            <Pagination
              currentPage={currentPage}
              totalPages={3}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </AdminLayout>

      <AssignJobModal
        isOpen={assignModal.isOpen}
        onClose={handleCloseAssign}
        onAssign={handleAssign}
        booking={assignModal.booking}
      />
    </>
  );
}

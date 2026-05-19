import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
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

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_STAFF = [
  { id: '1', name: 'James K.', email: 'james@washflow.com', phone: '+1 555 0101', status: 'active' as const, jobsThisMonth: 47, joinedAt: 'Jan 12, 2025' },
  { id: '2', name: 'Maria L.', email: 'maria@washflow.com', phone: '+1 555 0102', status: 'active' as const, jobsThisMonth: 38, joinedAt: 'Feb 3, 2025' },
  { id: '3', name: 'Tony B.',  email: 'tony@washflow.com',  phone: '+1 555 0103', status: 'inactive' as const, jobsThisMonth: 0, joinedAt: 'Mar 15, 2025' },
  { id: '4', name: 'Priya S.', email: 'priya@washflow.com', phone: '+1 555 0104', status: 'pending' as const, jobsThisMonth: 0, joinedAt: 'May 18, 2025' },
];

const MOCK_RECENT_JOBS = [
  { ref: 'CW-000101', service: 'Full Detail',   date: 'May 19, 2025', status: 'completed' as const },
  { ref: 'CW-000098', service: 'Basic Wash',    date: 'May 17, 2025', status: 'completed' as const },
  { ref: 'CW-000091', service: 'Express Wash',  date: 'May 14, 2025', status: 'completed' as const },
];

// ─── Types ────────────────────────────────────────────────────────────────────

type StaffStatus = 'active' | 'inactive' | 'pending';
type TabKey = 'all' | 'active' | 'inactive' | 'pending';

// ─── Tab config ───────────────────────────────────────────────────────────────

const TABS: { key: TabKey; label: string }[] = [
  { key: 'all',      label: 'All' },
  { key: 'active',   label: 'Active' },
  { key: 'inactive', label: 'Inactive' },
  { key: 'pending',  label: 'Pending' },
];

// ─── Filter helpers ───────────────────────────────────────────────────────────

function filterByTab(staff: typeof MOCK_STAFF, tab: TabKey): typeof MOCK_STAFF {
  if (tab === 'all') return staff;
  return staff.filter(s => s.status === tab);
}

function applySearch(staff: typeof MOCK_STAFF, query: string): typeof MOCK_STAFF {
  const q = query.trim().toLowerCase();
  if (!q) return staff;
  return staff.filter(
    s => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
  );
}

// ─── Badge helpers ────────────────────────────────────────────────────────────

function statusVariant(status: StaffStatus): 'completed' | 'cancelled' | 'pending' {
  if (status === 'active')   return 'completed';
  if (status === 'inactive') return 'cancelled';
  return 'pending';
}

function statusLabel(status: StaffStatus): string {
  if (status === 'active')   return 'Active';
  if (status === 'inactive') return 'Inactive';
  return 'Pending';
}

// ─── StaffDetailPanel ─────────────────────────────────────────────────────────

interface StaffDetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  staff: (typeof MOCK_STAFF)[0] | null;
}

function StaffDetailPanel({ isOpen, onClose, staff }: StaffDetailPanelProps) {
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!staff) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 z-40"
        aria-hidden="true"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">{staff.name}</h2>
          <button
            type="button"
            aria-label="Close panel"
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 overflow-y-auto flex-1 flex flex-col gap-6">
          {/* Identity */}
          <div className="flex flex-col items-center">
            <ImagePlaceholder label="Staff avatar" className="w-16 h-16 rounded-full" />
            <p className="text-lg font-semibold text-gray-900 text-center mt-3">{staff.name}</p>
            <div className="mt-1">
              <Badge variant={statusVariant(staff.status)} label={statusLabel(staff.status)} />
            </div>
          </div>

          {/* Contact info */}
          <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Email</span>
              <span className="text-sm text-gray-900">{staff.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Phone</span>
              <span className="text-sm text-gray-900">{staff.phone}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Joined</span>
              <span className="text-sm text-gray-900">{staff.joinedAt}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{staff.jobsThisMonth}</p>
              <p className="text-xs text-gray-500 mt-1">Jobs this month</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{staff.jobsThisMonth * 3}</p>
              <p className="text-xs text-gray-500 mt-1">Total jobs</p>
            </div>
          </div>

          {/* Recent jobs */}
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-3">Recent jobs</p>
            <div className="flex flex-col gap-2">
              {MOCK_RECENT_JOBS.map(job => (
                <div
                  key={job.ref}
                  className="bg-white border border-gray-200 rounded-lg p-3 flex justify-between items-center"
                >
                  <div>
                    <p className="font-mono text-xs text-gray-500">{job.ref}</p>
                    <p className="text-sm text-gray-900 mt-0.5">{job.service}</p>
                  </div>
                  <Badge variant={job.status} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 flex-shrink-0">
          {staff.status === 'pending' ? (
            <Button size="sm" onClick={() => console.log('activate', staff.id)}>
              Activate
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => console.log('deactivate', staff.id)}>
                Deactivate
              </Button>
              <Button size="sm" onClick={() => console.log('edit info', staff.id)}>
                Edit info
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function AdminStaffPage() {
  const [activeTab, setActiveTab]     = useState<TabKey>('all');
  const [search, setSearch]           = useState('');
  const [selectedStaff, setSelectedStaff] = useState<(typeof MOCK_STAFF)[0] | null>(null);

  const tabFiltered   = filterByTab(MOCK_STAFF, activeTab);
  const visibleStaff  = applySearch(tabFiltered, search);

  const topBar = (
    <>
      <span className="text-lg font-semibold text-gray-900">Staff</span>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search staff"
          className="w-56 pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        />
      </div>
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
              onClick={() => setActiveTab(key)}
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

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <Table>
            <TableHead>
              <tr>
                <TableHeader>Staff member</TableHeader>
                <TableHeader>Phone</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader className="text-right">Jobs this month</TableHeader>
                <TableHeader className="w-24">
                  <span className="sr-only">Actions</span>
                </TableHeader>
              </tr>
            </TableHead>
            <TableBody>
              {visibleStaff.map(staff => (
                <TableRow
                  key={staff.id}
                  onClick={() => setSelectedStaff(staff)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <ImagePlaceholder label="Avatar" className="w-8 h-8 rounded-full flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{staff.name}</p>
                        <p className="text-xs text-gray-500">{staff.email}</p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>{staff.phone}</TableCell>

                  <TableCell>
                    <Badge variant={statusVariant(staff.status)} label={statusLabel(staff.status)} />
                  </TableCell>

                  <TableCell className="text-right">
                    <span className="text-sm text-gray-700">{staff.jobsThisMonth}</span>
                  </TableCell>

                  <TableCell className="text-right">
                    {staff.status === 'pending' ? (
                      <Button
                        size="sm"
                        onClick={e => {
                          e.stopPropagation();
                          console.log('activate', staff.id);
                        }}
                      >
                        Activate
                      </Button>
                    ) : (
                      <button
                        type="button"
                        aria-label="Staff actions"
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedStaff(staff);
                        }}
                        className="text-gray-400 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-1"
                      >
                        ···
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </AdminLayout>

      <StaffDetailPanel
        isOpen={selectedStaff !== null}
        onClose={() => setSelectedStaff(null)}
        staff={selectedStaff}
      />
    </>
  );
}

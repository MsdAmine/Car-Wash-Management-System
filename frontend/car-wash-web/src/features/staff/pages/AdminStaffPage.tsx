import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { AdminLayout } from '@/shared/components/layout/AdminLayout';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';
import {
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from '@/shared/components/ui/Table';
import { ErrorState } from '@/shared/components/feedback/ErrorState';
import type { BookingResponse } from '@/features/bookings/types';
import { useAllEmployees } from '../hooks/useAllEmployees';
import { useEmployeeBookingDetails } from '../hooks/useEmployeeBookingDetails';
import { useActivateEmployee } from '../hooks/useActivateEmployee';
import { useDeactivateEmployee } from '../hooks/useDeactivateEmployee';
import { useUpdateEmployee } from '../hooks/useUpdateEmployee';
import type { EmployeeResponse } from '../types';

const POSITIONS = ['WASHER', 'SUPERVISOR', 'CASHIER', 'MANAGER', 'RECEPTIONIST'] as const;

// ─── Types ────────────────────────────────────────────────────────────────────

type TabKey = 'all' | 'active' | 'inactive' | 'pending';

// ─── Tab config ───────────────────────────────────────────────────────────────

const TABS: { key: TabKey; label: string }[] = [
  { key: 'all',      label: 'All' },
  { key: 'active',   label: 'Active' },
  { key: 'inactive', label: 'Inactive' },
  { key: 'pending',  label: 'Pending' },
];

// ─── Filter helpers ───────────────────────────────────────────────────────────

function filterByTab(employees: EmployeeResponse[], tab: TabKey): EmployeeResponse[] {
  if (tab === 'all') return employees;
  return employees.filter((e) => e.status === tab.toUpperCase());
}

function applySearch(employees: EmployeeResponse[], query: string): EmployeeResponse[] {
  const q = query.trim().toLowerCase();
  if (!q) return employees;
  return employees.filter(
    (e) =>
      `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q),
  );
}

// ─── Badge helpers ────────────────────────────────────────────────────────────

function statusVariant(status: EmployeeResponse['status']): 'completed' | 'cancelled' | 'pending' {
  if (status === 'ACTIVE')   return 'completed';
  if (status === 'INACTIVE') return 'cancelled';
  return 'pending';
}

function statusLabel(status: EmployeeResponse['status']): string {
  if (status === 'ACTIVE')   return 'Active';
  if (status === 'INACTIVE') return 'Inactive';
  return 'Pending';
}

function bookingStatusVariant(status: BookingResponse['status']): 'pending' | 'confirmed' | 'inProgress' | 'completed' | 'cancelled' {
  if (status === 'CONFIRMED') return 'confirmed';
  if (status === 'IN_PROGRESS') return 'inProgress';
  if (status === 'COMPLETED') return 'completed';
  if (status === 'CANCELLED') return 'cancelled';
  return 'pending';
}

function formatJobDateTime(dateTime: string): string {
  return new Date(dateTime).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

// ─── StaffDetailPanel ─────────────────────────────────────────────────────────

interface StaffDetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  staff: EmployeeResponse | null;
}

function StaffDetailPanel({ isOpen, onClose, staff }: StaffDetailPanelProps) {
  const activateEmployee = useActivateEmployee();
  const deactivateEmployee = useDeactivateEmployee();
  const updateEmployee = useUpdateEmployee();
  const {
    data: recentJobs,
    isLoading: recentJobsLoading,
    isError: recentJobsError,
  } = useEmployeeBookingDetails(staff?.id, isOpen && staff !== null);

  const [isEditing, setIsEditing] = useState(false);
  const [editPosition, setEditPosition] = useState('');
  const [editHireDate, setEditHireDate] = useState('');
  const [editError, setEditError] = useState<string | null>(null);

  useEffect(() => {
    if (staff) {
      setEditPosition(staff.position);
      setEditHireDate(staff.hireDate.slice(0, 10));
    }
    setIsEditing(false);
    setEditError(null);
  }, [staff]);

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!staff) return null;

  function handleDeactivate() {
    deactivateEmployee.mutate(staff!.id, { onSuccess: onClose });
  }

  function handleSaveEdit() {
    setEditError(null);
    updateEmployee.mutate(
      { id: staff!.id, data: { position: editPosition, hireDate: editHireDate } },
      {
        onSuccess: () => setIsEditing(false),
        onError: () => setEditError('Failed to update employee.'),
      },
    );
  }

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
          <h2 className="text-lg font-semibold text-gray-900">
            {staff.firstName} {staff.lastName}
          </h2>
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
            <img src="/images/avatar-staff.png" alt="Staff avatar" className="w-16 h-16 rounded-full object-cover" />
            <p className="text-lg font-semibold text-gray-900 text-center mt-3">
              {staff.firstName} {staff.lastName}
            </p>
            <div className="mt-1">
              <Badge variant={statusVariant(staff.status)} label={statusLabel(staff.status)} />
            </div>
          </div>

          {/* Contact info */}
          {!isEditing ? (
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
                <span className="text-xs text-gray-500">Position</span>
                <span className="text-sm text-gray-900">{staff.position}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Hired</span>
                <span className="text-sm text-gray-900">
                  {new Date(staff.hireDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Position</label>
                <select
                  value={editPosition}
                  onChange={(e) => setEditPosition(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {POSITIONS.map((p) => (
                    <option key={p} value={p}>{p.charAt(0) + p.slice(1).toLowerCase()}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Hire date</label>
                <input
                  type="date"
                  value={editHireDate}
                  onChange={(e) => setEditHireDate(e.target.value)}
                  max={new Date().toISOString().slice(0, 10)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              {editError && <p className="text-xs text-red-600">{editError}</p>}
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => { setIsEditing(false); setEditError(null); }}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" isLoading={updateEmployee.isPending} onClick={handleSaveEdit}>
                  Save
                </Button>
              </div>
            </div>
          )}

          {/* Recent jobs */}
          {!isEditing && (
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-2">Recent jobs</p>
              {recentJobsLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="h-16 rounded-xl bg-gray-100 animate-pulse" />
                  ))}
                </div>
              ) : recentJobsError ? (
                <p className="text-sm text-red-600">Could not load recent job history.</p>
              ) : (recentJobs ?? []).length === 0 ? (
                <p className="text-sm text-gray-400 italic">No job history yet.</p>
              ) : (
                <div className="space-y-2">
                  {(recentJobs ?? []).slice(0, 5).map((job) => (
                    <div key={job.id} className="rounded-xl border border-gray-200 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900">{job.washServiceName}</p>
                          <p className="text-xs text-gray-500 mt-1">{formatJobDateTime(job.appointmentDateTime)}</p>
                          <p className="text-xs text-gray-500 mt-1">Vehicle {job.vehicleLicensePlate}</p>
                        </div>
                        <Badge variant={bookingStatusVariant(job.status)} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 flex-shrink-0">
          {staff.status === 'PENDING' ? (
            <Button
              size="sm"
              isLoading={activateEmployee.isPending}
              onClick={() => activateEmployee.mutate(staff.id, { onSuccess: onClose })}
            >
              Activate
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                isLoading={deactivateEmployee.isPending}
                onClick={handleDeactivate}
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                Deactivate
              </Button>
              <Button size="sm" onClick={() => setIsEditing(true)}>
                Edit info
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Skeleton rows ────────────────────────────────────────────────────────────

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="border-b border-gray-100">
          {Array.from({ length: 5 }).map((__, j) => (
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

export function AdminStaffPage() {
  const { data: employees, isLoading, isError } = useAllEmployees();
  const activateEmployee = useActivateEmployee();

  const [activeTab, setActiveTab]         = useState<TabKey>('all');
  const [search, setSearch]               = useState('');
  const [selectedStaff, setSelectedStaff] = useState<EmployeeResponse | null>(null);

  const allEmployees   = employees ?? [];
  const tabFiltered    = filterByTab(allEmployees, activeTab);
  const visibleStaff   = applySearch(tabFiltered, search);

  const topBar = (
    <>
      <span className="text-lg font-semibold text-gray-900">Staff</span>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
          {isError ? (
            <div className="py-12">
              <ErrorState message="Could not load staff." />
            </div>
          ) : (
            <Table>
              <TableHead>
                <tr>
                  <TableHeader>Staff member</TableHeader>
                  <TableHeader>Phone</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader className="text-right">Position</TableHeader>
                  <TableHeader className="w-24">
                    <span className="sr-only">Actions</span>
                  </TableHeader>
                </tr>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <SkeletonRows />
                ) : (
                  visibleStaff.map((staff) => (
                    <TableRow
                      key={staff.id}
                      onClick={() => setSelectedStaff(staff)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img src="/images/avatar-staff.png" alt="Avatar" className="w-8 h-8 rounded-full flex-shrink-0 object-cover" />
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {staff.firstName} {staff.lastName}
                            </p>
                            <p className="text-xs text-gray-500">{staff.email}</p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>{staff.phone}</TableCell>

                      <TableCell>
                        <Badge variant={statusVariant(staff.status)} label={statusLabel(staff.status)} />
                      </TableCell>

                      <TableCell className="text-right">
                        <span className="text-sm text-gray-700">{staff.position}</span>
                      </TableCell>

                      <TableCell className="text-right">
                        {staff.status === 'PENDING' ? (
                          <Button
                            size="sm"
                            isLoading={activateEmployee.isPending}
                            onClick={(e) => {
                              e.stopPropagation();
                              activateEmployee.mutate(staff.id);
                            }}
                          >
                            Activate
                          </Button>
                        ) : (
                          <button
                            type="button"
                            aria-label="Staff actions"
                            onClick={(e) => {
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
                  ))
                )}
              </TableBody>
            </Table>
          )}
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

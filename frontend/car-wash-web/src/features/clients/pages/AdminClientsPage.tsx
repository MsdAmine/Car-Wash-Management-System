import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { AdminLayout } from '@/shared/components/layout/AdminLayout';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { ErrorState } from '@/shared/components/feedback/ErrorState';
import {
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from '@/shared/components/ui/Table';
import { useAllClients } from '@/features/clients/hooks/useAllClients';
import { useVehiclesByCustomer } from '@/features/vehicles/hooks/useVehiclesByCustomer';
import { useAllBookings } from '@/features/admin/hooks/useAllBookings';
import { ROUTES } from '@/router/routes';
import type { CustomerResponse } from '../types';
import type { BookingResponse } from '@/features/bookings/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// ─── Skeleton rows ────────────────────────────────────────────────────────────

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="border-b border-gray-100">
          {Array.from({ length: 4 }).map((__, j) => (
            <td key={j} className="px-4 py-3">
              <div className="h-4 bg-gray-100 rounded animate-pulse" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// ─── Client detail panel ──────────────────────────────────────────────────────

interface ClientDetailPanelProps {
  client: CustomerResponse;
  onClose: () => void;
}

function ClientDetailPanel({ client, onClose }: ClientDetailPanelProps) {
  const navigate = useNavigate();

  const { data: vehicles = [], isLoading: vehiclesLoading } = useVehiclesByCustomer(client.id, true);
  const { data: allBookings = [] } = useAllBookings();
  const recentBookings = allBookings
    .filter((b) => b.customerEmail === client.email)
    .sort((a, b) => new Date(b.appointmentDateTime).getTime() - new Date(a.appointmentDateTime).getTime())
    .slice(0, 3);

  function handleCreateBooking() {
    onClose();
    navigate(`${ROUTES.ADMIN.BOOKINGS}?clientId=${client.id}`);
  }

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white border-l border-gray-200 shadow-xl z-30 flex flex-col">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <span className="text-base font-semibold text-gray-900">Client details</span>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">
        {/* Identity */}
        <div>
          <p className="text-lg font-semibold text-gray-900">
            {client.firstName} {client.lastName}
          </p>
          <p className="text-sm text-gray-500 mt-0.5">{client.email}</p>
        </div>

        {/* Contact */}
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Contact</p>
          <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-900">
            {client.phone || '—'}
          </div>
        </div>

        {/* Vehicles */}
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Vehicles</p>
          {vehiclesLoading ? (
            <div className="h-9 bg-gray-100 rounded-lg animate-pulse" />
          ) : vehicles.length === 0 ? (
            <p className="text-sm text-gray-400">No vehicles registered.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {vehicles.map((v) => (
                <div key={v.id} className="bg-gray-50 rounded-lg px-3 py-2 text-sm">
                  <span className="font-medium text-gray-900">{v.brand} {v.model}</span>
                  <span className="text-gray-500 ml-2">· {v.licensePlate}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent bookings */}
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Recent bookings</p>
          {recentBookings.length === 0 ? (
            <p className="text-sm text-gray-400">No bookings yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {recentBookings.map((b) => (
                <div key={b.id} className="bg-gray-50 rounded-lg px-3 py-2 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{b.washServiceName}</p>
                    <p className="text-xs text-gray-500">{new Date(b.appointmentDateTime).toLocaleDateString()}</p>
                  </div>
                  <Badge variant={statusToVariant(b.status)} />
                </div>
              ))}
            </div>
          )}
        </div>

        <Button variant="primary" size="sm" onClick={handleCreateBooking}>
          Create booking for this client
        </Button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function AdminClientsPage() {
  const { data: clients, isLoading, isError } = useAllClients();
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<CustomerResponse | null>(null);

  const filtered = (clients ?? []).filter((c) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      c.email.toLowerCase().includes(q) ||
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(q)
    );
  });

  const topBar = (
    <span className="text-lg font-semibold text-gray-900">Clients</span>
  );

  return (
    <>
      <AdminLayout topBar={topBar}>
        {/* Search */}
        <div className="mb-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email"
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Table card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {isError ? (
            <div className="py-12">
              <ErrorState message="Could not load clients." />
            </div>
          ) : (
            <Table>
              <TableHead>
                <tr>
                  <TableHeader>Name</TableHeader>
                  <TableHeader>Email</TableHeader>
                  <TableHeader>Phone</TableHeader>
                  <TableHeader className="w-24">
                    <span className="sr-only">Actions</span>
                  </TableHeader>
                </tr>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <SkeletonRows />
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4}>
                      <EmptyState
                        title="No clients yet"
                        subtitle="Registered clients will appear here."
                      />
                    </td>
                  </tr>
                ) : (
                  filtered.map((client) => (
                    <TableRow key={client.id} selected={selectedClient?.id === client.id}>
                      <TableCell>
                        <span className="text-sm font-semibold text-gray-900">
                          {client.firstName} {client.lastName}
                        </span>
                      </TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.phone || '—'}</TableCell>
                      <TableCell className="w-24 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedClient(client)}
                          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
                        >
                          View
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </AdminLayout>

      {selectedClient && (
        <ClientDetailPanel
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
        />
      )}
    </>
  );
}

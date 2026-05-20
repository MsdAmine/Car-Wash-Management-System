import { useState, useEffect } from 'react';
import { Search, X, Car } from 'lucide-react';
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

const MOCK_CLIENTS = [
  { id: '1', name: 'Alex Morgan',  email: 'alex@example.com',  phone: '+1 555 0192', vehicleCount: 2, totalBookings: 8,  lastBooking: 'May 19, 2025', joinedAt: 'Jan 5, 2025' },
  { id: '2', name: 'Sarah Chen',   email: 'sarah@example.com', phone: '+1 555 0284', vehicleCount: 1, totalBookings: 3,  lastBooking: 'May 17, 2025', joinedAt: 'Feb 14, 2025' },
  { id: '3', name: 'Mike Torres',  email: 'mike@example.com',  phone: '+1 555 0371', vehicleCount: 3, totalBookings: 12, lastBooking: 'May 15, 2025', joinedAt: 'Nov 20, 2024' },
  { id: '4', name: 'Dana Wu',      email: 'dana@example.com',  phone: '+1 555 0445', vehicleCount: 1, totalBookings: 1,  lastBooking: 'May 10, 2025', joinedAt: 'May 1, 2025' },
  { id: '5', name: 'Chris Park',   email: 'chris@example.com', phone: '+1 555 0512', vehicleCount: 2, totalBookings: 5,  lastBooking: 'Apr 28, 2025', joinedAt: 'Dec 3, 2024' },
];

const MOCK_CLIENT_VEHICLES = [
  { id: '1', make: 'Toyota', model: 'Camry', plate: 'ABC-1234', type: 'Sedan' },
  { id: '2', make: 'Ford',   model: 'F-150', plate: 'XYZ-9876', type: 'Truck' },
];

const MOCK_CLIENT_BOOKINGS = [
  { ref: 'CW-000101', service: 'Full Detail',  date: 'May 19, 2025', status: 'inProgress' as const },
  { ref: 'CW-000085', service: 'Basic Wash',   date: 'May 12, 2025', status: 'completed' as const },
  { ref: 'CW-000079', service: 'Express Wash', date: 'Apr 28, 2025', status: 'cancelled' as const },
];

// ─── Filter helper ────────────────────────────────────────────────────────────

function applySearch(clients: typeof MOCK_CLIENTS, query: string): typeof MOCK_CLIENTS {
  const q = query.trim().toLowerCase();
  if (!q) return clients;
  return clients.filter(
    c =>
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q),
  );
}

// ─── ClientDetailPanel ────────────────────────────────────────────────────────

interface ClientDetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  client: (typeof MOCK_CLIENTS)[0] | null;
}

function ClientDetailPanel({ isOpen, onClose, client }: ClientDetailPanelProps) {
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!client) return null;

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
          <h2 className="text-lg font-semibold text-gray-900">{client.name}</h2>
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
            <ImagePlaceholder label="Client avatar" className="w-16 h-16 rounded-full mx-auto" />
            <p className="text-lg font-semibold text-gray-900 text-center mt-3">{client.name}</p>
            <p className="text-sm text-gray-500 text-center mt-0.5">{client.email}</p>
          </div>

          {/* Contact card */}
          <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Phone</span>
              <span className="text-sm text-gray-900">{client.phone}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Joined</span>
              <span className="text-sm text-gray-900">{client.joinedAt}</span>
            </div>
          </div>

          {/* Vehicles */}
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-3">Saved vehicles</p>
            <div className="flex flex-col gap-2">
              {MOCK_CLIENT_VEHICLES.map(vehicle => (
                <div
                  key={vehicle.id}
                  className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3"
                >
                  <Car className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {vehicle.make} {vehicle.model}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-500">{vehicle.plate}</span>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-gray-100 text-xs text-gray-500">
                        {vehicle.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent bookings */}
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-3">Recent bookings</p>
            <div className="flex flex-col gap-2">
              {MOCK_CLIENT_BOOKINGS.map(booking => (
                <div
                  key={booking.ref}
                  className="bg-white border border-gray-200 rounded-lg p-3 flex justify-between items-center"
                >
                  <div>
                    <p className="font-mono text-xs text-gray-500">{booking.ref}</p>
                    <p className="text-sm text-gray-900 mt-0.5">{booking.service}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{booking.date}</p>
                  </div>
                  <Badge variant={booking.status} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex-shrink-0">
          <Button
            size="sm"
            className="w-full"
            onClick={() => console.log('create booking for', client.id)}
          >
            Create booking for this client
          </Button>
        </div>
      </div>
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function AdminClientsPage() {
  const [search, setSearch]                 = useState('');
  const [selectedClient, setSelectedClient] = useState<(typeof MOCK_CLIENTS)[0] | null>(null);

  const visibleClients = applySearch(MOCK_CLIENTS, search);

  const topBar = (
    <>
      <span className="text-lg font-semibold text-gray-900">Clients</span>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email or phone"
          className="w-56 pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        />
      </div>
    </>
  );

  return (
    <>
      <AdminLayout topBar={topBar}>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <Table>
            <TableHead>
              <tr>
                <TableHeader>Client</TableHeader>
                <TableHeader>Phone</TableHeader>
                <TableHeader className="text-center">Vehicles</TableHeader>
                <TableHeader className="text-center">Total bookings</TableHeader>
                <TableHeader>Last booking</TableHeader>
                <TableHeader className="w-24">
                  <span className="sr-only">Actions</span>
                </TableHeader>
              </tr>
            </TableHead>
            <TableBody>
              {visibleClients.map(client => (
                <TableRow
                  key={client.id}
                  onClick={() => setSelectedClient(client)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <ImagePlaceholder label="Avatar" className="w-8 h-8 rounded-full flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{client.name}</p>
                        <p className="text-xs text-gray-500">{client.email}</p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="text-sm text-gray-700">{client.phone}</span>
                  </TableCell>

                  <TableCell className="text-center">
                    <span className="text-sm text-gray-700">{client.vehicleCount}</span>
                  </TableCell>

                  <TableCell className="text-center">
                    <span className="text-sm text-gray-700">{client.totalBookings}</span>
                  </TableCell>

                  <TableCell>
                    <span className="text-sm text-gray-700">{client.lastBooking}</span>
                  </TableCell>

                  <TableCell className="text-right">
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedClient(client);
                      }}
                      className="text-sm text-indigo-600 hover:text-indigo-700 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
                    >
                      View
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </AdminLayout>

      <ClientDetailPanel
        isOpen={selectedClient !== null}
        onClose={() => setSelectedClient(null)}
        client={selectedClient}
      />
    </>
  );
}

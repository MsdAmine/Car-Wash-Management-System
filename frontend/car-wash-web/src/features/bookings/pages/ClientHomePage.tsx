import { CalendarPlus, Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';
import { ImagePlaceholder } from '@/shared/components/ui/ImagePlaceholder';
import { ClientLayout } from '@/shared/components/layout/ClientLayout';

// ─── Mock data (not exported) ────────────────────────────────────────────────

const MOCK_USER = { firstName: 'Alex', lastName: 'Morgan' };

const MOCK_UPCOMING_BOOKING: UpcomingBooking | null = {
  id: '1',
  service: 'Full Detail',
  date: 'Monday, 19 May 2025',
  time: '10:00',
  vehicle: 'Toyota Camry',
  washer: 'James K.',
  status: 'confirmed',
};

const MOCK_VEHICLES: Vehicle[] = [
  { id: '1', make: 'Toyota', model: 'Camry', plate: 'ABC-1234' },
  { id: '2', make: 'Ford', model: 'F-150', plate: 'XYZ-9876' },
];

const MOCK_RECENT_BOOKINGS: RecentBooking[] = [
  { id: '1', service: 'Basic Wash', date: 'May 12, 2025', status: 'completed' },
  { id: '2', service: 'Express Wash', date: 'May 5, 2025', status: 'completed' },
  { id: '3', service: 'Full Detail', date: 'Apr 28, 2025', status: 'cancelled' },
];

const MOCK_QUICK_SERVICES: QuickService[] = [
  { id: '1', name: 'Basic Wash', price: 15, duration: 30 },
  { id: '2', name: 'Express Wash', price: 10, duration: 20 },
  { id: '3', name: 'Full Detail', price: 65, duration: 90 },
];

// ─── Types ────────────────────────────────────────────────────────────────────

type BookingStatus = 'pending' | 'confirmed' | 'inProgress' | 'completed' | 'cancelled';

interface UpcomingBooking {
  id: string;
  service: string;
  date: string;
  time: string;
  vehicle: string;
  washer: string;
  status: BookingStatus;
}

interface Vehicle {
  id: string;
  make: string;
  model: string;
  plate: string;
}

interface RecentBooking {
  id: string;
  service: string;
  date: string;
  status: BookingStatus;
}

interface QuickService {
  id: string;
  name: string;
  price: number;
  duration: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function formatTodayDate(): string {
  const d = new Date();
  return `${DAY_NAMES[d.getDay()]}, ${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

const statusBorderClass: Record<BookingStatus, string> = {
  confirmed: 'border-l-indigo-500',
  inProgress: 'border-l-amber-500',
  pending: 'border-l-gray-400',
  completed: 'border-l-green-500',
  cancelled: 'border-l-red-500',
};

// ─── Upcoming booking card ────────────────────────────────────────────────────

interface UpcomingBookingCardProps {
  booking: UpcomingBooking;
}

function UpcomingBookingCard({ booking }: UpcomingBookingCardProps) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 border-l-4 ${statusBorderClass[booking.status]} p-5 flex justify-between items-start`}
    >
      <div>
        <p className="text-base font-semibold text-gray-900">{booking.service}</p>
        <p className="text-sm text-gray-500 mt-1">
          {booking.date} at {booking.time}
        </p>
        <p className="text-sm text-gray-500 mt-0.5">{booking.vehicle}</p>
        <p className="text-sm text-gray-500 mt-0.5">Washer: {booking.washer}</p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <Badge variant={booking.status} />
        <div className="flex flex-col gap-2 mt-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => console.log('reschedule', booking.id)}
          >
            Reschedule
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => console.log('cancel', booking.id)}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

function UpcomingEmptyState() {
  return (
    <div className="border-dashed border-2 border-gray-300 bg-white rounded-xl p-8 text-center">
      <CalendarPlus className="w-8 h-8 text-gray-400 mx-auto" />
      <p className="text-base font-semibold text-gray-900 mt-3">No upcoming bookings</p>
      <p className="text-sm text-gray-500 mt-1">Book your first wash to get started.</p>
      <div className="mt-4 flex justify-center">
        <Button variant="primary" size="sm" onClick={() => console.log('book a wash')}>
          Book a wash
        </Button>
      </div>
    </div>
  );
}

// ─── Quick book ───────────────────────────────────────────────────────────────

interface QuickServiceCardProps {
  service: QuickService;
}

function QuickServiceCard({ service }: QuickServiceCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => console.log('quick book', service.id)}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          console.log('quick book', service.id);
        }
      }}
      className="bg-white rounded-xl border border-gray-200 p-4 hover:border-indigo-300 hover:shadow-sm cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
    >
      <ImagePlaceholder label={service.name} aspectRatio="video" className="w-full mb-3" />
      <p className="text-sm font-semibold text-gray-900">{service.name}</p>
      <div className="flex justify-between items-center mt-1">
        <span className="text-sm text-gray-900">${service.price}</span>
        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
          {service.duration} min
        </span>
      </div>
      <Button
        variant="primary"
        size="sm"
        className="w-full mt-3"
        onClick={e => {
          e.stopPropagation();
          console.log('quick book', service.id);
        }}
      >
        Book
      </Button>
    </div>
  );
}

// ─── Vehicle strip ────────────────────────────────────────────────────────────

interface VehicleCardProps {
  vehicle: Vehicle;
}

function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex-shrink-0 w-48">
      <ImagePlaceholder label="Vehicle photo" aspectRatio="square" className="w-full mb-3" />
      <p className="text-sm font-semibold text-gray-900">
        {vehicle.make} {vehicle.model}
      </p>
      <p className="text-xs text-gray-500 mt-0.5">{vehicle.plate}</p>
    </div>
  );
}

function AddVehicleCard() {
  return (
    <button
      type="button"
      onClick={() => console.log('add vehicle')}
      className="flex-shrink-0 w-48 bg-white rounded-xl border-2 border-dashed border-gray-300 p-4 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
    >
      <Plus className="w-6 h-6 text-gray-400" />
      <span className="text-xs text-gray-500 mt-1">Add vehicle</span>
    </button>
  );
}

// ─── Recent activity ──────────────────────────────────────────────────────────

interface RecentBookingRowProps {
  booking: RecentBooking;
}

function RecentBookingRow({ booking }: RecentBookingRowProps) {
  return (
    <div className="bg-white px-5 py-4 flex justify-between items-center">
      <div>
        <p className="text-sm font-semibold text-gray-900">{booking.service}</p>
        <p className="text-xs text-gray-500 mt-0.5">{booking.date}</p>
      </div>
      <Badge variant={booking.status} />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ClientHomePage() {
  const todayDate = formatTodayDate();
  const greeting = getGreeting();

  return (
    <ClientLayout>
      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Section 1 — Greeting */}
        <section>
          <h1 className="text-2xl font-semibold text-gray-900">
            {greeting}, {MOCK_USER.firstName}
          </h1>
          <p className="text-sm text-gray-500">{todayDate}</p>
        </section>

        {/* Section 2 — Upcoming booking */}
        <section className="mt-6">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
            Upcoming
          </p>
          {MOCK_UPCOMING_BOOKING !== null ? (
            <UpcomingBookingCard booking={MOCK_UPCOMING_BOOKING} />
          ) : (
            <UpcomingEmptyState />
          )}
        </section>

        {/* Section 3 — Quick book */}
        <section className="mt-8">
          <div className="flex justify-between items-center mb-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Quick book
            </p>
            <a
              href="#"
              onClick={e => e.preventDefault()}
              className="text-sm text-indigo-600 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
            >
              See all services
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {MOCK_QUICK_SERVICES.map(service => (
              <QuickServiceCard key={service.id} service={service} />
            ))}
          </div>
        </section>

        {/* Section 4 — My vehicles */}
        <section className="mt-8">
          <div className="flex justify-between items-center mb-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              My vehicles
            </p>
            <a
              href="#"
              onClick={e => e.preventDefault()}
              className="text-sm text-indigo-600 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
            >
              Manage vehicles
            </a>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {MOCK_VEHICLES.map(vehicle => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
            <AddVehicleCard />
          </div>
        </section>

        {/* Section 5 — Recent activity */}
        <section className="mt-8">
          <div className="flex justify-between items-center mb-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Recent activity
            </p>
            <a
              href="#"
              onClick={e => e.preventDefault()}
              className="text-sm text-indigo-600 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
            >
              View all
            </a>
          </div>
          <div className="rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
            {MOCK_RECENT_BOOKINGS.map(booking => (
              <RecentBookingRow key={booking.id} booking={booking} />
            ))}
          </div>
        </section>
      </main>
    </ClientLayout>
  );
}

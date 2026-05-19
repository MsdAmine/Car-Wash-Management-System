import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { AdminLayout } from '@/shared/components/layout/AdminLayout';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';

// ─── Mock data ───────────────────────────────────────────────────────────────

const MOCK_STATS = {
  todayBookings: 12,
  todayBookingsTrend: '+3 vs yesterday',
  revenueToday: 485,
  revenueTrend: '+$120 vs yesterday',
  activeWashes: 3,
  activeWashesTrend: 'Right now',
  staffOnDuty: 5,
  staffTrend: '2 available',
};

const MOCK_ACTIVE_BOOKINGS = [
  { id: '1', ref: 'CW-000101', client: 'Alex Morgan', service: 'Full Detail', time: '10:00', washer: 'James K.', status: 'inProgress' as const },
  { id: '2', ref: 'CW-000103', client: 'Sarah Chen', service: 'Basic Wash', time: '11:00', washer: 'Maria L.', status: 'confirmed' as const },
  { id: '3', ref: 'CW-000105', client: 'Mike Torres', service: 'Express Wash', time: '11:30', washer: null, status: 'confirmed' as const },
];

const MOCK_UNASSIGNED = [
  { id: '3', ref: 'CW-000105', client: 'Mike Torres', service: 'Express Wash', time: '11:30' },
  { id: '4', ref: 'CW-000107', client: 'Dana Wu', service: 'Premium Detail', time: '14:00' },
];

const MOCK_CHART_DATA = [
  { day: 'Mon', revenue: 320 },
  { day: 'Tue', revenue: 480 },
  { day: 'Wed', revenue: 290 },
  { day: 'Thu', revenue: 510 },
  { day: 'Fri', revenue: 620 },
  { day: 'Sat', revenue: 750 },
  { day: 'Sun', revenue: 410 },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  trend: string;
  prefix?: string;
}

function StatCard({ label, value, trend, prefix }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">
        {prefix}{value}
      </p>
      <p className="text-xs text-gray-500 mt-1">{trend}</p>
    </div>
  );
}

type ChartPeriod = 'daily' | 'weekly' | 'monthly';

function RevenueChart() {
  const [period, setPeriod] = useState<ChartPeriod>('weekly');

  const maxRevenue = Math.max(...MOCK_CHART_DATA.map((d) => d.revenue));
  const slotWidth = 700 / MOCK_CHART_DATA.length;
  const barWidth = 60;
  const maxBarHeight = 140;
  const barsBottom = 155;

  const periods: { key: ChartPeriod; label: string }[] = [
    { key: 'daily', label: 'Daily' },
    { key: 'weekly', label: 'Weekly' },
    { key: 'monthly', label: 'Monthly' },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-semibold text-gray-900">Revenue — Last 7 days</h2>
        <div className="flex gap-1">
          {periods.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setPeriod(key)}
              className={`text-sm px-3 py-1 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                period === key
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full h-48">
        <svg
          viewBox="0 0 700 180"
          preserveAspectRatio="none"
          className="w-full h-full"
          aria-label="Revenue bar chart"
          role="img"
        >
          {MOCK_CHART_DATA.map((d, i) => {
            const barHeight = (d.revenue / maxRevenue) * maxBarHeight;
            const barX = i * slotWidth + (slotWidth - barWidth) / 2;
            const barY = barsBottom - barHeight;
            const labelX = i * slotWidth + slotWidth / 2;

            return (
              <g key={d.day}>
                <rect
                  x={barX}
                  y={barY}
                  width={barWidth}
                  height={barHeight}
                  fill="#4F46E5"
                  rx="4"
                />
                <text
                  x={labelX}
                  y={175}
                  fontSize="11"
                  fill="#6B7280"
                  textAnchor="middle"
                >
                  {d.day}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function ActiveBookingsList() {
  return (
    <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-base font-semibold text-gray-900">Active bookings</h2>
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium">
          {MOCK_ACTIVE_BOOKINGS.length}
        </span>
      </div>

      <div className="flex flex-col divide-y divide-gray-100">
        {MOCK_ACTIVE_BOOKINGS.map((booking) => (
          <div key={booking.id} className="py-3 flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900">{booking.client}</p>
              <p className="font-mono text-xs text-gray-500">
                {booking.ref} &middot; {booking.service}
              </p>
            </div>

            <p className="text-sm text-gray-500 mx-6 shrink-0">{booking.time}</p>

            <div className="flex items-center gap-3 shrink-0">
              {booking.washer ? (
                <span className="text-sm text-gray-700">{booking.washer}</span>
              ) : (
                <span className="text-sm text-red-500 font-medium">Unassigned</span>
              )}
              <Badge variant={booking.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UnassignedStrip() {
  return (
    <div className="col-span-1 bg-white rounded-xl border border-gray-200 border-l-4 border-l-red-500 p-5">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
        <h2 className="text-sm font-semibold text-red-700">Needs attention</h2>
      </div>

      <div className="flex flex-col gap-3">
        {MOCK_UNASSIGNED.map((item) => (
          <div key={item.id} className="bg-red-50 rounded-lg p-3">
            <p className="font-mono text-xs text-red-400">{item.ref}</p>
            <p className="text-sm text-gray-900">{item.client} &middot; {item.service}</p>
            <p className="text-xs text-gray-500 mt-0.5">{item.time}</p>
            <Button
              variant="primary"
              size="sm"
              className="w-full mt-2"
              onClick={() => console.log('assign', item.id)}
            >
              Assign washer
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function AdminDashboardPage() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const topBar = (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
        <span className="text-sm text-gray-500 ml-3">{today}</span>
      </div>
      <Button size="sm" onClick={() => console.log('new booking')}>
        + New booking
      </Button>
    </>
  );

  return (
    <AdminLayout topBar={topBar}>
      {/* Section 1 — Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Today's Bookings"
          value={MOCK_STATS.todayBookings}
          trend={MOCK_STATS.todayBookingsTrend}
        />
        <StatCard
          label="Revenue Today"
          value={MOCK_STATS.revenueToday}
          trend={MOCK_STATS.revenueTrend}
          prefix="$"
        />
        <StatCard
          label="Active Washes"
          value={MOCK_STATS.activeWashes}
          trend={MOCK_STATS.activeWashesTrend}
        />
        <StatCard
          label="Staff on Duty"
          value={MOCK_STATS.staffOnDuty}
          trend={MOCK_STATS.staffTrend}
        />
      </div>

      {/* Section 2 — Revenue chart */}
      <RevenueChart />

      {/* Section 3 — Active bookings + Unassigned strip */}
      <div className="grid grid-cols-3 gap-4">
        <ActiveBookingsList />
        <UnassignedStrip />
      </div>
    </AdminLayout>
  );
}

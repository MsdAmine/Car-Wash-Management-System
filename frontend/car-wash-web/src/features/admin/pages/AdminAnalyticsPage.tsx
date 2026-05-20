import { useState } from 'react';
import { Download } from 'lucide-react';
import { AdminLayout } from '@/shared/components/layout/AdminLayout';
import { Button } from '@/shared/components/ui/Button';
import { ErrorState } from '@/shared/components/feedback/ErrorState';
import { useRevenueTimeSeries } from '@/features/admin/hooks/useRevenueTimeSeries';

// ─── Mock data (no dedicated endpoints yet) ───────────────────────────────────

// TODO: replace MOCK_BY_SERVICE with a bookings-by-service endpoint
const MOCK_BY_SERVICE = [
  { label: 'Basic Wash',     value: 38, color: '#4F46E5' },
  { label: 'Express Wash',   value: 22, color: '#7C3AED' },
  { label: 'Full Detail',    value: 28, color: '#2563EB' },
  { label: 'Premium Detail', value: 12, color: '#0891B2' },
];

// TODO: replace MOCK_HEATMAP with a booking activity endpoint
const MOCK_HEATMAP = {
  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  slots: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
  data: [
    [2, 3, 4, 3, 5, 6, 4],
    [3, 5, 6, 7, 8, 9, 6],
    [4, 6, 7, 8, 7, 8, 5],
    [3, 5, 6, 7, 6, 7, 4],
    [2, 3, 4, 5, 4, 5, 3],
    [1, 2, 3, 4, 3, 4, 2],
    [1, 2, 2, 3, 2, 3, 2],
    [2, 3, 4, 5, 4, 5, 3],
    [1, 2, 3, 4, 3, 4, 2],
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function donutSegmentPath(
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  startAngle: number,
  endAngle: number,
): string {
  const os = polarToCartesian(cx, cy, outerR, startAngle);
  const oe = polarToCartesian(cx, cy, outerR, endAngle);
  const is = polarToCartesian(cx, cy, innerR, startAngle);
  const ie = polarToCartesian(cx, cy, innerR, endAngle);
  const large = endAngle - startAngle > 180 ? '1' : '0';
  return [
    `M ${os.x} ${os.y}`,
    `A ${outerR} ${outerR} 0 ${large} 1 ${oe.x} ${oe.y}`,
    `L ${ie.x} ${ie.y}`,
    `A ${innerR} ${innerR} 0 ${large} 0 ${is.x} ${is.y}`,
    'Z',
  ].join(' ');
}

function heatColor(value: number): string {
  if (value <= 1) return 'bg-indigo-50';
  if (value <= 3) return 'bg-indigo-100';
  if (value <= 5) return 'bg-indigo-200';
  if (value <= 7) return 'bg-indigo-400';
  return 'bg-indigo-600';
}

// ─── Sub-components ───────────────────────────────────────────────────────────

type ChartPeriod = 'daily' | 'weekly' | 'monthly';

const PERIODS: { key: ChartPeriod; label: string }[] = [
  { key: 'daily',   label: 'Daily' },
  { key: 'weekly',  label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
];

function RevenueChart() {
  const [period, setPeriod] = useState<ChartPeriod>('daily');
  const { data: revenueData, isLoading: revenueLoading, isError: revenueError } =
    useRevenueTimeSeries(period, 7);

  const slotWidth = 700 / Math.max(revenueData?.length ?? 1, 1);
  const barWidth = 60;
  const maxBarHeight = 140;
  const barsBottom = 155;
  const maxValue = revenueData && revenueData.length > 0
    ? Math.max(...revenueData.map((d) => d.revenue), 1)
    : 1;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-semibold text-gray-900">Revenue over time</h2>
        <div className="flex gap-1">
          {PERIODS.map(({ key, label }) => (
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
        {revenueLoading ? (
          <div className="w-full h-full bg-gray-100 animate-pulse rounded-lg" />
        ) : revenueError ? (
          <div className="w-full h-full flex items-center justify-center">
            <ErrorState message="Could not load revenue data." />
          </div>
        ) : (
          <svg
            viewBox="0 0 700 180"
            preserveAspectRatio="none"
            className="w-full h-full"
            aria-label="Revenue bar chart"
            role="img"
          >
            {(revenueData ?? []).map((d, i) => {
              const barHeight = (d.revenue / maxValue) * maxBarHeight;
              const barX = i * slotWidth + (slotWidth - barWidth) / 2;
              const barY = barsBottom - barHeight;
              const labelX = i * slotWidth + slotWidth / 2;
              return (
                <g key={d.label}>
                  <rect x={barX} y={barY} width={barWidth} height={barHeight} fill="#4F46E5" rx="4" />
                  <text x={labelX} y={175} fontSize="11" fill="#6B7280" textAnchor="middle">
                    {d.label}
                  </text>
                </g>
              );
            })}
          </svg>
        )}
      </div>
    </div>
  );
}

function BookingsByService() {
  const total = MOCK_BY_SERVICE.reduce((sum, d) => sum + d.value, 0);
  const cx = 100;
  const cy = 100;
  const outerR = 80;
  const innerR = 50;

  const segments = (() => {
    let angle = 0;
    return MOCK_BY_SERVICE.map((seg) => {
      const startAngle = angle;
      const endAngle = angle + (seg.value / total) * 360;
      angle = endAngle;
      return { ...seg, startAngle, endAngle };
    });
  })();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="text-base font-semibold text-gray-900 mb-4">Bookings by service</h2>

      <svg viewBox="0 0 200 200" className="w-48 h-48 mx-auto">
        {segments.map((seg) => (
          <path
            key={seg.label}
            d={donutSegmentPath(cx, cy, outerR, innerR, seg.startAngle, seg.endAngle)}
            fill={seg.color}
          />
        ))}
        <text fontSize="12" fill="#6B7280" textAnchor="middle" x={cx} y={cy} dy="-6">
          Total
        </text>
        <text fontSize="20" fontWeight="bold" fill="#111827" textAnchor="middle" x={cx} y={cy} dy="16">
          {total}
        </text>
      </svg>

      <div className="flex flex-col gap-2 mt-4">
        {MOCK_BY_SERVICE.map((seg) => {
          const pct = Math.round((seg.value / total) * 100);
          return (
            <div key={seg.label} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: seg.color }}
              />
              <span className="text-sm text-gray-600">{seg.label}</span>
              <span className="text-sm font-semibold text-gray-900 ml-auto">{seg.value}</span>
              <span className="text-xs text-gray-400 ml-1">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ActivityHeatmap() {
  const { days, slots, data } = MOCK_HEATMAP;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="text-base font-semibold text-gray-900 mb-4">Booking activity</h2>

      <div className="ml-14 grid grid-cols-7 gap-1 mb-1">
        {days.map((day) => (
          <div key={day} className="text-xs text-gray-500 text-center">
            {day}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <div className="flex flex-col justify-around">
          {slots.map((slot) => (
            <div key={slot} className="text-xs text-gray-400 text-right w-12 flex-shrink-0">
              {slot}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-1 flex-1">
          {data.map((row, slotIdx) => (
            <div key={slots[slotIdx]} className="grid grid-cols-7 gap-1">
              {row.map((value, dayIdx) => (
                <div
                  key={days[dayIdx]}
                  className={`w-full aspect-square rounded-sm ${heatColor(value)}`}
                  title={`${days[dayIdx]} ${slots[slotIdx]}: ${value} bookings`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function AdminAnalyticsPage() {
  const topBar = (
    <>
      <h1 className="text-lg font-semibold text-gray-900">Analytics</h1>
      <div className="flex items-center gap-3">
        <input
          type="date"
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
        />
        <span className="text-sm text-gray-500">to</span>
        <input
          type="date"
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
        />
        <Button variant="ghost" size="sm" onClick={() => console.log('export')}>
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>
    </>
  );

  return (
    <AdminLayout topBar={topBar}>
      <div className="flex flex-col gap-6">
        <RevenueChart />
        <div className="grid grid-cols-2 gap-6">
          <BookingsByService />
          <ActivityHeatmap />
        </div>
      </div>
    </AdminLayout>
  );
}

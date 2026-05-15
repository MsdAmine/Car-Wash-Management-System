import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import dashboardService from '../services/dashboardService';
import bookingService from '../services/bookingService';
import type { AdminDashboardResponse, ServiceStatResponse } from '../types/dashboard';
import type { BookingResponse } from '../types/booking';
import BookingStatusBadge from '../components/BookingStatusBadge';
import StatsCard from '../components/StatsCard';

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(Number(amount));

const formatDateTime = (dt: string) =>
    new Date(dt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

const MiniIcon = () => (
    <span className="block h-2.5 w-2.5 rounded-full bg-current" aria-hidden="true" />
);

const ArrowIcon = () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
);

const RefreshIcon = ({ spinning = false }: { spinning?: boolean }) => (
    <svg className={`h-4 w-4 ${spinning ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992m0 0V4.356m0 4.992-3.181-3.183a8.25 8.25 0 1 0 2.227 7.852" />
    </svg>
);

const serviceShare = (service: ServiceStatResponse, topCount: number) => {
    if (topCount <= 0) return 0;
    return Math.round((service.bookingCount / topCount) * 100);
};

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<AdminDashboardResponse | null>(null);
    const [recentBookings, setRecentBookings] = useState<BookingResponse[]>([]);
    const [loadingStats, setLoadingStats] = useState(true);
    const [loadingBookings, setLoadingBookings] = useState(true);
    const [statsError, setStatsError] = useState<string | null>(null);
    const [bookingsError, setBookingsError] = useState<string | null>(null);

    const fetchStats = useCallback(async () => {
        setLoadingStats(true);
        setStatsError(null);
        try {
            const data = await dashboardService.getAdminDashboard();
            setStats(data);
        } catch {
            setStatsError('Failed to load dashboard data.');
        } finally {
            setLoadingStats(false);
        }
    }, []);

    const fetchBookings = useCallback(async () => {
        setLoadingBookings(true);
        setBookingsError(null);
        try {
            const data = await bookingService.getAll();
            setRecentBookings(
                [...data]
                    .sort((a, b) => new Date(b.appointmentDateTime).getTime() - new Date(a.appointmentDateTime).getTime())
                    .slice(0, 6)
            );
        } catch {
            setBookingsError('Failed to load recent bookings.');
        } finally {
            setLoadingBookings(false);
        }
    }, []);

    useEffect(() => {
        let active = true;

        dashboardService.getAdminDashboard()
            .then(data => {
                if (active) setStats(data);
            })
            .catch(() => {
                if (active) setStatsError('Failed to load dashboard data.');
            })
            .finally(() => {
                if (active) setLoadingStats(false);
            });

        bookingService.getAll()
            .then(data => {
                if (!active) return;
                setRecentBookings(
                    [...data]
                        .sort((a, b) => new Date(b.appointmentDateTime).getTime() - new Date(a.appointmentDateTime).getTime())
                        .slice(0, 6)
                );
            })
            .catch(() => {
                if (active) setBookingsError('Failed to load recent bookings.');
            })
            .finally(() => {
                if (active) setLoadingBookings(false);
            });

        return () => {
            active = false;
        };
    }, []);

    const refreshDashboard = () => {
        fetchStats();
        fetchBookings();
    };

    const servicePerformance = useMemo(() => stats?.mostRequestedServices ?? [], [stats?.mostRequestedServices]);
    const topServiceCount = useMemo(
        () => servicePerformance.reduce((max, service) => Math.max(max, service.bookingCount), 0),
        [servicePerformance]
    );

    const statCards = [
        {
            label: "Today's bookings",
            value: stats?.todaysBookings ?? '--',
            icon: <MiniIcon />,
        },
        {
            label: 'Monthly revenue',
            value: stats ? formatCurrency(stats.monthlyRevenue) : '--',
            icon: <MiniIcon />,
        },
        {
            label: 'Active customers',
            value: '--',
            icon: <MiniIcon />,
        },
        {
            label: 'Pending payments',
            value: '--',
            icon: <MiniIcon />,
        },
    ];

    const subtitle = stats
        ? `${stats.todaysBookings} bookings today / ${stats.pendingBookings} pending in queue`
        : 'Track bookings, revenue, services, and daily operations.';

    return (
        <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
            <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">Admin workspace</p>
                    <h1 className="mt-2 text-3xl font-semibold text-gray-950">Business overview</h1>
                    <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={refreshDashboard}
                        disabled={loadingStats || loadingBookings}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-800 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    >
                        <RefreshIcon spinning={loadingStats || loadingBookings} />
                        Refresh
                    </button>
                    <Link
                        to="/admin/services/add"
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-gray-950 px-4 text-sm font-medium text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    >
                        Add service
                        <ArrowIcon />
                    </Link>
                </div>
            </section>

            {statsError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                    {statsError}
                </div>
            )}

            {loadingStats ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="h-24 animate-pulse rounded-lg border border-gray-200 bg-white" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {statCards.map(card => (
                        <StatsCard
                            key={card.label}
                            label={card.label}
                            value={card.value}
                            icon={card.icon}
                            bg="bg-white"
                            iconColor="text-gray-400"
                            valueColor="text-gray-950"
                        />
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_0.6fr]">
                <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                        <div>
                            <h2 className="text-base font-semibold text-gray-950">Recent bookings</h2>
                            <p className="mt-1 text-xs text-gray-500">Latest appointments across the business.</p>
                        </div>
                        <Link to="/admin/bookings" className="text-sm font-medium text-gray-600 hover:text-gray-950">
                            View all
                        </Link>
                    </div>

                    {bookingsError && (
                        <div className="border-b border-red-100 bg-red-50 px-5 py-3 text-sm text-red-700" role="alert">
                            {bookingsError}
                        </div>
                    )}

                    {loadingBookings ? (
                        <div className="space-y-3 p-5">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <div key={index} className="h-14 animate-pulse rounded-lg bg-gray-100" />
                            ))}
                        </div>
                    ) : recentBookings.length === 0 ? (
                        <div className="px-5 py-12 text-center">
                            <p className="text-sm font-medium text-gray-700">No bookings yet.</p>
                            <p className="mt-1 text-sm text-gray-500">New customer appointments will appear here.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[720px] text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase text-gray-500">
                                        <th className="px-5 py-3">Booking</th>
                                        <th className="px-5 py-3">Customer</th>
                                        <th className="px-5 py-3">Service</th>
                                        <th className="px-5 py-3">Time</th>
                                        <th className="px-5 py-3">Total</th>
                                        <th className="px-5 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {recentBookings.map(booking => (
                                        <tr key={booking.id} className="hover:bg-gray-50">
                                            <td className="px-5 py-4 font-mono text-xs text-gray-600">{booking.id.slice(0, 8)}</td>
                                            <td className="px-5 py-4">
                                                <p className="font-medium text-gray-950">{booking.customerEmail}</p>
                                                <p className="mt-1 font-mono text-xs text-gray-500">{booking.vehicleLicensePlate}</p>
                                            </td>
                                            <td className="px-5 py-4 text-gray-700">{booking.washServiceName}</td>
                                            <td className="px-5 py-4 font-mono text-xs text-gray-600">{formatDateTime(booking.appointmentDateTime)}</td>
                                            <td className="px-5 py-4 font-mono font-semibold text-gray-950">{formatCurrency(booking.totalPrice)}</td>
                                            <td className="px-5 py-4"><BookingStatusBadge status={booking.status} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                <div className="space-y-6">
                    <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                        <h2 className="text-base font-semibold text-gray-950">Service performance</h2>
                        {loadingStats ? (
                            <div className="mt-4 space-y-3">
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <div key={index} className="h-12 animate-pulse rounded-lg bg-gray-100" />
                                ))}
                            </div>
                        ) : servicePerformance.length === 0 ? (
                            <div className="mt-6 rounded-lg border border-dashed border-gray-200 px-4 py-8 text-center">
                                <p className="text-sm font-medium text-gray-700">No service data yet.</p>
                                <p className="mt-1 text-sm text-gray-500">Service rankings will appear after bookings are recorded.</p>
                            </div>
                        ) : (
                            <div className="mt-4 space-y-4">
                                {servicePerformance.slice(0, 5).map(service => (
                                    <div key={service.serviceName}>
                                        <div className="mb-2 flex items-center justify-between gap-3">
                                            <p className="truncate text-sm font-medium text-gray-800">{service.serviceName}</p>
                                            <p className="font-mono text-sm font-semibold text-gray-950">{service.bookingCount}</p>
                                        </div>
                                        <div className="h-2 rounded-full bg-gray-100">
                                            <div
                                                className="h-2 rounded-full bg-gray-900"
                                                style={{ width: `${serviceShare(service, topServiceCount)}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                        <h2 className="text-base font-semibold text-gray-950">Quick actions</h2>
                        <div className="mt-4 space-y-3">
                            {[
                                { label: 'Review bookings', to: '/admin/bookings' },
                                { label: 'Manage services', to: '/admin/services' },
                                { label: 'Manage employees', to: '/admin/employees' },
                            ].map(action => (
                                <Link
                                    key={action.to}
                                    to={action.to}
                                    className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-800 transition hover:border-gray-300 hover:bg-gray-50"
                                >
                                    {action.label}
                                    <ArrowIcon />
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

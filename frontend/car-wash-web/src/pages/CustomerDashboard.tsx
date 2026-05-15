import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import dashboardService from '../services/dashboardService';
import bookingService from '../services/bookingService';
import type { CustomerDashboardResponse } from '../types/dashboard';
import type { BookingResponse } from '../types/booking';
import { useAuth } from '../context/AuthContext';
import BookingStatusBadge from '../components/BookingStatusBadge';
import StatsCard from '../components/StatsCard';

const formatDate = (dt: string) =>
    new Date(dt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

const formatTime = (dt: string) =>
    new Date(dt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(Number(amount));

const currentDate = new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
}).format(new Date());

const MiniIcon = () => (
    <span className="block h-2.5 w-2.5 rounded-full bg-current" aria-hidden="true" />
);

const ArrowIcon = () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
);

const CustomerDashboard: React.FC = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState<CustomerDashboardResponse | null>(null);
    const [bookings, setBookings] = useState<BookingResponse[]>([]);
    const [loadingStats, setLoadingStats] = useState(true);
    const [loadingBookings, setLoadingBookings] = useState(true);
    const [statsError, setStatsError] = useState<string | null>(null);
    const [bookingsError, setBookingsError] = useState<string | null>(null);
    const [referenceTime] = useState(() => Date.now());

    useEffect(() => {
        dashboardService.getCustomerDashboard()
            .then(setStats)
            .catch(() => setStatsError('Failed to load dashboard data.'))
            .finally(() => setLoadingStats(false));

        bookingService.getMyBookings()
            .then(setBookings)
            .catch(() => setBookingsError('Failed to load recent bookings.'))
            .finally(() => setLoadingBookings(false));
    }, []);

    const upcomingBookings = useMemo(() => {
        return bookings
            .filter(booking => {
                const appointmentTime = new Date(booking.appointmentDateTime).getTime();
                return appointmentTime >= referenceTime && !['CANCELLED', 'COMPLETED', 'NO_SHOW'].includes(booking.status);
            })
            .sort((a, b) => new Date(a.appointmentDateTime).getTime() - new Date(b.appointmentDateTime).getTime());
    }, [bookings, referenceTime]);

    const recentActivity = useMemo(() => (
        [...bookings]
            .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
            .slice(0, 5)
    ), [bookings]);

    const completedBookings = bookings.filter(booking => booking.status === 'COMPLETED').length;
    const upcomingBooking = upcomingBookings[0];
    const firstName = user?.firstName || 'there';

    const statCards = [
        {
            label: 'Upcoming bookings',
            value: stats?.upcomingBookings ?? upcomingBookings.length,
            icon: <MiniIcon />,
        },
        {
            label: 'Registered vehicles',
            value: stats?.registeredVehicles ?? '--',
            icon: <MiniIcon />,
        },
        {
            label: 'Completed washes',
            value: stats?.previousBookings ?? completedBookings,
            icon: <MiniIcon />,
        },
        {
            label: 'Pending payments',
            value: '--',
            icon: <MiniIcon />,
        },
    ];

    return (
        <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
            <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{currentDate}</p>
                    <h1 className="mt-2 text-3xl font-semibold text-gray-950">Good morning, {firstName}.</h1>
                    <p className="mt-2 text-sm text-gray-600">Manage your vehicles, bookings, and payments.</p>
                </div>
                <Link
                    to="/book-appointment"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-gray-950 px-4 text-sm font-medium text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                    Book a wash
                    <ArrowIcon />
                </Link>
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

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.25fr_0.75fr]">
                <section className="rounded-lg bg-gray-950 p-5 text-white shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-400">Upcoming booking</p>
                            <h2 className="mt-2 text-2xl font-semibold">
                                {upcomingBooking ? upcomingBooking.washServiceName : 'No wash scheduled'}
                            </h2>
                        </div>
                        {upcomingBooking && <BookingStatusBadge status={upcomingBooking.status} />}
                    </div>

                    {loadingBookings ? (
                        <div className="mt-6 h-28 animate-pulse rounded-lg bg-white/10" />
                    ) : upcomingBooking ? (
                        <div className="mt-6 grid gap-4 sm:grid-cols-4">
                            <div>
                                <p className="text-xs font-medium uppercase text-gray-400">Vehicle</p>
                                <p className="mt-1 font-mono text-sm text-white">{upcomingBooking.vehicleLicensePlate}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium uppercase text-gray-400">Date</p>
                                <p className="mt-1 font-mono text-sm text-white">{formatDate(upcomingBooking.appointmentDateTime)}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium uppercase text-gray-400">Time</p>
                                <p className="mt-1 font-mono text-sm text-white">{formatTime(upcomingBooking.appointmentDateTime)}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium uppercase text-gray-400">Total</p>
                                <p className="mt-1 font-mono text-sm text-white">{formatCurrency(upcomingBooking.totalPrice)}</p>
                            </div>
                            <Link
                                to={`/bookings/${upcomingBooking.id}`}
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-medium text-gray-950 transition hover:bg-gray-100 sm:col-span-4 sm:w-fit"
                            >
                                View booking
                                <ArrowIcon />
                            </Link>
                        </div>
                    ) : (
                        <div className="mt-6">
                            <p className="text-sm text-gray-300">Your queue is clear. Schedule your next appointment when your car is ready.</p>
                            <Link
                                to="/book-appointment"
                                className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-medium text-gray-950 transition hover:bg-gray-100"
                            >
                                Book a wash
                                <ArrowIcon />
                            </Link>
                        </div>
                    )}
                </section>

                <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-semibold text-gray-950">Quick actions</h2>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                        {[
                            { label: 'Book a Wash', to: '/book-appointment' },
                            { label: 'My Bookings', to: '/my-bookings' },
                            { label: 'My Vehicles', to: '/my-vehicles' },
                            { label: 'Browse Services', to: '/services' },
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

            <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                    <h2 className="text-base font-semibold text-gray-950">Recent activity</h2>
                    <Link to="/my-bookings" className="text-sm font-medium text-gray-600 hover:text-gray-950">
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
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="h-14 animate-pulse rounded-lg bg-gray-100" />
                        ))}
                    </div>
                ) : recentActivity.length === 0 ? (
                    <div className="px-5 py-10 text-center">
                        <p className="text-sm font-medium text-gray-700">No booking activity yet.</p>
                        <p className="mt-1 text-sm text-gray-500">Your completed and upcoming appointments will appear here.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {recentActivity.map(booking => (
                            <Link
                                key={booking.id}
                                to={`/bookings/${booking.id}`}
                                className="grid gap-3 px-5 py-4 transition hover:bg-gray-50 sm:grid-cols-[1fr_auto]"
                            >
                                <div>
                                    <p className="text-sm font-semibold text-gray-950">{booking.washServiceName}</p>
                                    <p className="mt-1 text-xs text-gray-500">
                                        <span className="font-mono">{booking.vehicleLicensePlate}</span>
                                        {' / '}
                                        <span className="font-mono">{formatDate(booking.appointmentDateTime)} {formatTime(booking.appointmentDateTime)}</span>
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-mono text-sm font-semibold text-gray-800">{formatCurrency(booking.totalPrice)}</span>
                                    <BookingStatusBadge status={booking.status} />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default CustomerDashboard;

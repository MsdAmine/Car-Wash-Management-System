import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import dashboardService from '../services/dashboardService';
import bookingService from '../services/bookingService';
import type { CustomerDashboardResponse } from '../types/dashboard';
import type { BookingResponse } from '../types/booking';
import { useAuth } from '../context/AuthContext';
import BookingStatusBadge from '../components/BookingStatusBadge';
import StatsCard from '../components/StatsCard';

const formatDateTime = (dt: string) =>
    new Date(dt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

const ChevronRight = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
);

const CalendarIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
    </svg>
);

const CarIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
    </svg>
);

const CheckCircleIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

const DollarIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

const suggestedServices = [
    { name: 'Premium Wash', description: 'Full exterior wash with wax' },
    { name: 'Full Detailing', description: 'Interior & exterior deep clean' },
    { name: 'Interior Cleaning', description: 'Complete interior refresh' },
];

const CustomerDashboard: React.FC = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState<CustomerDashboardResponse | null>(null);
    const [recentBookings, setRecentBookings] = useState<BookingResponse[]>([]);
    const [loadingStats, setLoadingStats] = useState(true);
    const [loadingBookings, setLoadingBookings] = useState(true);
    const [statsError, setStatsError] = useState<string | null>(null);

    useEffect(() => {
        dashboardService.getCustomerDashboard()
            .then(setStats)
            .catch(() => setStatsError('Failed to load dashboard data.'))
            .finally(() => setLoadingStats(false));

        bookingService.getMyBookings()
            .then(bookings => setRecentBookings(bookings.slice(0, 5)))
            .catch(() => {/* non-critical */})
            .finally(() => setLoadingBookings(false));
    }, []);

    const statCards = [
        {
            label: 'Upcoming Bookings',
            value: stats?.upcomingBookings ?? 1,
            icon: <CalendarIcon />,
        },
        {
            label: 'Registered Vehicles',
            value: stats?.registeredVehicles ?? 2,
            icon: <CarIcon />,
        },
        {
            label: 'Completed Washes',
            value: stats?.previousBookings ?? 8,
            icon: <CheckCircleIcon />,
        },
        {
            label: 'Pending Payments',
            value: 0,
            icon: <DollarIcon />,
        },
    ];

    return (
        <div className="max-w-5xl mx-auto p-6 sm:p-8 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Welcome back{user?.firstName ? `, ${user.firstName}` : ''}
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage your vehicles, bookings, and payments from one place.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <Link
                            to="/book-appointment"
                            className="bg-gray-900 text-white rounded-2xl px-4 py-2.5 text-sm font-medium hover:bg-gray-800 transition"
                        >
                            Book a Wash
                        </Link>
                        <Link
                            to="/add-vehicle"
                            className="bg-white border border-gray-200 text-gray-900 rounded-2xl px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition"
                        >
                            Add Vehicle
                        </Link>
                    </div>
                </div>
            </div>

            {statsError && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-red-700 text-sm">
                    <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                    {statsError}
                </div>
            )}

            {/* Stats */}
            {loadingStats ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-24 bg-white rounded-2xl border border-gray-200 animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map(card => (
                        <StatsCard
                            key={card.label}
                            label={card.label}
                            value={card.value}
                            icon={card.icon}
                            bg="bg-white"
                            iconColor="text-gray-400"
                            valueColor="text-gray-900"
                        />
                    ))}
                </div>
            )}

            {/* Main content */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Left column */}
                <div className="xl:col-span-2 space-y-6">
                    {/* Upcoming booking */}
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h2 className="text-sm font-semibold text-gray-700">Upcoming Booking</h2>
                        </div>
                        <div className="p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="font-semibold text-gray-900">Premium Wash</p>
                                    <p className="text-sm text-gray-500 mt-1">BMW 3 Series</p>
                                    <p className="text-sm text-gray-500">Tomorrow · 10:30 AM</p>
                                </div>
                                <BookingStatusBadge status="CONFIRMED" />
                            </div>
                            <Link
                                to="/my-bookings"
                                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-gray-900 hover:text-gray-600 transition"
                            >
                                View details <ChevronRight />
                            </Link>
                        </div>
                    </div>

                    {/* Recent activity */}
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                            <h2 className="text-sm font-semibold text-gray-700">Recent Activity</h2>
                            <Link
                                to="/my-bookings"
                                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 font-medium transition"
                            >
                                View all <ChevronRight />
                            </Link>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {loadingBookings ? (
                                <div className="p-6 space-y-3">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
                                    ))}
                                </div>
                            ) : recentBookings.length === 0 ? (
                                <div className="px-6 py-10 text-center text-gray-400 text-sm">
                                    No bookings yet.{' '}
                                    <Link
                                        to="/book-appointment"
                                        className="font-medium text-gray-900 underline underline-offset-4"
                                    >
                                        Book your first wash
                                    </Link>
                                </div>
                            ) : (
                                recentBookings.map(booking => (
                                    <Link
                                        key={booking.id}
                                        to={`/bookings/${booking.id}`}
                                        className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition"
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{booking.washServiceName}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {booking.vehicleLicensePlate} &bull; {formatDateTime(booking.appointmentDateTime)}
                                            </p>
                                        </div>
                                        <BookingStatusBadge status={booking.status} />
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Right column */}
                <div className="space-y-6">
                    {/* Quick actions */}
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h2 className="text-sm font-semibold text-gray-700">Quick Actions</h2>
                        </div>
                        <div className="p-4 space-y-2">
                            <Link
                                to="/book-appointment"
                                className="flex items-center w-full bg-gray-900 text-white rounded-xl px-4 py-3 text-sm font-medium hover:bg-gray-800 transition"
                            >
                                Book a Wash
                            </Link>
                            <Link
                                to="/my-bookings"
                                className="flex items-center w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm font-medium hover:bg-gray-50 transition"
                            >
                                My Bookings
                            </Link>
                            <Link
                                to="/my-vehicles"
                                className="flex items-center w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm font-medium hover:bg-gray-50 transition"
                            >
                                My Vehicles
                            </Link>
                            <Link
                                to="/services"
                                className="flex items-center w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm font-medium hover:bg-gray-50 transition"
                            >
                                Browse Services
                            </Link>
                        </div>
                    </div>

                    {/* Suggested services */}
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h2 className="text-sm font-semibold text-gray-700">Suggested Services</h2>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {suggestedServices.map(service => (
                                <div key={service.name} className="flex items-center justify-between px-6 py-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{service.name}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{service.description}</p>
                                    </div>
                                    <Link
                                        to="/book-appointment"
                                        className="shrink-0 ml-4 text-xs font-medium text-gray-900 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition"
                                    >
                                        Book
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;

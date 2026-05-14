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

    const today = new Date().toLocaleDateString(undefined, {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    const statCards = [
        {
            label: 'Upcoming Bookings',
            value: stats?.upcomingBookings ?? 0,
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
            ),
            bg: 'bg-blue-50',
            iconColor: 'text-blue-600',
            valueColor: 'text-blue-700',
        },
        {
            label: 'Past Bookings',
            value: stats?.previousBookings ?? 0,
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            ),
            bg: 'bg-gray-50',
            iconColor: 'text-gray-500',
            valueColor: 'text-gray-700',
        },
        {
            label: 'Registered Vehicles',
            value: stats?.registeredVehicles ?? 0,
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
            ),
            bg: 'bg-green-50',
            iconColor: 'text-green-600',
            valueColor: 'text-green-700',
        },
    ];

    const quickLinks = [
        {
            to: '/book-appointment',
            label: 'Book Appointment',
            description: 'Schedule a new car wash',
            icon: (
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            ),
            primary: true,
        },
        {
            to: '/my-bookings',
            label: 'My Bookings',
            description: 'View all your appointments',
            icon: (
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
            ),
            primary: false,
        },
        {
            to: '/my-vehicles',
            label: 'My Vehicles',
            description: 'Manage your registered cars',
            icon: (
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
            ),
            primary: false,
        },
        {
            to: '/services',
            label: 'Browse Services',
            description: 'Explore our wash packages',
            icon: (
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                </svg>
            ),
            primary: false,
        },
    ];

    return (
        <div className="max-w-4xl mx-auto p-6 sm:p-8 space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
                <p className="text-blue-100 text-sm">{today}</p>
                <h1 className="text-2xl font-bold mt-1">
                    Welcome back{user?.firstName ? `, ${user.firstName}` : ''}!
                </h1>
                <p className="text-blue-100 text-sm mt-1">Here's an overview of your account.</p>
            </div>

            {statsError && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-sm">
                    <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg>
                    {statsError}
                </div>
            )}

            {/* Stats */}
            <section>
                <h2 className="text-base font-semibold text-gray-700 mb-3">Overview</h2>
                {loadingStats ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : stats ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {statCards.map(card => (
                            <StatsCard
                                key={card.label}
                                label={card.label}
                                value={card.value}
                                icon={card.icon}
                                bg={card.bg}
                                iconColor={card.iconColor}
                                valueColor={card.valueColor}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm italic">No dashboard data available.</p>
                )}
            </section>

            {/* Recent bookings */}
            <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-800">Recent Bookings</h2>
                    <Link to="/my-bookings" className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
                        View all <ChevronRight />
                    </Link>
                </div>
                <div className="divide-y divide-gray-50">
                    {loadingBookings ? (
                        <div className="p-6 space-y-3">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
                            ))}
                        </div>
                    ) : recentBookings.length === 0 ? (
                        <div className="px-6 py-10 text-center text-gray-500">
                            <svg className="w-10 h-10 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                            </svg>
                            <p className="text-sm">No bookings yet.</p>
                            <Link to="/book-appointment" className="mt-2 inline-flex items-center gap-1 text-sm text-blue-600 hover:underline font-medium">
                                Book your first appointment <ChevronRight />
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
                                    <p className="text-sm font-medium text-gray-800">{booking.washServiceName}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {booking.vehicleLicensePlate} &bull; {formatDateTime(booking.appointmentDateTime)}
                                    </p>
                                </div>
                                <BookingStatusBadge status={booking.status} />
                            </Link>
                        ))
                    )}
                </div>
            </section>

            {/* Quick links */}
            <section>
                <h2 className="text-base font-semibold text-gray-700 mb-3">Quick Actions</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {quickLinks.map(link => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`flex items-center text-left gap-3 p-4 rounded-xl border transition ${
                                link.primary
                                    ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 shadow-sm'
                                    : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-gray-50 text-gray-700'
                            }`}
                        >
                            <div className={link.primary ? 'text-white' : 'text-gray-500'}>
                                {link.icon}
                            </div>
                            <div>
                                <p className="text-xs font-semibold">{link.label}</p>
                                <p className={`text-xs mt-0.5 leading-tight ${link.primary ? 'text-blue-100' : 'text-gray-600'}`}>
                                    {link.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default CustomerDashboard;

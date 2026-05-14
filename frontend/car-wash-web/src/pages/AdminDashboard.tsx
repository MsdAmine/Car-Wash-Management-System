import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import dashboardService from '../services/dashboardService';
import bookingService from '../services/bookingService';
import type { AdminDashboardResponse } from '../types/dashboard';
import type { BookingResponse } from '../types/booking';
import { useAuth } from '../context/AuthContext';
import BookingStatusBadge from '../components/BookingStatusBadge';
import ServicePopularity from '../components/ServicePopularity';

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(amount);

const formatDateTime = (dt: string) =>
    new Date(dt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

const AdminDashboard: React.FC = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState<AdminDashboardResponse | null>(null);
    const [recentBookings, setRecentBookings] = useState<BookingResponse[]>([]);
    const [loadingStats, setLoadingStats] = useState(true);
    const [loadingBookings, setLoadingBookings] = useState(true);
    const [statsError, setStatsError] = useState<string | null>(null);

    useEffect(() => {
        dashboardService.getAdminDashboard()
            .then(setStats)
            .catch(() => setStatsError('Failed to load dashboard data.'))
            .finally(() => setLoadingStats(false));

        bookingService.getAll()
            .then(bookings => setRecentBookings(bookings.slice(0, 5)))
            .catch(() => {/* non-critical */})
            .finally(() => setLoadingBookings(false));
    }, []);

    const today = new Date().toLocaleDateString(undefined, {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    const bookingStatCards = [
        {
            label: 'Total Bookings',
            value: stats?.totalBookings ?? 0,
            bg: 'bg-gray-50',
            iconColor: 'text-gray-500',
            valueColor: 'text-gray-800',
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
                </svg>
            ),
        },
        {
            label: "Today's Bookings",
            value: stats?.todaysBookings ?? 0,
            bg: 'bg-blue-50',
            iconColor: 'text-blue-600',
            valueColor: 'text-blue-700',
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                </svg>
            ),
        },
        {
            label: 'Pending',
            value: stats?.pendingBookings ?? 0,
            bg: 'bg-yellow-50',
            iconColor: 'text-yellow-600',
            valueColor: 'text-yellow-700',
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            ),
        },
        {
            label: 'Completed',
            value: stats?.completedBookings ?? 0,
            bg: 'bg-green-50',
            iconColor: 'text-green-600',
            valueColor: 'text-green-700',
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            ),
        },
    ];

    const quickActions = [
        {
            to: '/admin/bookings',
            label: 'Manage Bookings',
            description: 'View and update appointment statuses',
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
            ),
        },
        {
            to: '/admin/employees',
            label: 'Manage Employees',
            description: 'Assign staff and manage profiles',
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                </svg>
            ),
        },
        {
            to: '/admin/services',
            label: 'Manage Services',
            description: 'Create and update wash packages',
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                </svg>
            ),
        },
    ];

    return (
        <div className="max-w-5xl mx-auto p-6 sm:p-8 space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-xl p-6 text-white">
                <p className="text-green-100 text-sm">{today}</p>
                <h1 className="text-2xl font-bold mt-1">
                    Admin Dashboard{user?.firstName ? ` — ${user.firstName}` : ''}
                </h1>
                <p className="text-green-100 text-sm mt-1">Here's your operational overview.</p>
            </div>

            {statsError && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-sm">
                    <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg>
                    {statsError}
                </div>
            )}

            {/* Booking stats */}
            <section>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Booking Overview</h2>
                {loadingStats ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : stats ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {bookingStatCards.map(card => (
                            <div key={card.label} className={`${card.bg} rounded-xl p-4 flex flex-col gap-2`}>
                                <div className={card.iconColor}>{card.icon}</div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">{card.label}</p>
                                    <p className={`text-2xl font-bold ${card.valueColor}`}>{card.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm italic">No booking data available.</p>
                )}
            </section>

            {/* Revenue */}
            <section>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Revenue</h2>
                {loadingStats ? (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-20 bg-gray-100 rounded-xl animate-pulse" />
                        <div className="h-20 bg-gray-100 rounded-xl animate-pulse" />
                    </div>
                ) : stats ? (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                            <div className="flex items-center gap-2 mb-1">
                                <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Today's Revenue</p>
                            </div>
                            <p className="text-2xl font-bold text-emerald-800">{formatCurrency(stats.dailyRevenue)}</p>
                        </div>
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                            <div className="flex items-center gap-2 mb-1">
                                <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                                </svg>
                                <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Monthly Revenue</p>
                            </div>
                            <p className="text-2xl font-bold text-emerald-800">{formatCurrency(stats.monthlyRevenue)}</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm italic">No revenue data available.</p>
                )}
            </section>

            {/* Two-column: service popularity + recent bookings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Service popularity */}
                <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="font-semibold text-gray-800">Most Requested Services</h2>
                    </div>
                    <div className="p-6">
                        {loadingStats ? (
                            <div className="space-y-3">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />
                                ))}
                            </div>
                        ) : stats ? (
                            <ServicePopularity services={stats.mostRequestedServices} />
                        ) : (
                            <p className="text-gray-500 text-sm italic">No service data available.</p>
                        )}
                    </div>
                </section>

                {/* Recent bookings */}
                <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                        <h2 className="font-semibold text-gray-800">Recent Bookings</h2>
                        <Link to="/admin/bookings" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                            View all →
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
                            <div className="px-6 py-8 text-center text-gray-500 text-sm">No bookings yet.</div>
                        ) : (
                            recentBookings.map(booking => (
                                <div key={booking.id} className="flex items-center justify-between px-6 py-3">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{booking.washServiceName}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {booking.customerEmail} &bull; {formatDateTime(booking.appointmentDateTime)}
                                        </p>
                                    </div>
                                    <BookingStatusBadge status={booking.status} />
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>

            {/* Quick actions */}
            <section>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {quickActions.map(action => (
                        <Link
                            key={action.to}
                            to={action.to}
                            className="flex items-start gap-4 p-5 bg-white border border-gray-200 rounded-xl hover:border-green-300 hover:shadow-md transition group"
                        >
                            <div className="text-green-600 group-hover:text-green-700 transition shrink-0 mt-0.5">
                                {action.icon}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800 text-sm">{action.label}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{action.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default AdminDashboard;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import dashboardService from '../services/dashboardService';
import bookingService from '../services/bookingService';
import type { AdminDashboardResponse } from '../types/dashboard';
import type { BookingResponse } from '../types/booking';
import { useAuth } from '../context/AuthContext';
import BookingStatusBadge from '../components/BookingStatusBadge';
import StatsCard from '../components/StatsCard';

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(amount);

const formatTime = (dt: string) =>
    new Date(dt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

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

const RevenueIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

const UsersIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
    </svg>
);

const ClockIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

const staticServicePerformance = [
    { name: 'Basic Wash',        bookings: 0, revenue: '$0' },
    { name: 'Premium Wash',      bookings: 0, revenue: '$0' },
    { name: 'Interior Cleaning', bookings: 0, revenue: '$0' },
    { name: 'Full Detailing',    bookings: 0, revenue: '$0' },
];

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

    const statCards = [
        {
            label: "Today's Bookings",
            value: stats?.todaysBookings ?? '—',
            icon: <CalendarIcon />,
        },
        {
            label: 'Monthly Revenue',
            value: stats ? formatCurrency(stats.monthlyRevenue) : '—',
            icon: <RevenueIcon />,
        },
        {
            label: 'Active Customers',
            value: '—',
            icon: <UsersIcon />,
        },
        {
            label: 'Pending Payments',
            value: stats?.pendingBookings ?? '—',
            icon: <ClockIcon />,
        },
    ];

    const bookingOverview = [
        { label: 'Pending',     value: stats?.pendingBookings ?? '—',  className: 'bg-gray-100 text-gray-700' },
        { label: 'Confirmed',   value: '—',                            className: 'bg-blue-600 text-white' },
        { label: 'In Progress', value: '—',                            className: 'bg-slate-100 text-slate-700' },
        { label: 'Completed',   value: stats?.completedBookings ?? '—', className: 'bg-green-100 text-green-800' },
    ];

    const servicePerformance = stats?.mostRequestedServices?.length
        ? stats.mostRequestedServices.slice(0, 4).map(s => ({
              name: s.serviceName,
              bookings: s.bookingCount,
              revenue: '—',
          }))
        : staticServicePerformance;

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-8">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 sm:px-8 py-6 sm:py-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Business overview{user?.firstName ? ` — ${user.firstName}` : ''}
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Track bookings, revenue, services, and daily operations.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <Link
                            to="/admin/bookings"
                            className="bg-gray-900 text-white rounded-md px-4 py-2.5 text-sm font-medium hover:bg-gray-800 transition"
                        >
                            Manage Bookings
                        </Link>
                        <Link
                            to="/admin/services/add"
                            className="bg-white border border-gray-200 text-gray-900 rounded-md px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition"
                        >
                            Add Service
                        </Link>
                    </div>
                </div>
            </div>

            {statsError && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-md px-4 py-3 text-red-700 text-sm mx-6 sm:mx-8">
                    <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                    {statsError}
                </div>
            )}

            {/* Stats */}
            {loadingStats ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-6 sm:px-8">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-24 bg-white rounded-lg border border-gray-100 animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-6 sm:px-8">
                    {statCards.map(card => (
                        <StatsCard
                            key={card.label}
                            label={card.label}
                            value={card.value}
                            icon={card.icon}
                            bg="bg-white"
                            iconColor="text-gray-500"
                            valueColor="text-gray-900"
                        />
                    ))}
                </div>
            )}

            {/* Booking overview */}
            <div className="bg-white border-t border-b border-gray-200 overflow-hidden">
                <div className="px-6 sm:px-8 py-4 border-b border-gray-100">
                    <h2 className="text-base font-semibold text-gray-800">Booking Overview</h2>
                </div>
                <div className="px-6 sm:px-8 py-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {bookingOverview.map(item => (
                        <div key={item.label} className="text-center">
                            <p className="text-3xl font-bold text-gray-900">{item.value}</p>
                            <span className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold ${item.className}`}>
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-6 px-6 sm:px-8">
                {/* Recent bookings */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                        <h2 className="text-base font-semibold text-gray-800">Recent Bookings</h2>
                        <Link
                            to="/admin/bookings"
                            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 font-medium transition"
                        >
                            View all <ChevronRight />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        {loadingBookings ? (
                            <div className="p-6 space-y-3">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
                                ))}
                            </div>
                        ) : recentBookings.length === 0 ? (
                            <div className="px-6 py-8 text-center text-gray-400 text-sm">No bookings yet.</div>
                        ) : (
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Customer</th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Service</th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Time</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {recentBookings.map(booking => (
                                        <tr key={booking.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-gray-900 text-sm">{booking.customerEmail}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">{booking.vehicleLicensePlate}</p>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 hidden sm:table-cell">{booking.washServiceName}</td>
                                            <td className="px-6 py-4">
                                                <BookingStatusBadge status={booking.status} />
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 hidden md:table-cell">
                                                {formatTime(booking.appointmentDateTime)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Service performance */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mt-6 lg:mt-0">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="text-base font-semibold text-gray-800">Service Performance</h2>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {servicePerformance.map(service => (
                            <div key={service.name} className="flex items-center justify-between px-6 py-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{service.name}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{service.bookings} bookings</p>
                                </div>
                                <span className="text-sm font-semibold text-gray-900">{service.revenue}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick actions */}
            <div className="bg-white border-t border-b border-gray-200 overflow-hidden">
                <div className="px-6 sm:px-8 py-4 border-b border-gray-100">
                    <h2 className="text-base font-semibold text-gray-800">Quick Actions</h2>
                </div>
                <div className="divide-y divide-gray-100">
                    <Link
                        to="/admin/bookings"
                        className="flex items-center gap-4 px-6 sm:px-8 py-4 hover:bg-gray-50 transition"
                    >
                        <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                        </svg>
                        <div>
                            <p className="text-sm font-semibold text-gray-900">Manage Bookings</p>
                            <p className="text-xs text-gray-500 mt-0.5">View and update statuses</p>
                        </div>
                    </Link>
                    <Link
                        to="/admin/employees"
                        className="flex items-center gap-4 px-6 sm:px-8 py-4 hover:bg-gray-50 transition"
                    >
                        <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                        </svg>
                        <div>
                            <p className="text-sm font-semibold text-gray-900">Manage Employees</p>
                            <p className="text-xs text-gray-500 mt-0.5">Assign staff and profiles</p>
                        </div>
                    </Link>
                    <Link
                        to="/admin/services"
                        className="flex items-center gap-4 px-6 sm:px-8 py-4 hover:bg-gray-50 transition"
                    >
                        <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                        <div>
                            <p className="text-sm font-semibold text-gray-900">Manage Services</p>
                            <p className="text-xs text-gray-500 mt-0.5">Create and update packages</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

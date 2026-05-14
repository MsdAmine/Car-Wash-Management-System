import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import dashboardService from '../services/dashboardService';
import bookingService from '../services/bookingService';
import type { AdminDashboardResponse } from '../types/dashboard';
import type { BookingResponse } from '../types/booking';
import StatsCard from '../components/StatsCard';
import RevenueSummary from '../components/RevenueSummary';
import ServicePopularity from '../components/ServicePopularity';
import RecentBookings from '../components/RecentBookings';

const AdminDashboard: React.FC = () => {
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

    return (
        <div className="max-w-5xl mx-auto p-8 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">{today}</p>
            </div>

            {statsError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-sm">
                    {statsError}
                </div>
            )}

            {/* Booking stats */}
            <section>
                <h2 className="text-base font-semibold text-gray-700 mb-3">Booking Overview</h2>
                {loadingStats ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
                        ))}
                    </div>
                ) : stats ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <StatsCard label="Total Bookings" value={stats.totalBookings} />
                        <StatsCard label="Today's Bookings" value={stats.todaysBookings} colorClass="text-blue-600" />
                        <StatsCard label="Pending" value={stats.pendingBookings} colorClass="text-yellow-600" />
                        <StatsCard label="Completed" value={stats.completedBookings} colorClass="text-green-600" />
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm italic">No booking data available.</p>
                )}
            </section>

            {/* Revenue */}
            <section>
                <h2 className="text-base font-semibold text-gray-700 mb-3">Revenue</h2>
                {loadingStats ? (
                    <div className="h-20 bg-gray-100 rounded-lg animate-pulse" />
                ) : stats ? (
                    <RevenueSummary dailyRevenue={stats.dailyRevenue} monthlyRevenue={stats.monthlyRevenue} />
                ) : (
                    <p className="text-gray-500 text-sm italic">No revenue data available.</p>
                )}
            </section>

            {/* Service popularity */}
            <section className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <h2 className="text-base font-semibold text-gray-700 mb-4">Most Requested Services</h2>
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
            </section>

            {/* Recent bookings */}
            <section className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-base font-semibold text-gray-700">Recent Bookings</h2>
                    <Link to="/admin/bookings" className="text-sm text-blue-600 hover:underline">
                        View all →
                    </Link>
                </div>
                {loadingBookings ? (
                    <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <RecentBookings bookings={recentBookings} linkPrefix="/admin/bookings" />
                )}
            </section>

            {/* Quick links */}
            <section className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <h2 className="text-base font-semibold text-gray-700 mb-4">Quick Links</h2>
                <div className="flex flex-wrap gap-3">
                    <Link to="/admin/bookings" className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition">
                        Manage Bookings
                    </Link>
                    <Link to="/admin/employees" className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition">
                        Manage Employees
                    </Link>
                    <Link to="/admin/services" className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition">
                        Manage Services
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default AdminDashboard;

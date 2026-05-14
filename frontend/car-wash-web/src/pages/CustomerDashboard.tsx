import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import dashboardService from '../services/dashboardService';
import bookingService from '../services/bookingService';
import type { CustomerDashboardResponse } from '../types/dashboard';
import type { BookingResponse } from '../types/booking';
import StatsCard from '../components/StatsCard';
import RecentBookings from '../components/RecentBookings';

const CustomerDashboard: React.FC = () => {
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

    return (
        <div className="max-w-4xl mx-auto p-8 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">My Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">{today}</p>
            </div>

            {statsError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-sm">
                    {statsError}
                </div>
            )}

            {/* Stats */}
            <section>
                <h2 className="text-base font-semibold text-gray-700 mb-3">Overview</h2>
                {loadingStats ? (
                    <div className="grid grid-cols-3 gap-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
                        ))}
                    </div>
                ) : stats ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <StatsCard label="Upcoming Bookings" value={stats.upcomingBookings} colorClass="text-blue-600" />
                        <StatsCard label="Past Bookings" value={stats.previousBookings} colorClass="text-gray-600" />
                        <StatsCard label="Registered Vehicles" value={stats.registeredVehicles} colorClass="text-green-600" />
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm italic">No dashboard data available.</p>
                )}
            </section>

            {/* Recent bookings */}
            <section className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-base font-semibold text-gray-700">Recent Bookings</h2>
                    <Link to="/my-bookings" className="text-sm text-blue-600 hover:underline">
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
                    <RecentBookings bookings={recentBookings} linkPrefix="/bookings" />
                )}
            </section>

            {/* Quick links */}
            <section className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <h2 className="text-base font-semibold text-gray-700 mb-4">Quick Links</h2>
                <div className="flex flex-wrap gap-3">
                    <Link to="/book-appointment" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition">
                        Book Appointment
                    </Link>
                    <Link to="/my-bookings" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition">
                        My Bookings
                    </Link>
                    <Link to="/my-vehicles" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition">
                        My Vehicles
                    </Link>
                    <Link to="/services" className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition">
                        Browse Services
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default CustomerDashboard;

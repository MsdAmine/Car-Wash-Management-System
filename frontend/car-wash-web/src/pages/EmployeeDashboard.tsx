import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import employeeService from '../services/employeeService';
import dashboardService from '../services/dashboardService';
import type { BookingAssignmentResponse, EmployeeResponse } from '../types/employee';
import type { EmployeeDashboardResponse } from '../types/dashboard';
import StatsCard from '../components/StatsCard';

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

const SpinnerIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
);

const CheckCircleIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

const ClockIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

const statusWorkflow = [
    { label: 'Confirmed',   className: 'bg-gray-900 text-white' },
    { label: 'In Progress', className: 'bg-slate-100 text-slate-700' },
    { label: 'Completed',   className: 'bg-green-100 text-green-800' },
    { label: 'No Show',     className: 'bg-amber-100 text-amber-800' },
];

const EmployeeDashboard: React.FC = () => {
    const [profile, setProfile] = useState<EmployeeResponse | null>(null);
    const [todayAssignments, setTodayAssignments] = useState<BookingAssignmentResponse[]>([]);
    const [workload, setWorkload] = useState<EmployeeDashboardResponse | null>(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [loadingAssignments, setLoadingAssignments] = useState(true);
    const [loadingWorkload, setLoadingWorkload] = useState(true);
    const [profileError, setProfileError] = useState<string | null>(null);
    const [assignmentsError, setAssignmentsError] = useState<string | null>(null);

    useEffect(() => {
        employeeService.getMe()
            .then(data => setProfile(data))
            .catch(err => {
                const status = err.response?.status;
                if (status === 404) setProfileError('No employee profile linked to your account.');
                else setProfileError('Failed to load profile.');
            })
            .finally(() => setLoadingProfile(false));

        employeeService.getMyTodayAssignments()
            .then(data => setTodayAssignments(data))
            .catch(() => setAssignmentsError("Failed to load today's assignments."))
            .finally(() => setLoadingAssignments(false));

        dashboardService.getEmployeeDashboard()
            .then(setWorkload)
            .catch(() => {/* non-critical */})
            .finally(() => setLoadingWorkload(false));
    }, []);

    const initials = profile
        ? `${profile.firstName[0] ?? ''}${profile.lastName[0] ?? ''}`.toUpperCase()
        : '?';

    const statCards = [
        {
            label: 'Assigned Today',
            value: workload?.assignedBookings ?? 6,
            icon: <CalendarIcon />,
        },
        {
            label: 'In Progress',
            value: workload?.bookingsInProgress ?? 2,
            icon: <SpinnerIcon />,
        },
        {
            label: 'Completed Today',
            value: 4,
            icon: <CheckCircleIcon />,
        },
        {
            label: 'Waiting Customers',
            value: 1,
            icon: <ClockIcon />,
        },
    ];

    return (
        <div className="max-w-5xl mx-auto p-6 sm:p-8 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Today's work</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            View assigned bookings and update car wash progress.
                        </p>
                    </div>
                    <Link
                        to="/employee/assigned-bookings"
                        className="shrink-0 bg-gray-900 text-white rounded-2xl px-4 py-2.5 text-sm font-medium hover:bg-gray-800 transition"
                    >
                        View Assigned Work
                    </Link>
                </div>
            </div>

            {/* Stats */}
            {loadingWorkload ? (
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

            {/* Work queue */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                    <h2 className="text-sm font-semibold text-gray-700">Today's Schedule</h2>
                    <Link
                        to="/employee/daily-bookings"
                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 font-medium transition"
                    >
                        View all <ChevronRight />
                    </Link>
                </div>

                {loadingAssignments ? (
                    <div className="p-6 space-y-3">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : assignmentsError ? (
                    <p className="px-6 py-4 text-red-600 text-sm">{assignmentsError}</p>
                ) : todayAssignments.length === 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Time</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Customer</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Vehicle</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Service</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Status</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-gray-500 italic">
                                {[
                                    { time: '09:30', customer: 'Sarah Lee', vehicle: 'Audi A3', service: 'Basic Wash', status: 'Confirmed' },
                                    { time: '10:30', customer: 'Mark Chen', vehicle: 'BMW 3 Series', service: 'Premium Wash', status: 'In Progress' },
                                    { time: '11:15', customer: 'Lina Torres', vehicle: 'Toyota Corolla', service: 'Interior Cleaning', status: 'Pending' },
                                ].map((row, i) => (
                                    <tr key={i} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-medium text-gray-700 not-italic">{row.time}</td>
                                        <td className="px-6 py-4 not-italic text-gray-600">{row.customer}</td>
                                        <td className="px-6 py-4 not-italic text-gray-600 hidden sm:table-cell">{row.vehicle}</td>
                                        <td className="px-6 py-4 not-italic text-gray-600">{row.service}</td>
                                        <td className="px-6 py-4 not-italic hidden md:table-cell">
                                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 not-italic text-gray-400 text-xs">No bookings yet</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p className="text-center text-xs text-gray-400 py-3 border-t border-gray-50">
                            No bookings assigned for today — sample data shown above
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Time</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Service</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {todayAssignments.map(a => (
                                    <tr key={a.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-medium text-gray-700">
                                            {a.appointmentDateTime
                                                ? new Date(a.appointmentDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                : '—'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{a.washServiceName ?? 'Service'}</td>
                                        <td className="px-6 py-4">
                                            <Link
                                                to={`/employee/bookings/${a.bookingId}/work`}
                                                className="text-sm font-medium text-gray-900 hover:text-gray-600 transition flex items-center gap-1"
                                            >
                                                Work on this <ChevronRight />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Bottom grid: status workflow + profile */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Status workflow */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="text-sm font-semibold text-gray-700">Booking Status Flow</h2>
                    </div>
                    <div className="p-6 flex flex-wrap gap-3">
                        {statusWorkflow.map(s => (
                            <span
                                key={s.label}
                                className={`px-3 py-1.5 rounded-full text-xs font-semibold ${s.className}`}
                            >
                                {s.label}
                            </span>
                        ))}
                        <p className="w-full text-xs text-gray-400 mt-2">
                            Update booking status as work progresses through each stage.
                        </p>
                    </div>
                </div>

                {/* Profile card */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="text-sm font-semibold text-gray-700">My Profile</h2>
                    </div>
                    <div className="p-6">
                        {loadingProfile ? (
                            <div className="space-y-3">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="h-5 bg-gray-100 rounded animate-pulse w-3/4" />
                                ))}
                            </div>
                        ) : profileError ? (
                            <p className="text-red-600 text-sm">{profileError}</p>
                        ) : profile ? (
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center text-base font-bold shrink-0">
                                    {initials}
                                </div>
                                <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm flex-1">
                                    <div>
                                        <dt className="text-xs text-gray-500 font-medium uppercase tracking-wide">Name</dt>
                                        <dd className="font-semibold text-gray-900 mt-0.5">{profile.firstName} {profile.lastName}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs text-gray-500 font-medium uppercase tracking-wide">Position</dt>
                                        <dd className="font-semibold text-gray-900 mt-0.5">{profile.position}</dd>
                                    </div>
                                    <div className="col-span-2">
                                        <dt className="text-xs text-gray-500 font-medium uppercase tracking-wide">Status</dt>
                                        <dd className="mt-0.5">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                                profile.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${profile.active ? 'bg-green-500' : 'bg-gray-400'}`} />
                                                {profile.active ? 'Active' : 'Inactive'}
                                            </span>
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;

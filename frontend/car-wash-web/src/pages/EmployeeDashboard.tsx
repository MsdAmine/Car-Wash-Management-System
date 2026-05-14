import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import employeeService from '../services/employeeService';
import dashboardService from '../services/dashboardService';
import type { BookingAssignmentResponse, EmployeeResponse } from '../types/employee';
import type { EmployeeDashboardResponse } from '../types/dashboard';

const EmployeeDashboard: React.FC = () => {
    const [profile, setProfile] = useState<EmployeeResponse | null>(null);
    const [todayAssignments, setTodayAssignments] = useState<BookingAssignmentResponse[]>([]);
    const [workload, setWorkload] = useState<EmployeeDashboardResponse | null>(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [loadingAssignments, setLoadingAssignments] = useState(true);
    const [loadingWorkload, setLoadingWorkload] = useState(true);
    const [profileError, setProfileError] = useState<string | null>(null);
    const [assignmentsError, setAssignmentsError] = useState<string | null>(null);
    const [workloadError, setWorkloadError] = useState<string | null>(null);

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
            .catch(() => setWorkloadError('Failed to load workload data.'))
            .finally(() => setLoadingWorkload(false));
    }, []);

    const today = new Date().toLocaleDateString(undefined, {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    const initials = profile
        ? `${profile.firstName[0] ?? ''}${profile.lastName[0] ?? ''}`.toUpperCase()
        : '?';

    return (
        <div className="max-w-4xl mx-auto p-6 sm:p-8 space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white">
                <p className="text-purple-100 text-sm">{today}</p>
                <h1 className="text-2xl font-bold mt-1">
                    {profile ? `Welcome, ${profile.firstName}!` : 'Employee Dashboard'}
                </h1>
                <p className="text-purple-100 text-sm mt-1">Here's your schedule for today.</p>
            </div>

            {/* Workload summary */}
            <section>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">My Workload</h2>
                {loadingWorkload ? (
                    <div className="grid grid-cols-2 gap-4">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : workloadError ? (
                    <p className="text-red-600 text-sm">{workloadError}</p>
                ) : workload ? (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-purple-50 rounded-xl p-5 flex items-center gap-4">
                            <svg className="w-7 h-7 text-purple-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                            </svg>
                            <div>
                                <p className="text-xs text-purple-600 font-medium">Assigned Bookings</p>
                                <p className="text-2xl font-bold text-purple-800">{workload.assignedBookings}</p>
                            </div>
                        </div>
                        <div className="bg-blue-50 rounded-xl p-5 flex items-center gap-4">
                            <svg className="w-7 h-7 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                            <div>
                                <p className="text-xs text-blue-600 font-medium">In Progress</p>
                                <p className="text-2xl font-bold text-blue-800">{workload.bookingsInProgress}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm italic">No workload data available.</p>
                )}
            </section>

            {/* Profile card */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-800">My Profile</h2>
                </div>
                <div className="p-6">
                    {loadingProfile ? (
                        <div className="space-y-3">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-5 bg-gray-100 rounded animate-pulse w-3/4" />
                            ))}
                        </div>
                    ) : profileError ? (
                        <p className="text-red-600 text-sm">{profileError}</p>
                    ) : profile ? (
                        <div className="flex items-start gap-5">
                            <div className="w-14 h-14 rounded-full bg-purple-600 text-white flex items-center justify-center text-xl font-bold shrink-0">
                                {initials}
                            </div>
                            <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm flex-1">
                                <div>
                                    <dt className="text-xs text-gray-500 font-medium uppercase tracking-wide">Name</dt>
                                    <dd className="font-semibold text-gray-800 mt-0.5">{profile.firstName} {profile.lastName}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs text-gray-500 font-medium uppercase tracking-wide">Email</dt>
                                    <dd className="font-semibold text-gray-800 mt-0.5 truncate">{profile.email}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs text-gray-500 font-medium uppercase tracking-wide">Position</dt>
                                    <dd className="font-semibold text-gray-800 mt-0.5">{profile.position}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs text-gray-500 font-medium uppercase tracking-wide">Hire Date</dt>
                                    <dd className="font-semibold text-gray-800 mt-0.5">
                                        {new Date(profile.hireDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-xs text-gray-500 font-medium uppercase tracking-wide">Status</dt>
                                    <dd className="mt-0.5">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                            profile.active
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-600'
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

            {/* Today's assignments */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-800">Today's Schedule</h2>
                    <Link
                        to="/employee/assigned-bookings"
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                        View all →
                    </Link>
                </div>
                <div>
                    {loadingAssignments ? (
                        <div className="p-6 space-y-2">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
                            ))}
                        </div>
                    ) : assignmentsError ? (
                        <p className="px-6 py-4 text-red-600 text-sm">{assignmentsError}</p>
                    ) : todayAssignments.length === 0 ? (
                        <div className="px-6 py-10 text-center text-gray-500">
                            <svg className="w-10 h-10 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                            </svg>
                            <p className="text-sm">No bookings assigned for today.</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-50">
                            {todayAssignments.map(a => (
                                <li key={a.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                                        <span className="text-sm font-medium text-gray-700">
                                            Booking <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">{a.bookingId.slice(0, 8)}</span>
                                        </span>
                                    </div>
                                    <Link
                                        to={`/employee/bookings/${a.bookingId}/work`}
                                        className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                                    >
                                        Work on this →
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Quick links */}
            <section>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-4">
                    <Link
                        to="/employee/daily-bookings"
                        className="flex items-center gap-3 p-4 bg-purple-50 border border-purple-200 rounded-xl hover:border-purple-400 hover:shadow-md transition"
                    >
                        <svg className="w-5 h-5 text-purple-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                        </svg>
                        <div>
                            <p className="text-sm font-semibold text-purple-800">Daily Schedule</p>
                            <p className="text-xs text-purple-600">View today's bookings</p>
                        </div>
                    </Link>
                    <Link
                        to="/employee/assigned-bookings"
                        className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl hover:border-blue-400 hover:shadow-md transition"
                    >
                        <svg className="w-5 h-5 text-blue-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                        </svg>
                        <div>
                            <p className="text-sm font-semibold text-blue-800">My Assignments</p>
                            <p className="text-xs text-blue-600">All assigned bookings</p>
                        </div>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default EmployeeDashboard;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import employeeService from '../services/employeeService';
import dashboardService from '../services/dashboardService';
import type { BookingAssignmentResponse, EmployeeResponse } from '../types/employee';
import type { EmployeeDashboardResponse } from '../types/dashboard';
import EmployeeWorkloadSummary from '../components/EmployeeWorkloadSummary';

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

    return (
        <div className="max-w-4xl mx-auto p-8 space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Employee Dashboard</h1>
            <p className="text-sm text-gray-500 -mt-4">{today}</p>

            {/* Workload summary */}
            <section>
                <h2 className="text-base font-semibold text-gray-700 mb-3">My Workload</h2>
                {loadingWorkload ? (
                    <div className="grid grid-cols-2 gap-4">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
                        ))}
                    </div>
                ) : workloadError ? (
                    <p className="text-red-600 text-sm">{workloadError}</p>
                ) : workload ? (
                    <EmployeeWorkloadSummary
                        assignedBookings={workload.assignedBookings}
                        bookingsInProgress={workload.bookingsInProgress}
                    />
                ) : (
                    <p className="text-gray-500 text-sm italic">No workload data available.</p>
                )}
            </section>

            {/* Profile card */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">My Profile</h2>
                {loadingProfile ? (
                    <div className="space-y-2">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-5 bg-gray-100 rounded animate-pulse w-3/4" />
                        ))}
                    </div>
                ) : profileError ? (
                    <p className="text-red-600 text-sm">{profileError}</p>
                ) : profile ? (
                    <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                        <div>
                            <dt className="text-gray-500">Name</dt>
                            <dd className="font-medium text-gray-800">{profile.firstName} {profile.lastName}</dd>
                        </div>
                        <div>
                            <dt className="text-gray-500">Email</dt>
                            <dd className="font-medium text-gray-800">{profile.email}</dd>
                        </div>
                        <div>
                            <dt className="text-gray-500">Position</dt>
                            <dd className="font-medium text-gray-800">{profile.position}</dd>
                        </div>
                        <div>
                            <dt className="text-gray-500">Hire Date</dt>
                            <dd className="font-medium text-gray-800">
                                {new Date(profile.hireDate).toLocaleDateString()}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-gray-500">Status</dt>
                            <dd>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                    profile.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                                }`}>
                                    {profile.active ? 'Active' : 'Inactive'}
                                </span>
                            </dd>
                        </div>
                    </dl>
                ) : null}
            </div>

            {/* Today's assignments summary */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-700">Today's Schedule</h2>
                    <Link
                        to="/employee/assigned-bookings"
                        className="text-sm text-blue-600 hover:underline"
                    >
                        View all assigned bookings →
                    </Link>
                </div>
                {loadingAssignments ? (
                    <div className="space-y-2">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
                        ))}
                    </div>
                ) : assignmentsError ? (
                    <p className="text-red-600 text-sm">{assignmentsError}</p>
                ) : todayAssignments.length === 0 ? (
                    <p className="text-gray-500 text-sm italic">No bookings assigned for today.</p>
                ) : (
                    <ul className="space-y-2">
                        {todayAssignments.map(a => (
                            <li key={a.id} className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-md text-sm">
                                <span className="text-gray-700 font-medium">Booking {a.bookingId.slice(0, 8)}…</span>
                                <Link
                                    to={`/employee/bookings/${a.bookingId}/work`}
                                    className="text-blue-600 hover:underline text-xs font-medium"
                                >
                                    Work on this →
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Quick links */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Quick Links</h2>
                <div className="flex flex-wrap gap-3">
                    <Link
                        to="/employee/daily-bookings"
                        className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition"
                    >
                        Daily Schedule
                    </Link>
                    <Link
                        to="/employee/assigned-bookings"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
                    >
                        My Assigned Bookings
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;

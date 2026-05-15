import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import employeeService from '../services/employeeService';
import dashboardService from '../services/dashboardService';
import type { BookingAssignmentResponse, EmployeeResponse } from '../types/employee';
import type { EmployeeDashboardResponse } from '../types/dashboard';
import { BOOKING_STATUSES } from '../types/booking';
import { useAuth } from '../context/AuthContext';
import BookingStatusBadge from '../components/BookingStatusBadge';
import StatsCard from '../components/StatsCard';

const formatTime = (dt?: string) =>
    dt ? new Date(dt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : '--';

const formatDateTime = (dt?: string) =>
    dt ? new Date(dt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '--';

const MiniIcon = () => (
    <span className="block h-2.5 w-2.5 rounded-full bg-current" aria-hidden="true" />
);

const ArrowIcon = () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
);

const RefreshIcon = ({ spinning = false }: { spinning?: boolean }) => (
    <svg className={`h-4 w-4 ${spinning ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992m0 0V4.356m0 4.992-3.181-3.183a8.25 8.25 0 1 0 2.227 7.852" />
    </svg>
);

const getHttpStatus = (error: unknown) =>
    (error as { response?: { status?: number } }).response?.status;

const EmployeeDashboard: React.FC = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState<EmployeeResponse | null>(null);
    const [todayAssignments, setTodayAssignments] = useState<BookingAssignmentResponse[]>([]);
    const [workload, setWorkload] = useState<EmployeeDashboardResponse | null>(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [loadingAssignments, setLoadingAssignments] = useState(true);
    const [loadingWorkload, setLoadingWorkload] = useState(true);
    const [profileError, setProfileError] = useState<string | null>(null);
    const [assignmentsError, setAssignmentsError] = useState<string | null>(null);

    const fetchAssignments = useCallback(async () => {
        setLoadingAssignments(true);
        setAssignmentsError(null);
        try {
            const data = await employeeService.getMyTodayAssignments();
            setTodayAssignments(
                [...data].sort((a, b) => {
                    const left = a.appointmentDateTime ? new Date(a.appointmentDateTime).getTime() : 0;
                    const right = b.appointmentDateTime ? new Date(b.appointmentDateTime).getTime() : 0;
                    return left - right;
                })
            );
        } catch {
            setAssignmentsError("Failed to load today's assignments.");
        } finally {
            setLoadingAssignments(false);
        }
    }, []);

    const fetchWorkload = useCallback(async () => {
        setLoadingWorkload(true);
        try {
            const data = await dashboardService.getEmployeeDashboard();
            setWorkload(data);
        } catch {
            setWorkload(null);
        } finally {
            setLoadingWorkload(false);
        }
    }, []);

    useEffect(() => {
        let active = true;

        employeeService.getMe()
            .then(data => {
                if (active) setProfile(data);
            })
            .catch((err: unknown) => {
                if (!active) return;
                const status = getHttpStatus(err);
                if (status === 404) setProfileError('No employee profile linked to your account.');
                else setProfileError('Failed to load profile.');
            })
            .finally(() => {
                if (active) setLoadingProfile(false);
            });

        employeeService.getMyTodayAssignments()
            .then(data => {
                if (!active) return;
                setTodayAssignments(
                    [...data].sort((a, b) => {
                        const left = a.appointmentDateTime ? new Date(a.appointmentDateTime).getTime() : 0;
                        const right = b.appointmentDateTime ? new Date(b.appointmentDateTime).getTime() : 0;
                        return left - right;
                    })
                );
            })
            .catch(() => {
                if (active) setAssignmentsError("Failed to load today's assignments.");
            })
            .finally(() => {
                if (active) setLoadingAssignments(false);
            });

        dashboardService.getEmployeeDashboard()
            .then(data => {
                if (active) setWorkload(data);
            })
            .catch(() => {
                if (active) setWorkload(null);
            })
            .finally(() => {
                if (active) setLoadingWorkload(false);
            });

        return () => {
            active = false;
        };
    }, []);

    const syncQueue = () => {
        fetchAssignments();
        fetchWorkload();
    };

    const firstName = profile?.firstName || user?.firstName || 'there';
    const currentJob = todayAssignments[0];
    const upNext = todayAssignments.slice(1, 6);
    const loadingQueue = loadingAssignments || loadingWorkload;

    const targetCopy = workload
        ? `${workload.assignedBookings} assigned jobs / ${workload.bookingsInProgress} in progress`
        : todayAssignments.length > 0
            ? `${todayAssignments.length} assigned jobs queued for today`
            : 'Open your queue and keep each wash moving through the bay.';

    const statCards = [
        {
            label: 'Assigned today',
            value: workload?.assignedBookings ?? todayAssignments.length,
            icon: <MiniIcon />,
        },
        {
            label: 'In progress',
            value: workload?.bookingsInProgress ?? '--',
            icon: <MiniIcon />,
        },
        {
            label: 'Completed today',
            value: '--',
            icon: <MiniIcon />,
        },
        {
            label: 'Waiting customers',
            value: '--',
            icon: <MiniIcon />,
        },
    ];

    const profileDetails = useMemo(() => {
        if (!profile) return [];
        return [
            { label: 'Position', value: profile.position },
            { label: 'Hire date', value: profile.hireDate },
            { label: 'Status', value: profile.active ? 'Active' : 'Inactive' },
        ];
    }, [profile]);

    return (
        <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
            <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">Employee workspace</p>
                    <h1 className="mt-2 text-3xl font-semibold text-gray-950">Today's work, {firstName}.</h1>
                    <p className="mt-2 text-sm text-gray-600">{targetCopy}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={syncQueue}
                        disabled={loadingQueue}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-800 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    >
                        <RefreshIcon spinning={loadingQueue} />
                        Sync queue
                    </button>
                    <Link
                        to="/employee/assigned-bookings"
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-gray-950 px-4 text-sm font-medium text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    >
                        Open work queue
                        <ArrowIcon />
                    </Link>
                </div>
            </section>

            {profileError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                    {profileError}
                </div>
            )}

            {loadingWorkload ? (
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

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <section className="rounded-lg bg-gray-950 p-5 text-white shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-400">Current job</p>
                            <h2 className="mt-2 text-2xl font-semibold">
                                {currentJob ? currentJob.washServiceName ?? 'Assigned wash' : 'No active assignment'}
                            </h2>
                        </div>
                        {currentJob && (
                            <span className="rounded-full bg-white px-3 py-1 font-mono text-xs font-semibold text-gray-950">
                                {formatTime(currentJob.appointmentDateTime)}
                            </span>
                        )}
                    </div>

                    {loadingAssignments ? (
                        <div className="mt-6 h-32 animate-pulse rounded-lg bg-white/10" />
                    ) : assignmentsError ? (
                        <div className="mt-6 rounded-lg border border-red-400/40 bg-red-950/30 px-4 py-3 text-sm text-red-100" role="alert">
                            {assignmentsError}
                        </div>
                    ) : currentJob ? (
                        <div className="mt-6 grid gap-4 sm:grid-cols-3">
                            <div>
                                <p className="text-xs font-medium uppercase text-gray-400">Booking ID</p>
                                <p className="mt-1 font-mono text-sm">{currentJob.bookingId.slice(0, 8)}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium uppercase text-gray-400">Assigned by</p>
                                <p className="mt-1 truncate text-sm">{currentJob.assignedByEmail}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium uppercase text-gray-400">Appointment</p>
                                <p className="mt-1 font-mono text-sm">{formatDateTime(currentJob.appointmentDateTime)}</p>
                            </div>
                            <Link
                                to={`/employee/bookings/${currentJob.bookingId}/work`}
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-medium text-gray-950 transition hover:bg-gray-100 sm:col-span-3 sm:w-fit"
                            >
                                Work on this
                                <ArrowIcon />
                            </Link>
                        </div>
                    ) : (
                        <div className="mt-6">
                            <p className="text-sm text-gray-300">No bookings are assigned for today.</p>
                            <Link
                                to="/employee/daily-bookings"
                                className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-medium text-gray-950 transition hover:bg-gray-100"
                            >
                                View daily bookings
                                <ArrowIcon />
                            </Link>
                        </div>
                    )}
                </section>

                <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                    <h2 className="text-base font-semibold text-gray-950">Status workflow</h2>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {BOOKING_STATUSES.map(status => (
                            <BookingStatusBadge key={status} status={status} />
                        ))}
                    </div>
                    <p className="mt-4 text-sm text-gray-500">Use the work screen to move each booking through the matching state.</p>
                </section>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                        <div>
                            <h2 className="text-base font-semibold text-gray-950">Up next</h2>
                            <p className="mt-1 text-xs text-gray-500">Remaining assignments after your current job.</p>
                        </div>
                        <Link to="/employee/assigned-bookings" className="text-sm font-medium text-gray-600 hover:text-gray-950">
                            View queue
                        </Link>
                    </div>

                    {loadingAssignments ? (
                        <div className="space-y-3 p-5">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <div key={index} className="h-14 animate-pulse rounded-lg bg-gray-100" />
                            ))}
                        </div>
                    ) : assignmentsError ? (
                        <div className="px-5 py-6 text-sm text-red-700" role="alert">{assignmentsError}</div>
                    ) : upNext.length === 0 ? (
                        <div className="px-5 py-10 text-center">
                            <p className="text-sm font-medium text-gray-700">No more jobs in your queue.</p>
                            <p className="mt-1 text-sm text-gray-500">New assignments will appear here after sync.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {upNext.map(assignment => (
                                <Link
                                    key={assignment.id}
                                    to={`/employee/bookings/${assignment.bookingId}/work`}
                                    className="grid gap-3 px-5 py-4 transition hover:bg-gray-50 sm:grid-cols-[auto_1fr_auto]"
                                >
                                    <span className="font-mono text-sm font-semibold text-gray-950">{formatTime(assignment.appointmentDateTime)}</span>
                                    <span>
                                        <span className="block text-sm font-medium text-gray-900">{assignment.washServiceName ?? 'Assigned wash'}</span>
                                        <span className="mt-1 block font-mono text-xs text-gray-500">{assignment.bookingId.slice(0, 8)}</span>
                                    </span>
                                    <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-600">
                                        Open
                                        <ArrowIcon />
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

                <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                    <h2 className="text-base font-semibold text-gray-950">Employee profile</h2>
                    {loadingProfile ? (
                        <div className="mt-4 space-y-3">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <div key={index} className="h-10 animate-pulse rounded-lg bg-gray-100" />
                            ))}
                        </div>
                    ) : profile ? (
                        <div className="mt-4 space-y-3">
                            <div>
                                <p className="text-xs font-medium uppercase text-gray-500">Name</p>
                                <p className="mt-1 text-sm font-semibold text-gray-950">{profile.firstName} {profile.lastName}</p>
                            </div>
                            {profileDetails.map(detail => (
                                <div key={detail.label}>
                                    <p className="text-xs font-medium uppercase text-gray-500">{detail.label}</p>
                                    <p className="mt-1 font-mono text-sm text-gray-800">{detail.value}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="mt-4 text-sm text-gray-500">Profile details are unavailable.</p>
                    )}
                </section>
            </div>
        </div>
    );
};

export default EmployeeDashboard;

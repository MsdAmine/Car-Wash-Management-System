import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import employeeService from '../services/employeeService';
import type { BookingAssignmentResponse } from '../types/employee';
import { getApiErrorMessage } from '../lib/apiError';

const formatDateTime = (dt: string) =>
    new Date(dt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

const EmployeeAssignedBookings: React.FC = () => {
    const [assignments, setAssignments] = useState<BookingAssignmentResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAssignments = async () => {
        setLoading(true);
        setError(null);
        try {
            const profile = await employeeService.getMe();
            const data = await employeeService.getAssignedBookings(profile.id);
            const sorted = [...data].sort(
                (a, b) => new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime()
            );
            setAssignments(sorted);
        } catch (err) {
            setError(getApiErrorMessage(err, {
                404: 'No employee profile found for your account.',
            }, 'Failed to load assigned bookings. Please try again.'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void Promise.resolve().then(fetchAssignments);
    }, []);

    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-950">My Assigned Bookings</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Bookings assigned to you by an admin</p>
                </div>
                <button
                    onClick={fetchAssignments}
                    className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-950 font-medium bg-white border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    Refresh
                </button>
            </div>

            {error && (
                <div role="alert" className="flex items-center justify-between bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                        </svg>
                        <span className="text-sm">{error}</span>
                    </div>
                    <button onClick={fetchAssignments} className="text-sm font-medium text-red-700 hover:text-red-900 underline">
                        Retry
                    </button>
                </div>
            )}

            {loading ? (
                <div className="space-y-3" aria-label="Loading assignments" aria-busy="true">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : assignments.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                    </svg>
                    <p className="text-gray-600 font-medium">No assignments yet</p>
                    <p className="text-sm text-gray-400 mt-1">You have no bookings assigned to you at this time.</p>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm" aria-label="Assigned bookings">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th scope="col" className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">Booking ID</th>
                                    <th scope="col" className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">Assigned By</th>
                                    <th scope="col" className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">Assigned At</th>
                                    <th scope="col" className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {assignments.map(a => (
                                    <tr key={a.id} className="hover:bg-gray-50 transition">
                                        <td className="px-5 py-4 font-mono text-xs text-gray-700">
                                            {a.bookingId.slice(0, 8)}...
                                        </td>
                                        <td className="px-5 py-4 text-gray-600 text-sm">{a.assignedByEmail}</td>
                                        <td className="px-5 py-4 text-gray-600 text-xs whitespace-nowrap">{formatDateTime(a.assignedAt)}</td>
                                        <td className="px-5 py-4">
                                            <Link
                                                to={`/employee/bookings/${a.bookingId}/work`}
                                                className="inline-flex items-center gap-1 text-xs font-medium text-gray-700 hover:text-gray-950 bg-white border border-gray-200 hover:bg-gray-50 px-2.5 py-1 rounded-md transition"
                                            >
                                                Open work
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeAssignedBookings;

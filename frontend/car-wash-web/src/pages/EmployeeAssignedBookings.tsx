import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import employeeService from '../services/employeeService';
import type { BookingAssignmentResponse } from '../types/employee';

const formatDateTime = (dt: string) =>
    new Date(dt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

const EmployeeAssignedBookings: React.FC = () => {
    const [assignments, setAssignments] = useState<BookingAssignmentResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [employeeId, setEmployeeId] = useState<string | null>(null);

    const fetchAssignments = async () => {
        setLoading(true);
        setError(null);
        try {
            // First get own profile to know our employee ID, then fetch all assignments
            const profile = await employeeService.getMe();
            setEmployeeId(profile.id);
            const data = await employeeService.getAssignedBookings(profile.id);
            // Sort newest first by assignedAt
            const sorted = [...data].sort(
                (a, b) => new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime()
            );
            setAssignments(sorted);
        } catch (err: any) {
            const status = err.response?.status;
            if (status === 404) {
                setError('No employee profile found for your account.');
            } else {
                setError('Failed to load assigned bookings. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssignments();
    }, []);

    return (
        <div className="max-w-5xl mx-auto p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">My Assigned Bookings</h1>
                <button
                    onClick={fetchAssignments}
                    className="text-sm text-blue-600 hover:underline"
                >
                    Refresh
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center justify-between">
                    <span>{error}</span>
                    <button onClick={fetchAssignments} className="ml-4 text-sm font-medium underline hover:no-underline">
                        Retry
                    </button>
                </div>
            )}

            {loading ? (
                <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
                    ))}
                </div>
            ) : assignments.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                    <p className="text-lg">You have no assigned bookings.</p>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="text-left px-4 py-3 font-medium text-gray-600">Booking ID</th>
                                <th className="text-left px-4 py-3 font-medium text-gray-600">Assigned By</th>
                                <th className="text-left px-4 py-3 font-medium text-gray-600">Assigned At</th>
                                <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assignments.map(a => (
                                <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="px-4 py-3 font-mono text-xs text-gray-700">
                                        {a.bookingId.slice(0, 8)}…
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{a.assignedByEmail}</td>
                                    <td className="px-4 py-3 text-gray-600">{formatDateTime(a.assignedAt)}</td>
                                    <td className="px-4 py-3">
                                        <Link
                                            to={`/employee/bookings/${a.bookingId}/work`}
                                            className="text-blue-600 hover:underline text-xs font-medium"
                                        >
                                            Work on this
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default EmployeeAssignedBookings;

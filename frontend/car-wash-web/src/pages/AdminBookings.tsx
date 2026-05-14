import React, { useEffect, useState } from 'react';
import bookingService from '../services/bookingService';
import type { BookingResponse, BookingStatus } from '../types/booking';
import BookingStatusBadge from '../components/BookingStatusBadge';
import { BookingTableSkeleton } from '../components/BookingSkeletons';
import AssignEmployeeModal from '../components/AssignEmployeeModal';

const STATUSES: BookingStatus[] = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

const formatDateTime = (dt: string) =>
    new Date(dt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

const AdminBookings: React.FC = () => {
    const [bookings, setBookings] = useState<BookingResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<BookingStatus | 'ALL'>('ALL');
    const [assignModalBookingId, setAssignModalBookingId] = useState<string | null>(null);

    const fetchBookings = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await bookingService.getAll();
            setBookings(data);
        } catch {
            setError('Failed to load bookings. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleStatusChange = async (id: string, status: BookingStatus) => {
        setUpdatingId(id);
        setActionError(null);
        try {
            const updated = await bookingService.updateStatus(id, { status });
            setBookings(prev => prev.map(b => b.id === id ? updated : b));
        } catch (err: any) {
            const httpStatus = err.response?.status;
            if (httpStatus === 400) {
                setActionError('Invalid status transition.');
            } else if (httpStatus === 404) {
                setActionError('Booking not found.');
            } else {
                setActionError('Failed to update booking status. Please try again.');
            }
        } finally {
            setUpdatingId(null);
        }
    };

    const displayed = filterStatus === 'ALL'
        ? bookings
        : bookings.filter(b => b.status === filterStatus);

    return (
        <div className="max-w-6xl mx-auto p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manage Bookings</h1>
                <select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value as BookingStatus | 'ALL')}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="ALL">All Statuses</option>
                    {STATUSES.map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center justify-between">
                    <span>{error}</span>
                    <button onClick={fetchBookings} className="ml-4 text-sm font-medium underline hover:no-underline">
                        Retry
                    </button>
                </div>
            )}

            {actionError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {actionError}
                </div>
            )}

            {loading ? (
                <BookingTableSkeleton rows={5} />
            ) : displayed.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                    <p className="text-lg">No bookings found.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="text-left px-4 py-3 font-medium text-gray-600">Customer</th>
                                <th className="text-left px-4 py-3 font-medium text-gray-600">Vehicle</th>
                                <th className="text-left px-4 py-3 font-medium text-gray-600">Service</th>
                                <th className="text-left px-4 py-3 font-medium text-gray-600">Appointment</th>
                                <th className="text-left px-4 py-3 font-medium text-gray-600">Total</th>
                                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                                <th className="text-left px-4 py-3 font-medium text-gray-600">Employees</th>
                                <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayed.map(booking => (
                                <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="px-4 py-3 text-gray-700">{booking.customerEmail}</td>
                                    <td className="px-4 py-3 text-gray-700">{booking.vehicleLicensePlate}</td>
                                    <td className="px-4 py-3 text-gray-700">{booking.washServiceName}</td>
                                    <td className="px-4 py-3 text-gray-700">{formatDateTime(booking.appointmentDateTime)}</td>
                                    <td className="px-4 py-3 text-gray-700">${Number(booking.totalPrice).toFixed(2)}</td>
                                    <td className="px-4 py-3">
                                        <BookingStatusBadge status={booking.status} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => setAssignModalBookingId(booking.id)}
                                            className="text-purple-600 hover:underline text-xs font-medium"
                                        >
                                            Assign
                                        </button>
                                    </td>
                                    <td className="px-4 py-3">
                                        <select
                                            value={booking.status}
                                            disabled={updatingId === booking.id || booking.status === 'CANCELLED'}
                                            onChange={e => handleStatusChange(booking.id, e.target.value as BookingStatus)}
                                            className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {STATUSES.map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {assignModalBookingId && (
                <AssignEmployeeModal
                    bookingId={assignModalBookingId}
                    onClose={() => setAssignModalBookingId(null)}
                />
            )}
        </div>
    );
};

export default AdminBookings;

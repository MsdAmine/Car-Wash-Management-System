import React, { useEffect, useState } from 'react';
import bookingService from '../services/bookingService';
import { BOOKING_STATUSES, type BookingResponse, type BookingStatus } from '../types/booking';
import BookingStatusBadge from '../components/BookingStatusBadge';
import { BookingTableSkeleton } from '../components/BookingSkeletons';
import AssignEmployeeModal from '../components/AssignEmployeeModal';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { getApiErrorMessage } from '../lib/apiError';

const STATUSES: BookingStatus[] = [...BOOKING_STATUSES];

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
    const [pendingComplete, setPendingComplete] = useState<{ id: string; customerEmail: string } | null>(null);

    const fetchBookings = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await bookingService.getAll();
            setBookings(data);
        } catch (err) {
            setError(getApiErrorMessage(err, {}, 'Failed to load bookings. Please try again.'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleStatusChange = async (id: string, status: BookingStatus) => {
        if (status === 'COMPLETED') {
            const booking = bookings.find(b => b.id === id);
            setPendingComplete({ id, customerEmail: booking?.customerEmail ?? '' });
            return;
        }
        await applyStatusChange(id, status);
    };

    const applyStatusChange = async (id: string, status: BookingStatus) => {
        setUpdatingId(id);
        setActionError(null);
        try {
            const updated = await bookingService.updateStatus(id, { status });
            setBookings(prev => prev.map(b => b.id === id ? updated : b));
        } catch (err) {
            setActionError(getApiErrorMessage(err, {
                400: 'Invalid status transition.',
                404: 'Booking not found.',
            }, 'Failed to update booking status. Please try again.'));
        } finally {
            setUpdatingId(null);
        }
    };

    const handleCompleteConfirm = async () => {
        if (!pendingComplete) return;
        const { id } = pendingComplete;
        setPendingComplete(null);
        await applyStatusChange(id, 'COMPLETED');
    };

    const displayed = filterStatus === 'ALL'
        ? bookings
        : bookings.filter(b => b.status === filterStatus);

    const statusCounts = STATUSES.reduce((acc, s) => {
        acc[s] = bookings.filter(b => b.status === s).length;
        return acc;
    }, {} as Record<BookingStatus, number>);

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Manage Bookings</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {bookings.length} total booking{bookings.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <label htmlFor="statusFilter" className="text-sm text-gray-600 font-medium whitespace-nowrap">Filter:</label>
                    <select
                        id="statusFilter"
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value as BookingStatus | 'ALL')}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                        <option value="ALL">All Statuses ({bookings.length})</option>
                        {STATUSES.map(s => (
                            <option key={s} value={s}>{s} ({statusCounts[s]})</option>
                        ))}
                    </select>
                </div>
            </div>

            {error && (
                <div role="alert" className="flex items-center justify-between bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                        </svg>
                        <span className="text-sm">{error}</span>
                    </div>
                    <button onClick={fetchBookings} className="text-sm font-medium text-red-700 hover:text-red-900 underline">
                        Retry
                    </button>
                </div>
            )}

            {actionError && (
                <div role="alert" aria-live="polite" className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5">
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg>
                    <span className="text-sm">{actionError}</span>
                </div>
            )}

            {loading ? (
                <BookingTableSkeleton rows={5} />
            ) : displayed.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <svg className="w-10 h-10 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                    </svg>
                    <p className="text-gray-500 font-medium">No bookings found</p>
                    {filterStatus !== 'ALL' && (
                        <p className="text-sm text-gray-400 mt-1">
                            No {filterStatus.toLowerCase()} bookings.{' '}
                            <button
                                onClick={() => setFilterStatus('ALL')}
                                className="text-blue-600 hover:underline"
                            >
                                Show all
                            </button>
                        </p>
                    )}
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm" aria-label="Bookings list">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th scope="col" className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">Customer</th>
                                    <th scope="col" className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">Vehicle</th>
                                    <th scope="col" className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">Service</th>
                                    <th scope="col" className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">Appointment</th>
                                    <th scope="col" className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">Amount</th>
                                    <th scope="col" className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">Status</th>
                                    <th scope="col" className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">Assign</th>
                                    <th scope="col" className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">Change Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {displayed.map(booking => (
                                    <tr key={booking.id} className="hover:bg-gray-50 transition">
                                        <td className="px-5 py-4 text-gray-700 text-xs">{booking.customerEmail}</td>
                                        <td className="px-5 py-4">
                                            <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{booking.vehicleLicensePlate}</span>
                                        </td>
                                        <td className="px-5 py-4 text-gray-700">{booking.washServiceName}</td>
                                        <td className="px-5 py-4 text-gray-600 text-xs whitespace-nowrap">{formatDateTime(booking.appointmentDateTime)}</td>
                                        <td className="px-5 py-4">
                                            <span className="font-semibold text-gray-800">${Number(booking.totalPrice).toFixed(2)}</span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <BookingStatusBadge status={booking.status} />
                                        </td>
                                        <td className="px-5 py-4">
                                            <button
                                                onClick={() => setAssignModalBookingId(booking.id)}
                                                className="inline-flex items-center gap-1 text-xs font-medium text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-md transition"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                                                </svg>
                                                Assign
                                            </button>
                                        </td>
                                        <td className="px-5 py-4">
                                            <select
                                                value={booking.status}
                                                disabled={updatingId === booking.id || booking.status === 'CANCELLED'}
                                                onChange={e => handleStatusChange(booking.id, e.target.value as BookingStatus)}
                                                aria-label={`Change status for booking by ${booking.customerEmail}`}
                                                className="px-2 py-1.5 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
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
                </div>
            )}

            {assignModalBookingId && (
                <AssignEmployeeModal
                    bookingId={assignModalBookingId}
                    onClose={() => setAssignModalBookingId(null)}
                />
            )}

            <ConfirmationDialog
                open={pendingComplete !== null}
                title="Confirm Payment & Completion"
                message={`Mark this booking for ${pendingComplete?.customerEmail ?? 'the customer'} as completed? This confirms payment has been received.`}
                confirmLabel="Confirm Completion"
                cancelLabel="Cancel"
                variant="info"
                onConfirm={handleCompleteConfirm}
                onCancel={() => setPendingComplete(null)}
            />
        </div>
    );
};

export default AdminBookings;

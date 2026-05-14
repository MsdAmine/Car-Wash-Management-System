import React, { useEffect, useState } from 'react';
import bookingService from '../services/bookingService';
import type { BookingResponse, BookingStatus } from '../types/booking';

const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-gray-100 text-gray-500',
};

const UPDATABLE_STATUSES: BookingStatus[] = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

const formatTime = (dt: string) =>
    new Date(dt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

const EmployeeBookings: React.FC = () => {
    const [bookings, setBookings] = useState<BookingResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);

    const fetchBookings = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await bookingService.getToday();
            const sorted = [...data].sort(
                (a, b) => new Date(a.appointmentDateTime).getTime() - new Date(b.appointmentDateTime).getTime()
            );
            setBookings(sorted);
        } catch {
            setError("Failed to load today's bookings. Please try again.");
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
                setActionError('Failed to update status. Please try again.');
            }
        } finally {
            setUpdatingId(null);
        }
    };

    const today = new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="max-w-5xl mx-auto p-8">
            <div className="flex justify-between items-center mb-2">
                <h1 className="text-2xl font-bold text-gray-800">Daily Bookings</h1>
                <button
                    onClick={fetchBookings}
                    className="text-sm text-blue-600 hover:underline"
                >
                    Refresh
                </button>
            </div>
            <p className="text-sm text-gray-500 mb-6">{today}</p>

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
                <div className="flex items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" />
                    <p className="ml-3 text-gray-500">Loading schedule...</p>
                </div>
            ) : bookings.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                    <p className="text-lg">No bookings scheduled for today.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {bookings.map(booking => (
                        <div
                            key={booking.id}
                            className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                        >
                            <div className="flex items-start gap-4">
                                <div className="text-center min-w-[56px]">
                                    <p className="text-lg font-bold text-blue-700">{formatTime(booking.appointmentDateTime)}</p>
                                    <p className="text-xs text-gray-400">{booking.durationMinutes} min</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">{booking.washServiceName}</p>
                                    <p className="text-sm text-gray-500">{booking.vehicleLicensePlate} &bull; {booking.customerEmail}</p>
                                    {booking.notes && (
                                        <p className="text-xs text-gray-400 mt-0.5 italic">{booking.notes}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[booking.status] ?? ''}`}>
                                    {booking.status}
                                </span>
                                <select
                                    value={booking.status}
                                    disabled={updatingId === booking.id || booking.status === 'CANCELLED'}
                                    onChange={e => handleStatusChange(booking.id, e.target.value as BookingStatus)}
                                    className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {UPDATABLE_STATUSES.map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EmployeeBookings;

import React, { useEffect, useState } from 'react';
import bookingService from '../services/bookingService';
import { BOOKING_STATUSES, type BookingResponse, type BookingStatus } from '../types/booking';
import BookingStatusBadge from '../components/BookingStatusBadge';
import { BookingEmployeeSkeleton } from '../components/BookingSkeletons';

const UPDATABLE_STATUSES: BookingStatus[] = [...BOOKING_STATUSES];

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
        <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
            <div className="mb-2 flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-950">Daily Bookings</h1>
                    <p className="mt-1 text-sm text-gray-500">{today}</p>
                </div>
                <button
                    onClick={fetchBookings}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-gray-950"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    Refresh
                </button>
            </div>

            {error && (
                <div className="mb-4 mt-4 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
                <div className="mb-4 mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg>
                    <span className="text-sm">{actionError}</span>
                </div>
            )}

            <div className="mt-5">
                {loading ? (
                    <BookingEmployeeSkeleton rows={4} />
                ) : bookings.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 bg-white py-20 text-center shadow-sm">
                        <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                        </svg>
                        <p className="text-gray-600 font-medium">No bookings scheduled for today</p>
                        <p className="text-sm text-gray-400 mt-1">Check back later or refresh the page.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {bookings.map(booking => (
                            <div
                                key={booking.id}
                                className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-300 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="min-w-[64px] rounded-lg border border-gray-200 bg-gray-50 px-2 py-2 text-center">
                                        <p className="text-lg font-bold text-gray-950">{formatTime(booking.appointmentDateTime)}</p>
                                        <p className="text-xs text-gray-500">{booking.durationMinutes} min</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">{booking.washServiceName}</p>
                                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                            <span className="text-xs text-gray-500 font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                                                {booking.vehicleLicensePlate}
                                            </span>
                                            <span className="text-gray-300">/</span>
                                            <span className="text-xs text-gray-500">{booking.customerEmail}</span>
                                        </div>
                                        {booking.notes && (
                                            <p className="text-xs text-gray-400 mt-1 italic">&ldquo;{booking.notes}&rdquo;</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <BookingStatusBadge status={booking.status} />
                                    <select
                                        value={booking.status}
                                        disabled={updatingId === booking.id || booking.status === 'CANCELLED'}
                                        onChange={e => handleStatusChange(booking.id, e.target.value as BookingStatus)}
                                        className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 disabled:cursor-not-allowed disabled:opacity-50"
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
        </div>
    );
};

export default EmployeeBookings;

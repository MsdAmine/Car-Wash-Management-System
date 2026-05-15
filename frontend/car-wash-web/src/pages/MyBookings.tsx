import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bookingService from '../services/bookingService';
import type { BookingResponse, BookingStatus } from '../types/booking';
import ConfirmationDialog from '../components/ConfirmationDialog';
import BookingStatusBadge from '../components/BookingStatusBadge';
import { BookingCardSkeleton } from '../components/BookingSkeletons';

const formatDateTime = (dt: string) =>
    new Date(dt).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
    });

const statusBorderClass: Record<BookingStatus, string> = {
    PENDING: 'border-l-gray-300',
    CONFIRMED: 'border-l-gray-900',
    IN_PROGRESS: 'border-l-neutral-400',
    COMPLETED: 'border-l-emerald-400',
    CANCELLED: 'border-l-gray-300',
    NO_SHOW: 'border-l-amber-400',
};

const MyBookings: React.FC = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<BookingResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cancellingId, setCancellingId] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);
    const [pendingCancelId, setPendingCancelId] = useState<string | null>(null);

    const fetchBookings = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await bookingService.getMyBookings();
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

    const handleCancelConfirm = async () => {
        if (!pendingCancelId) return;
        const id = pendingCancelId;
        setPendingCancelId(null);
        setCancellingId(id);
        setActionError(null);
        try {
            const updated = await bookingService.cancel(id);
            setBookings(prev => prev.map(b => b.id === id ? updated : b));
        } catch (err: any) {
            const status = err.response?.status;
            if (status === 400) {
                setActionError('Only pending bookings can be cancelled.');
            } else if (status === 403) {
                setActionError('You do not have permission to cancel this booking.');
            } else if (status === 404) {
                setActionError('Booking not found.');
            } else {
                setActionError('Failed to cancel booking. Please try again.');
            }
        } finally {
            setCancellingId(null);
        }
    };

    return (
        <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-950">My Bookings</h1>
                    <p className="mt-1 text-sm text-gray-500">Track and manage your appointments</p>
                </div>
                <button
                    onClick={() => navigate('/book-appointment')}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-950 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Book Appointment
                </button>
            </div>

            {error && (
                <div className="mb-5 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
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
                <div className="mb-5 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg>
                    <span className="text-sm">{actionError}</span>
                </div>
            )}

            {loading ? (
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => <BookingCardSkeleton key={i} />)}
                </div>
            ) : bookings.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 bg-white py-20 text-center shadow-sm">
                    <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                    </svg>
                    <p className="text-gray-600 font-medium">No bookings yet</p>
                    <p className="text-sm text-gray-400 mt-1 mb-4">Schedule your first car wash appointment.</p>
                    <button
                        onClick={() => navigate('/book-appointment')}
                        className="inline-flex items-center gap-2 rounded-lg bg-gray-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                    >
                        Book Appointment
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map(booking => (
                        <div
                            key={booking.id}
                            className={`rounded-xl border border-l-4 border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-300 ${statusBorderClass[booking.status] ?? 'border-l-gray-200'}`}
                        >
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex-1 min-w-0">
                                    <p className="text-base font-semibold text-gray-950">{booking.washServiceName}</p>
                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                        <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                                            </svg>
                                            {booking.vehicleLicensePlate}
                                        </span>
                                        <span className="text-gray-300">/</span>
                                        <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                                            </svg>
                                            {formatDateTime(booking.appointmentDateTime)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                        <span>{booking.durationMinutes} min</span>
                                        <span className="text-gray-300">/</span>
                                        <span className="font-semibold text-gray-700">${Number(booking.totalPrice).toFixed(2)}</span>
                                    </div>
                                </div>
                                <BookingStatusBadge status={booking.status} />
                            </div>
                            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
                                <button
                                    onClick={() => navigate(`/bookings/${booking.id}`)}
                                    className="text-sm font-medium text-gray-800 underline-offset-4 hover:text-gray-950 hover:underline"
                                >
                                    View Details
                                </button>
                                {booking.status === 'PENDING' && (
                                    <button
                                        onClick={() => setPendingCancelId(booking.id)}
                                        disabled={cancellingId === booking.id}
                                        className="rounded-md px-2 py-1 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {cancellingId === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ConfirmationDialog
                open={pendingCancelId !== null}
                title="Cancel Booking"
                message="Are you sure you want to cancel this booking? This action cannot be undone."
                confirmLabel="Yes, Cancel"
                cancelLabel="Keep Booking"
                variant="warning"
                onConfirm={handleCancelConfirm}
                onCancel={() => setPendingCancelId(null)}
            />
        </div>
    );
};

export default MyBookings;

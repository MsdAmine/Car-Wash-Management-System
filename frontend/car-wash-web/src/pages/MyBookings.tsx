import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bookingService from '../services/bookingService';
import type { BookingResponse } from '../types/booking';
import ConfirmDialog from '../components/ConfirmDialog';

const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-gray-100 text-gray-500',
};

const formatDateTime = (dt: string) =>
    new Date(dt).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
    });

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
        <div className="max-w-4xl mx-auto p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">My Bookings</h1>
                <button
                    onClick={() => navigate('/book-appointment')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm font-medium"
                >
                    + Book Appointment
                </button>
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
                <div className="flex items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" />
                    <p className="ml-3 text-gray-500">Loading bookings...</p>
                </div>
            ) : bookings.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                    <p className="text-lg">You have no bookings yet.</p>
                    <p className="text-sm mt-1">Click <strong>+ Book Appointment</strong> to schedule a wash.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map(booking => (
                        <div
                            key={booking.id}
                            className="bg-white border border-gray-200 rounded-lg shadow-sm p-5"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-gray-800">{booking.washServiceName}</p>
                                    <p className="text-sm text-gray-500 mt-0.5">
                                        {booking.vehicleLicensePlate} &bull; {formatDateTime(booking.appointmentDateTime)}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Duration: {booking.durationMinutes} min &bull; Total: ${Number(booking.totalPrice).toFixed(2)}
                                    </p>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[booking.status] ?? ''}`}>
                                    {booking.status}
                                </span>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={() => navigate(`/bookings/${booking.id}`)}
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    View Details
                                </button>
                                {booking.status === 'PENDING' && (
                                    <button
                                        onClick={() => setPendingCancelId(booking.id)}
                                        disabled={cancellingId === booking.id}
                                        className="text-sm text-red-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {cancellingId === booking.id ? 'Cancelling...' : 'Cancel'}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ConfirmDialog
                open={pendingCancelId !== null}
                title="Cancel Booking"
                message="Are you sure you want to cancel this booking? This action cannot be undone."
                confirmLabel="Yes, Cancel"
                cancelLabel="Keep Booking"
                onConfirm={handleCancelConfirm}
                onCancel={() => setPendingCancelId(null)}
            />
        </div>
    );
};

export default MyBookings;

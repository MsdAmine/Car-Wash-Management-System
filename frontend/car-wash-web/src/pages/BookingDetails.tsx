import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
    new Date(dt).toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' });

const BookingDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [booking, setBooking] = useState<BookingResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cancelling, setCancelling] = useState(false);
    const [cancelError, setCancelError] = useState<string | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        if (!id) return;
        bookingService.getById(id)
            .then(setBooking)
            .catch((err: any) => {
                const status = err.response?.status;
                if (status === 404) {
                    setError('Booking not found.');
                } else if (status === 403) {
                    setError('You do not have permission to view this booking.');
                } else {
                    setError('Failed to load booking details. Please try again.');
                }
            })
            .finally(() => setLoading(false));
    }, [id]);

    const handleCancel = async () => {
        if (!booking) return;
        setShowConfirm(false);
        setCancelling(true);
        setCancelError(null);
        try {
            const updated = await bookingService.cancel(booking.id);
            setBooking(updated);
        } catch (err: any) {
            const status = err.response?.status;
            if (status === 400) {
                setCancelError('Only pending bookings can be cancelled.');
            } else {
                setCancelError('Failed to cancel booking. Please try again.');
            }
        } finally {
            setCancelling(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-8">
            <div className="flex items-center mb-6 gap-3">
                <button
                    onClick={() => navigate('/my-bookings')}
                    className="text-gray-500 hover:text-gray-700 transition"
                    aria-label="Back to My Bookings"
                >
                    &#8592;
                </button>
                <h1 className="text-2xl font-bold text-gray-800">Booking Details</h1>
            </div>

            {loading && (
                <div className="flex items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" />
                    <p className="ml-3 text-gray-500">Loading...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {booking && (
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-4">
                    <div className="flex justify-between items-start">
                        <h2 className="text-lg font-semibold text-gray-800">{booking.washServiceName}</h2>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[booking.status] ?? ''}`}>
                            {booking.status}
                        </span>
                    </div>

                    <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                        <div>
                            <dt className="text-gray-500">Vehicle</dt>
                            <dd className="font-medium text-gray-800">{booking.vehicleLicensePlate}</dd>
                        </div>
                        <div>
                            <dt className="text-gray-500">Price</dt>
                            <dd className="font-medium text-gray-800">${Number(booking.totalPrice).toFixed(2)}</dd>
                        </div>
                        <div>
                            <dt className="text-gray-500">Appointment</dt>
                            <dd className="font-medium text-gray-800">{formatDateTime(booking.appointmentDateTime)}</dd>
                        </div>
                        <div>
                            <dt className="text-gray-500">End Time</dt>
                            <dd className="font-medium text-gray-800">{formatDateTime(booking.endDateTime)}</dd>
                        </div>
                        <div>
                            <dt className="text-gray-500">Duration</dt>
                            <dd className="font-medium text-gray-800">{booking.durationMinutes} min</dd>
                        </div>
                        <div>
                            <dt className="text-gray-500">Booked On</dt>
                            <dd className="font-medium text-gray-800">{formatDateTime(booking.createdAt)}</dd>
                        </div>
                    </dl>

                    {booking.notes && (
                        <div>
                            <p className="text-sm text-gray-500">Notes</p>
                            <p className="text-sm text-gray-800 mt-1">{booking.notes}</p>
                        </div>
                    )}

                    {cancelError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
                            {cancelError}
                        </div>
                    )}

                    {booking.status === 'PENDING' && (
                        <button
                            onClick={() => setShowConfirm(true)}
                            disabled={cancelling}
                            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {cancelling ? 'Cancelling...' : 'Cancel Booking'}
                        </button>
                    )}
                </div>
            )}

            <ConfirmDialog
                open={showConfirm}
                title="Cancel Booking"
                message="Are you sure you want to cancel this booking? This action cannot be undone."
                confirmLabel="Yes, Cancel"
                cancelLabel="Keep Booking"
                onConfirm={handleCancel}
                onCancel={() => setShowConfirm(false)}
            />
        </div>
    );
};

export default BookingDetails;

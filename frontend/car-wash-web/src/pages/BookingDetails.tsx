import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import bookingService from '../services/bookingService';
import type { BookingResponse } from '../types/booking';
import ConfirmDialog from '../components/ConfirmDialog';
import BookingStatusBadge from '../components/BookingStatusBadge';

const formatDateTime = (dt: string) =>
    new Date(dt).toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' });

const statusBorderClass: Record<string, string> = {
    PENDING: 'border-t-yellow-400',
    CONFIRMED: 'border-t-blue-400',
    COMPLETED: 'border-t-green-400',
    CANCELLED: 'border-t-gray-300',
};

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
        <div className="max-w-2xl mx-auto p-6 sm:p-8">
            {/* Back nav */}
            <button
                onClick={() => navigate('/my-bookings')}
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                Back to My Bookings
            </button>

            <h1 className="text-2xl font-bold text-gray-800 mb-6">Booking Details</h1>

            {loading && (
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
                    <div className="space-y-4 animate-pulse">
                        <div className="h-6 bg-gray-100 rounded w-1/2" />
                        <div className="grid grid-cols-2 gap-4">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-12 bg-gray-100 rounded" />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-4 rounded-xl">
                    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg>
                    <span className="text-sm">{error}</span>
                </div>
            )}

            {booking && (
                <div className={`bg-white border border-gray-200 border-t-4 ${statusBorderClass[booking.status] ?? 'border-t-gray-200'} rounded-xl shadow-sm overflow-hidden`}>
                    {/* Header */}
                    <div className="flex justify-between items-start px-6 py-5 border-b border-gray-100">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">{booking.washServiceName}</h2>
                            <p className="text-xs text-gray-400 mt-0.5">
                                Booking ID: <span className="font-mono">{booking.id.slice(0, 8)}...</span>
                            </p>
                        </div>
                        <BookingStatusBadge status={booking.status} />
                    </div>

                    {/* Details grid */}
                    <div className="px-6 py-5">
                        <dl className="grid grid-cols-2 gap-x-8 gap-y-5 text-sm">
                            <div>
                                <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Vehicle</dt>
                                <dd className="font-medium text-gray-800 flex items-center gap-1.5">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                                    </svg>
                                    {booking.vehicleLicensePlate}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Total Price</dt>
                                <dd className="font-semibold text-xl text-green-700">${Number(booking.totalPrice).toFixed(2)}</dd>
                            </div>
                            <div>
                                <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Appointment</dt>
                                <dd className="font-medium text-gray-800">{formatDateTime(booking.appointmentDateTime)}</dd>
                            </div>
                            <div>
                                <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">End Time</dt>
                                <dd className="font-medium text-gray-800">{formatDateTime(booking.endDateTime)}</dd>
                            </div>
                            <div>
                                <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Duration</dt>
                                <dd className="font-medium text-gray-800">
                                    <span className="inline-flex items-center gap-1 text-gray-600">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                        {booking.durationMinutes} min
                                    </span>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Booked On</dt>
                                <dd className="font-medium text-gray-800">{formatDateTime(booking.createdAt)}</dd>
                            </div>
                        </dl>

                        {booking.notes && (
                            <div className="mt-5 pt-5 border-t border-gray-100">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Notes</p>
                                <p className="text-sm text-gray-700 bg-gray-50 rounded-lg px-4 py-3 italic">
                                    {booking.notes}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    {(booking.status === 'PENDING' || cancelError) && (
                        <div className="px-6 pb-5 border-t border-gray-100 pt-4">
                            {cancelError && (
                                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-3">
                                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                    </svg>
                                    {cancelError}
                                </div>
                            )}
                            {booking.status === 'PENDING' && (
                                <button
                                    onClick={() => setShowConfirm(true)}
                                    disabled={cancelling}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {cancelling ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Cancelling...
                                        </>
                                    ) : (
                                        'Cancel Booking'
                                    )}
                                </button>
                            )}
                        </div>
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

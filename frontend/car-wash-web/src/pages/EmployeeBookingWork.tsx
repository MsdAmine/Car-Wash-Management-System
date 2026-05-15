import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import bookingService from '../services/bookingService';
import { BOOKING_STATUSES, type BookingResponse, type BookingStatus } from '../types/booking';
import BookingStatusBadge from '../components/BookingStatusBadge';

const UPDATABLE_STATUSES: BookingStatus[] = [...BOOKING_STATUSES];

const formatDateTime = (dt: string) =>
    new Date(dt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

const EmployeeBookingWork: React.FC = () => {
    const { bookingId } = useParams<{ bookingId: string }>();
    const navigate = useNavigate();

    const [booking, setBooking] = useState<BookingResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const fetchBooking = () => {
        if (!bookingId) return;
        setLoading(true);
        setLoadError(null);
        bookingService.getById(bookingId)
            .then(data => setBooking(data))
            .catch(err => {
                const status = err.response?.status;
                if (status === 404) setLoadError('Booking not found.');
                else setLoadError('Failed to load booking. Please try again.');
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchBooking();
    }, [bookingId]);

    const handleStatusChange = async (newStatus: BookingStatus) => {
        if (!booking || !bookingId) return;
        setUpdatingStatus(true);
        setActionError(null);
        setSuccessMessage(null);
        try {
            const updated = await bookingService.updateStatus(bookingId, { status: newStatus });
            setBooking(updated);
            setSuccessMessage(`Status updated to ${newStatus}.`);
        } catch (err: any) {
            const status = err.response?.status;
            if (status === 400) {
                setActionError('Invalid status transition.');
            } else if (status === 404) {
                setActionError('Booking not found.');
            } else {
                setActionError('Failed to update status. Please try again.');
            }
        } finally {
            setUpdatingStatus(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-8">
            <div className="flex items-center mb-6 gap-3">
                <button
                    onClick={() => navigate(-1)}
                    className="text-gray-500 hover:text-gray-700 transition"
                    aria-label="Go back"
                >
                    &#8592;
                </button>
                <h1 className="text-2xl font-bold text-gray-800">Booking Work</h1>
            </div>

            {loading ? (
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-5 bg-gray-100 rounded animate-pulse w-2/3" />
                    ))}
                </div>
            ) : loadError ? (
                <div className="text-center py-12">
                    <p className="text-red-600 mb-4">{loadError}</p>
                    <div className="flex justify-center gap-4">
                        {loadError !== 'Booking not found.' && (
                            <button onClick={fetchBooking} className="text-blue-600 hover:underline text-sm font-medium">
                                Retry
                            </button>
                        )}
                        <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline text-sm">
                            Go Back
                        </button>
                    </div>
                </div>
            ) : booking ? (
                <div className="space-y-4">
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                        <h2 className="text-base font-semibold text-gray-700 mb-4">Booking Details</h2>
                        <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                            <div>
                                <dt className="text-gray-500">Service</dt>
                                <dd className="font-medium text-gray-800">{booking.washServiceName}</dd>
                            </div>
                            <div>
                                <dt className="text-gray-500">Vehicle</dt>
                                <dd className="font-medium text-gray-800">{booking.vehicleLicensePlate}</dd>
                            </div>
                            <div>
                                <dt className="text-gray-500">Customer</dt>
                                <dd className="font-medium text-gray-800">{booking.customerEmail}</dd>
                            </div>
                            <div>
                                <dt className="text-gray-500">Appointment</dt>
                                <dd className="font-medium text-gray-800">{formatDateTime(booking.appointmentDateTime)}</dd>
                            </div>
                            <div>
                                <dt className="text-gray-500">Duration</dt>
                                <dd className="font-medium text-gray-800">{booking.durationMinutes} min</dd>
                            </div>
                            <div>
                                <dt className="text-gray-500">Price</dt>
                                <dd className="font-medium text-gray-800">${Number(booking.totalPrice).toFixed(2)}</dd>
                            </div>
                            {booking.notes && (
                                <div className="col-span-2">
                                    <dt className="text-gray-500">Notes</dt>
                                    <dd className="font-medium text-gray-800 italic">{booking.notes}</dd>
                                </div>
                            )}
                        </dl>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                        <h2 className="text-base font-semibold text-gray-700 mb-4">Update Status</h2>

                        {actionError && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm mb-3">
                                {actionError}
                            </div>
                        )}
                        {successMessage && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-sm mb-3">
                                {successMessage}
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">Current status:</span>
                            <BookingStatusBadge status={booking.status} />
                        </div>

                        {booking.status !== 'CANCELLED' && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {UPDATABLE_STATUSES.filter(s => s !== booking.status && s !== 'CANCELLED').map(s => (
                                    <button
                                        key={s}
                                        onClick={() => handleStatusChange(s)}
                                        disabled={updatingStatus}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {updatingStatus ? 'Updating...' : `Mark as ${s}`}
                                    </button>
                                ))}
                            </div>
                        )}

                        {booking.status === 'CANCELLED' && (
                            <p className="text-sm text-gray-500 mt-3 italic">This booking has been cancelled and cannot be updated.</p>
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default EmployeeBookingWork;

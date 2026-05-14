import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import vehicleService from '../services/vehicleService';
import washServiceService from '../services/washServiceService';
import bookingService from '../services/bookingService';
import type { VehicleResponse } from '../types/vehicle';
import type { WashServiceResponse } from '../types/washService';
import type { BookingRequest } from '../types/booking';
import BookingForm from '../components/BookingForm';

const emptyForm = (): BookingRequest => ({
    vehicleId: '',
    washServiceId: '',
    appointmentDateTime: '',
    notes: '',
});

const BookAppointment: React.FC = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState<BookingRequest>(emptyForm());
    const [vehicles, setVehicles] = useState<VehicleResponse[]>([]);
    const [services, setServices] = useState<WashServiceResponse[]>([]);
    const [loadingVehicles, setLoadingVehicles] = useState(true);
    const [loadingServices, setLoadingServices] = useState(true);
    const [dataError, setDataError] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const loadData = () => {
        setDataError(null);
        setLoadingVehicles(true);
        setLoadingServices(true);

        vehicleService.list()
            .then(setVehicles)
            .catch(() => setDataError('Failed to load your vehicles. Please try again.'))
            .finally(() => setLoadingVehicles(false));

        washServiceService.listActive()
            .then(setServices)
            .catch(() => setDataError(prev => prev ?? 'Failed to load wash services. Please try again.'))
            .finally(() => setLoadingServices(false));
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            const payload: BookingRequest = {
                ...form,
                appointmentDateTime: new Date(form.appointmentDateTime).toISOString().slice(0, 19),
                notes: form.notes || undefined,
            };
            await bookingService.create(payload);
            navigate('/my-bookings');
        } catch (err: any) {
            const status = err.response?.status;
            if (status === 400) {
                setError(err.response?.data?.message || 'Invalid booking data. Please check your input.');
            } else if (status === 403) {
                setError('You do not have permission to book with this vehicle.');
            } else if (status === 404) {
                setError('Vehicle or wash service not found.');
            } else {
                setError('Failed to book appointment. Please try again.');
            }
        } finally {
            setSubmitting(false);
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

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Book Appointment</h1>
                <p className="text-sm text-gray-500 mt-0.5">Schedule a car wash at your convenience</p>
            </div>

            {dataError && (
                <div className="flex items-center justify-between bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                        </svg>
                        <span className="text-sm">{dataError}</span>
                    </div>
                    <button onClick={loadData} className="text-sm font-medium text-red-700 hover:text-red-900 underline">
                        Retry
                    </button>
                </div>
            )}

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                        </svg>
                        <span className="text-sm font-semibold text-gray-700">Appointment Details</span>
                    </div>
                </div>
                <div className="p-6">
                    <BookingForm
                        form={form}
                        vehicles={vehicles}
                        services={services}
                        loadingVehicles={loadingVehicles}
                        loadingServices={loadingServices}
                        error={error}
                        submitting={submitting}
                        onVehicleChange={id => setForm(prev => ({ ...prev, vehicleId: id }))}
                        onServiceChange={id => setForm(prev => ({ ...prev, washServiceId: id }))}
                        onDateTimeChange={value => setForm(prev => ({ ...prev, appointmentDateTime: value }))}
                        onNotesChange={value => setForm(prev => ({ ...prev, notes: value }))}
                        onSubmit={handleSubmit}
                        onCancel={() => navigate('/my-bookings')}
                    />
                </div>
            </div>
        </div>
    );
};

export default BookAppointment;

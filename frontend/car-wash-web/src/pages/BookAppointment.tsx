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
        <div className="max-w-2xl mx-auto p-8">
            <div className="flex items-center mb-6 gap-3">
                <button
                    onClick={() => navigate('/my-bookings')}
                    className="text-gray-500 hover:text-gray-700 transition"
                    aria-label="Back to My Bookings"
                >
                    &#8592;
                </button>
                <h1 className="text-2xl font-bold text-gray-800">Book Appointment</h1>
            </div>

            {dataError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center justify-between">
                    <span>{dataError}</span>
                    <button onClick={loadData} className="ml-4 text-sm font-medium underline hover:no-underline">
                        Retry
                    </button>
                </div>
            )}

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
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
    );
};

export default BookAppointment;

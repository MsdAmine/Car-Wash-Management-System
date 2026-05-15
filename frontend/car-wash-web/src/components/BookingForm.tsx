import React from 'react';
import type { VehicleResponse } from '../types/vehicle';
import type { WashServiceResponse } from '../types/washService';
import type { BookingRequest } from '../types/booking';
import VehicleSelector from './VehicleSelector';
import ServiceSelector from './ServiceSelector';
import DateTimeSelector from './DateTimeSelector';

interface BookingFormProps {
    form: BookingRequest;
    vehicles: VehicleResponse[];
    services: WashServiceResponse[];
    loadingVehicles: boolean;
    loadingServices: boolean;
    error: string | null;
    submitting: boolean;
    onVehicleChange: (id: string) => void;
    onServiceChange: (id: string) => void;
    onDateTimeChange: (value: string) => void;
    onNotesChange: (value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({
    form,
    vehicles,
    services,
    loadingVehicles,
    loadingServices,
    error,
    submitting,
    onVehicleChange,
    onServiceChange,
    onDateTimeChange,
    onNotesChange,
    onSubmit,
    onCancel,
}) => {
    const canSubmit =
        !submitting &&
        form.vehicleId !== '' &&
        form.washServiceId !== '' &&
        form.appointmentDateTime !== '';

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    Select Vehicle <span className="text-red-500">*</span>
                </label>
                <VehicleSelector
                    vehicles={vehicles}
                    selectedId={form.vehicleId}
                    onChange={onVehicleChange}
                    loading={loadingVehicles}
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    Select Wash Service <span className="text-red-500">*</span>
                </label>
                <ServiceSelector
                    services={services}
                    selectedId={form.washServiceId}
                    onChange={onServiceChange}
                    loading={loadingServices}
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    Appointment Date &amp; Time <span className="text-red-500">*</span>
                </label>
                <DateTimeSelector
                    value={form.appointmentDateTime}
                    onChange={onDateTimeChange}
                />
                <p className="mt-1.5 text-xs text-gray-500">
                    Must be at least 30 minutes from now and within the next 90 days.
                </p>
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    Notes <span className="text-gray-400 font-normal">(optional, max 500 chars)</span>
                </label>
                <textarea
                    value={form.notes ?? ''}
                    onChange={e => onNotesChange(e.target.value)}
                    maxLength={500}
                    rows={3}
                    placeholder="Any special instructions or requests..."
                    className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                />
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <button
                    type="submit"
                    disabled={!canSubmit}
                    className="rounded-lg bg-gray-950 px-6 py-2 text-sm font-medium text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {submitting ? 'Booking...' : 'Book Appointment'}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-lg border border-gray-200 bg-white px-6 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default BookingForm;

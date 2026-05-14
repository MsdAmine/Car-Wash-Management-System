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
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Appointment Date &amp; Time <span className="text-red-500">*</span>
                </label>
                <DateTimeSelector
                    value={form.appointmentDateTime}
                    onChange={onDateTimeChange}
                />
                <p className="text-xs text-gray-400 mt-1">
                    Must be at least 30 minutes from now and within the next 90 days.
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes <span className="text-gray-400 font-normal">(optional, max 500 chars)</span>
                </label>
                <textarea
                    value={form.notes ?? ''}
                    onChange={e => onNotesChange(e.target.value)}
                    maxLength={500}
                    rows={3}
                    placeholder="Any special instructions or requests..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                />
            </div>

            <div className="flex gap-3 pt-2">
                <button
                    type="submit"
                    disabled={!canSubmit}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                    {submitting ? 'Booking...' : 'Book Appointment'}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition text-sm font-medium"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default BookingForm;

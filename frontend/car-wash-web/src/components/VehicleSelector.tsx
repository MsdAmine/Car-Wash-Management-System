import React from 'react';
import type { VehicleResponse } from '../types/vehicle';

interface VehicleSelectorProps {
    vehicles: VehicleResponse[];
    selectedId: string;
    onChange: (id: string) => void;
    loading?: boolean;
}

const VehicleSelector: React.FC<VehicleSelectorProps> = ({ vehicles, selectedId, onChange, loading }) => {
    if (loading) {
        return (
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-gray-900" />
                <span className="text-sm text-gray-500">Loading vehicles...</span>
            </div>
        );
    }

    if (vehicles.length === 0) {
        return (
            <p className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-3 text-sm text-gray-500">
                No vehicles registered. Please add a vehicle before booking.
            </p>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {vehicles.map(vehicle => (
                <button
                    key={vehicle.id}
                    type="button"
                    onClick={() => onChange(vehicle.id)}
                    className={`flex min-h-24 flex-col justify-between rounded-lg border px-4 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-gray-900/10 ${
                        selectedId === vehicle.id
                            ? 'border-gray-900 bg-gray-50 shadow-sm'
                            : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                    }`}
                >
                    <span className="font-medium text-gray-900">
                        {vehicle.brand} {vehicle.model}
                    </span>
                    <span className="mt-2 text-sm text-gray-500">
                        {vehicle.licensePlate} / {vehicle.type}
                    </span>
                </button>
            ))}
        </div>
    );
};

export default VehicleSelector;

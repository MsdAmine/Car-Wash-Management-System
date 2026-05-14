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
            <div className="flex items-center gap-2 py-2">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500" />
                <span className="text-sm text-gray-500">Loading vehicles...</span>
            </div>
        );
    }

    if (vehicles.length === 0) {
        return (
            <p className="text-sm text-gray-500 py-2">
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
                    className={`flex flex-col text-left px-4 py-3 border rounded-lg transition ${
                        selectedId === vehicle.id
                            ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-300'
                            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                    }`}
                >
                    <span className="font-medium text-gray-800">
                        {vehicle.brand} {vehicle.model}
                    </span>
                    <span className="text-sm text-gray-500 mt-0.5">
                        {vehicle.licensePlate} &bull; {vehicle.type}
                    </span>
                </button>
            ))}
        </div>
    );
};

export default VehicleSelector;

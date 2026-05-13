import React from 'react';
import type { VehicleRequest, VehicleType } from '../types/vehicle';

const VEHICLE_TYPES: VehicleType[] = ['SEDAN', 'SUV', 'TRUCK', 'VAN', 'MOTORCYCLE', 'COUPE'];

interface VehicleFormProps {
    form: VehicleRequest;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    error: string | null;
    submitting: boolean;
    submitLabel: string;
    submittingLabel: string;
}

const VehicleForm: React.FC<VehicleFormProps> = ({
    form,
    onChange,
    onSubmit,
    onCancel,
    error,
    submitting,
    submitLabel,
    submittingLabel,
}) => {
    return (
        <>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                    <input
                        type="text"
                        name="brand"
                        required
                        value={form.brand}
                        onChange={onChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g. Toyota"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                    <input
                        type="text"
                        name="model"
                        required
                        value={form.model}
                        onChange={onChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g. Corolla"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">License Plate</label>
                    <input
                        type="text"
                        name="licensePlate"
                        required
                        value={form.licensePlate}
                        onChange={onChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g. ABC-1234"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                    <select
                        name="type"
                        value={form.type}
                        onChange={onChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                        {VEHICLE_TYPES.map(t => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 font-medium"
                    >
                        {submitting ? submittingLabel : submitLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 border border-gray-300 py-2 rounded-md hover:bg-gray-50 transition font-medium"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </>
    );
};

export default VehicleForm;

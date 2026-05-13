import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import vehicleService from '../services/vehicleService';
import type { VehicleRequest, VehicleType } from '../types/vehicle';

const VEHICLE_TYPES: VehicleType[] = ['SEDAN', 'SUV', 'TRUCK', 'VAN', 'MOTORCYCLE', 'COUPE'];

const emptyForm = (): VehicleRequest => ({
    brand: '',
    model: '',
    licensePlate: '',
    type: 'SEDAN',
});

const AddVehicle: React.FC = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState<VehicleRequest>(emptyForm());
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            await vehicleService.create(form);
            navigate('/my-vehicles');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to add vehicle. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-8">
            <div className="flex items-center mb-6 gap-3">
                <button
                    onClick={() => navigate('/my-vehicles')}
                    className="text-gray-500 hover:text-gray-700 transition"
                    aria-label="Back to My Vehicles"
                >
                    &#8592;
                </button>
                <h1 className="text-2xl font-bold text-gray-800">Add Vehicle</h1>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                        <input
                            type="text"
                            name="brand"
                            required
                            value={form.brand}
                            onChange={handleChange}
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
                            onChange={handleChange}
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
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g. ABC-1234"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                        <select
                            name="type"
                            value={form.type}
                            onChange={handleChange}
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
                            {submitting ? 'Adding...' : 'Add Vehicle'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/my-vehicles')}
                            className="flex-1 border border-gray-300 py-2 rounded-md hover:bg-gray-50 transition font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddVehicle;

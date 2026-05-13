import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import vehicleService from '../services/vehicleService';
import type { VehicleRequest } from '../types/vehicle';
import VehicleForm from '../components/VehicleForm';

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
                <VehicleForm
                    form={form}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate('/my-vehicles')}
                    error={error}
                    submitting={submitting}
                    submitLabel="Add Vehicle"
                    submittingLabel="Adding..."
                />
            </div>
        </div>
    );
};

export default AddVehicle;

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
            const status = err.response?.status;
            if (status === 409) {
                setError('A vehicle with this license plate already exists.');
            } else if (status === 400) {
                setError(err.response?.data?.message || 'Invalid vehicle data. Please check your input.');
            } else {
                setError(err.response?.data?.message || 'Failed to add vehicle. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 sm:p-8">
            <button
                onClick={() => navigate('/my-vehicles')}
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                Back to My Vehicles
            </button>

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Add Vehicle</h1>
                <p className="text-sm text-gray-500 mt-0.5">Register a new car for wash services</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
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

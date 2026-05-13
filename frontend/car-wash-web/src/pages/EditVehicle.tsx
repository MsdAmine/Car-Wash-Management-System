import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import vehicleService from '../services/vehicleService';
import type { VehicleRequest } from '../types/vehicle';
import VehicleForm from '../components/VehicleForm';

const EditVehicle: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [form, setForm] = useState<VehicleRequest>({ brand: '', model: '', licensePlate: '', type: 'SEDAN' });
    const [loadError, setLoadError] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const loadVehicle = () => {
        if (!id) return;
        setLoading(true);
        setLoadError(null);
        vehicleService.getById(id)
            .then(v => {
                setForm({ brand: v.brand, model: v.model, licensePlate: v.licensePlate, type: v.type });
            })
            .catch(err => {
                const status = err.response?.status;
                if (status === 404) setLoadError('Vehicle not found.');
                else if (status === 403) setLoadError('You do not have permission to edit this vehicle.');
                else setLoadError('Failed to load vehicle. Please try again.');
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadVehicle();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;
        setFormError(null);
        setSubmitting(true);
        try {
            await vehicleService.update(id, form);
            navigate('/my-vehicles');
        } catch (err: any) {
            const status = err.response?.status;
            if (status === 403) {
                setFormError('You do not have permission to edit this vehicle.');
            } else if (status === 409) {
                setFormError('A vehicle with this license plate already exists.');
            } else if (status === 400) {
                setFormError(err.response?.data?.message || 'Invalid vehicle data. Please check your input.');
            } else {
                setFormError(err.response?.data?.message || 'Failed to update vehicle. Please try again.');
            }
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
                <h1 className="text-2xl font-bold text-gray-800">Edit Vehicle</h1>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
                        <p className="ml-3 text-gray-500">Loading vehicle...</p>
                    </div>
                ) : loadError ? (
                    <div className="text-center py-8">
                        <p className="text-red-600 mb-4">{loadError}</p>
                        <div className="flex justify-center gap-4">
                            {loadError === 'Failed to load vehicle. Please try again.' && (
                                <button
                                    onClick={loadVehicle}
                                    className="text-blue-600 hover:underline text-sm font-medium"
                                >
                                    Retry
                                </button>
                            )}
                            <button
                                onClick={() => navigate('/my-vehicles')}
                                className="text-blue-600 hover:underline text-sm"
                            >
                                Back to My Vehicles
                            </button>
                        </div>
                    </div>
                ) : (
                    <VehicleForm
                        form={form}
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                        onCancel={() => navigate('/my-vehicles')}
                        error={formError}
                        submitting={submitting}
                        submitLabel="Save Changes"
                        submittingLabel="Saving..."
                    />
                )}
            </div>
        </div>
    );
};

export default EditVehicle;

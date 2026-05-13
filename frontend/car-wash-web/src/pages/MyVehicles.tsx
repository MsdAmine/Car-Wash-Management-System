import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import vehicleService from '../services/vehicleService';
import type { VehicleRequest, VehicleResponse, VehicleType } from '../types/vehicle';

const VEHICLE_TYPES: VehicleType[] = ['SEDAN', 'SUV', 'TRUCK', 'VAN', 'MOTORCYCLE', 'COUPE'];

const emptyForm = (): VehicleRequest => ({
    brand: '',
    model: '',
    licensePlate: '',
    type: 'SEDAN',
});

const MyVehicles: React.FC = () => {
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState<VehicleResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<VehicleRequest>(emptyForm());
    const [formError, setFormError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchVehicles = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await vehicleService.list();
            setVehicles(data);
        } catch {
            setError('Failed to load vehicles. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    const openEdit = (v: VehicleResponse) => {
        setEditingId(v.id);
        setForm({ brand: v.brand, model: v.model, licensePlate: v.licensePlate, type: v.type });
        setFormError(null);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingId(null);
        setForm(emptyForm());
        setFormError(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        setSubmitting(true);
        try {
            if (editingId) {
                await vehicleService.update(editingId, form);
            } else {
                await vehicleService.create(form);
            }
            closeModal();
            await fetchVehicles();
        } catch (err: any) {
            const msg = err.response?.data?.message || (editingId ? 'Failed to update vehicle.' : 'Failed to add vehicle.');
            setFormError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        try {
            await vehicleService.remove(id);
            setVehicles(prev => prev.filter(v => v.id !== id));
        } catch {
            setError('Failed to delete vehicle. Please try again.');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">My Vehicles</h1>
                <button
                    onClick={() => navigate('/add-vehicle')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm font-medium"
                >
                    + Add Vehicle
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" />
                    <p className="ml-3 text-gray-500">Loading vehicles...</p>
                </div>
            ) : vehicles.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                    <p className="text-lg">You have no vehicles registered.</p>
                    <p className="text-sm mt-1">Click <strong>+ Add Vehicle</strong> to get started.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {vehicles.map(v => (
                        <div key={v.id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 flex justify-between items-center">
                            <div>
                                <p className="text-lg font-semibold text-gray-800">{v.brand} {v.model}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    <span className="mr-3">Plate: <strong>{v.licensePlate}</strong></span>
                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">{v.type}</span>
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => openEdit(v)}
                                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(v.id)}
                                    disabled={deletingId === v.id}
                                    className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition disabled:opacity-50"
                                >
                                    {deletingId === v.id ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            {editingId ? 'Edit Vehicle' : 'Add Vehicle'}
                        </h2>

                        {formError && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4 text-sm">
                                {formError}
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
                                    {submitting ? 'Saving...' : editingId ? 'Save Changes' : 'Add Vehicle'}
                                </button>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 border border-gray-300 py-2 rounded-md hover:bg-gray-50 transition font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyVehicles;

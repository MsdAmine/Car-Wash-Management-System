import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import vehicleService from '../services/vehicleService';
import type { VehicleResponse } from '../types/vehicle';
import ConfirmationDialog from '../components/ConfirmationDialog';

const vehicleTypeLabel: Record<string, string> = {
    SEDAN: 'Sedan',
    SUV: 'SUV',
    TRUCK: 'Truck',
    VAN: 'Van',
    MOTORCYCLE: 'Motorcycle',
    COUPE: 'Coupe',
};

const VehicleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
    </svg>
);

const MyVehicles: React.FC = () => {
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState<VehicleResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

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

    const handleDeleteConfirm = async () => {
        if (!pendingDeleteId) return;
        const id = pendingDeleteId;
        setPendingDeleteId(null);
        setDeletingId(id);
        setDeleteError(null);
        try {
            await vehicleService.remove(id);
            setVehicles(prev => prev.filter(v => v.id !== id));
        } catch (err: any) {
            const status = err.response?.status;
            if (status === 403) {
                setDeleteError('You do not have permission to delete this vehicle.');
            } else if (status === 404) {
                setDeleteError('Vehicle not found. It may have already been deleted.');
                setVehicles(prev => prev.filter(v => v.id !== id));
            } else {
                setDeleteError('Failed to delete vehicle. Please try again.');
            }
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-950">My Vehicles</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage your registered cars</p>
                </div>
                <button
                    onClick={() => navigate('/add-vehicle')}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-950 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add Vehicle
                </button>
            </div>

            {error && (
                <div className="mb-5 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                        </svg>
                        <span className="text-sm">{error}</span>
                    </div>
                    <button
                        onClick={fetchVehicles}
                        className="text-sm font-medium text-red-700 hover:text-red-900 underline"
                    >
                        Retry
                    </button>
                </div>
            )}

            {deleteError && (
                <div className="mb-5 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg>
                    <span className="text-sm">{deleteError}</span>
                </div>
            )}

            {loading ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-36 animate-pulse rounded-xl border border-gray-200 bg-white" />
                    ))}
                </div>
            ) : vehicles.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 bg-white py-20 text-center shadow-sm">
                    <VehicleIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-600 font-medium">No vehicles registered</p>
                    <p className="text-sm text-gray-400 mt-1 mb-4">Add your first vehicle to start booking washes.</p>
                    <button
                        onClick={() => navigate('/add-vehicle')}
                        className="inline-flex items-center gap-2 rounded-lg bg-gray-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add Vehicle
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {vehicles.map(vehicle => (
                        <div
                            key={vehicle.id}
                            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-300"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
                                        <VehicleIcon className="h-5 w-5 text-gray-700" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-950">
                                            {vehicle.brand} {vehicle.model}
                                        </p>
                                        <p className="mt-0.5 text-xs text-gray-500">
                                            {vehicleTypeLabel[vehicle.type] ?? vehicle.type}
                                        </p>
                                    </div>
                                </div>
                                <span className="rounded-md bg-gray-100 px-2 py-1 font-mono text-xs text-gray-700">
                                    {vehicle.licensePlate}
                                </span>
                            </div>
                            <div className="mt-4 flex items-center gap-3 border-t border-gray-100 pt-4">
                                <button
                                    onClick={() => navigate(`/vehicles/${vehicle.id}/edit`)}
                                    className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-950"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>
                                    Edit
                                </button>
                                <button
                                    onClick={() => setPendingDeleteId(vehicle.id)}
                                    disabled={deletingId === vehicle.id}
                                    className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {deletingId === vehicle.id ? (
                                        <>
                                            <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                            Delete
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ConfirmationDialog
                open={pendingDeleteId !== null}
                title="Delete Vehicle"
                message="Are you sure you want to delete this vehicle? This action cannot be undone."
                confirmLabel="Delete"
                cancelLabel="Cancel"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setPendingDeleteId(null)}
                variant="danger"
            />
        </div>
    );
};

export default MyVehicles;

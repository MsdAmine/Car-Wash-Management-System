import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import vehicleService from '../services/vehicleService';
import type { VehicleResponse } from '../types/vehicle';
import VehicleTable from '../components/VehicleTable';

const MyVehicles: React.FC = () => {
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState<VehicleResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                <VehicleTable
                    vehicles={vehicles}
                    onEdit={id => navigate(`/vehicles/${id}/edit`)}
                />
            )}
        </div>
    );
};

export default MyVehicles;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import washServiceService from '../services/washServiceService';
import type { WashServiceResponse } from '../types/washService';
import WashServiceTable from '../components/WashServiceTable';
import ConfirmDialog from '../components/ConfirmDialog';
import { ServiceTableSkeleton } from '../components/WashServiceSkeletons';

const AdminServices: React.FC = () => {
    const navigate = useNavigate();
    const [services, setServices] = useState<WashServiceResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deactivatingId, setDeactivatingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

    const fetchServices = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await washServiceService.listAll();
            setServices(data);
        } catch {
            setError('Failed to load services. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleDeactivate = async (id: string) => {
        setDeactivatingId(id);
        setActionError(null);
        try {
            const updated = await washServiceService.deactivate(id);
            setServices(prev => prev.map(s => s.id === id ? updated : s));
        } catch (err: any) {
            const status = err.response?.status;
            if (status === 404) {
                setActionError('Service not found.');
            } else if (status === 403) {
                setActionError('You do not have permission to deactivate this service.');
            } else {
                setActionError('Failed to deactivate service. Please try again.');
            }
        } finally {
            setDeactivatingId(null);
        }
    };

    const handleDeleteRequest = (id: string) => {
        setPendingDeleteId(id);
    };

    const handleDeleteConfirm = async () => {
        if (!pendingDeleteId) return;
        const id = pendingDeleteId;
        setPendingDeleteId(null);
        setDeletingId(id);
        setActionError(null);
        try {
            await washServiceService.remove(id);
            setServices(prev => prev.filter(s => s.id !== id));
        } catch (err: any) {
            const status = err.response?.status;
            if (status === 403) {
                setActionError('You do not have permission to delete this service.');
            } else if (status === 404) {
                setActionError('Service not found. It may have already been deleted.');
                setServices(prev => prev.filter(s => s.id !== id));
            } else {
                setActionError('Failed to delete service. Please try again.');
            }
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manage Wash Services</h1>
                <button
                    onClick={() => navigate('/admin/services/add')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm font-medium"
                >
                    + Add Service
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center justify-between">
                    <span>{error}</span>
                    <button
                        onClick={fetchServices}
                        className="ml-4 text-sm font-medium underline hover:no-underline"
                    >
                        Retry
                    </button>
                </div>
            )}

            {actionError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {actionError}
                </div>
            )}

            {loading ? (
                <ServiceTableSkeleton rows={5} />
            ) : services.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                    <p className="text-lg">No wash services found.</p>
                    <p className="text-sm mt-1">Click <strong>+ Add Service</strong> to create one.</p>
                </div>
            ) : (
                <WashServiceTable
                    services={services}
                    onEdit={id => navigate(`/admin/services/${id}/edit`)}
                    onDeactivate={handleDeactivate}
                    onDelete={handleDeleteRequest}
                    deactivatingId={deactivatingId}
                    deletingId={deletingId}
                    canManage
                />
            )}

            <ConfirmDialog
                open={pendingDeleteId !== null}
                title="Delete Wash Service"
                message="Are you sure you want to permanently delete this service? This action cannot be undone."
                confirmLabel="Delete"
                cancelLabel="Cancel"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setPendingDeleteId(null)}
            />
        </div>
    );
};

export default AdminServices;

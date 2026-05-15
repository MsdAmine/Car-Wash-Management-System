import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import washServiceService from '../services/washServiceService';
import type { WashServiceResponse } from '../types/washService';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { ServiceTableSkeleton } from '../components/WashServiceSkeletons';

type ApiError = {
    response?: {
        status?: number;
    };
};

const AdminServices: React.FC = () => {
    const navigate = useNavigate();
    const [services, setServices] = useState<WashServiceResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deactivatingId, setDeactivatingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

    const fetchServices = useCallback(async () => {
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
    }, []);

    useEffect(() => {
        void Promise.resolve().then(fetchServices);
    }, [fetchServices]);

    const handleDeactivate = async (id: string) => {
        setDeactivatingId(id);
        setActionError(null);
        try {
            const updated = await washServiceService.deactivate(id);
            setServices(prev => prev.map(s => s.id === id ? updated : s));
        } catch (err) {
            const apiError = err as ApiError;
            const status = apiError.response?.status;
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
        } catch (err) {
            const apiError = err as ApiError;
            const status = apiError.response?.status;
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
        <div className="max-w-6xl mx-auto p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Manage Wash Services</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Create, edit, and manage your wash packages</p>
                </div>
                <button
                    onClick={() => navigate('/admin/services/add')}
                    className="inline-flex items-center gap-2 bg-gray-950 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition text-sm font-medium shadow-sm"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add Service
                </button>
            </div>

            {error && (
                <div className="flex items-center justify-between bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                        </svg>
                        <span className="text-sm">{error}</span>
                    </div>
                    <button
                        onClick={fetchServices}
                        className="text-sm font-medium text-red-700 hover:text-red-900 underline"
                    >
                        Retry
                    </button>
                </div>
            )}

            {actionError && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5">
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg>
                    <span className="text-sm">{actionError}</span>
                </div>
            )}

            {loading ? (
                <ServiceTableSkeleton rows={5} />
            ) : services.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                    </svg>
                    <p className="text-gray-500 font-medium">No wash services found</p>
                    <p className="text-sm text-gray-400 mt-1 mb-4">Add a service to get started.</p>
                    <button
                        onClick={() => navigate('/admin/services/add')}
                        className="inline-flex items-center gap-2 bg-gray-950 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition text-sm font-medium"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add Service
                    </button>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">Service</th>
                                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">Description</th>
                                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">Price</th>
                                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">Duration</th>
                                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">Status</th>
                                <th className="text-right px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {services.map(service => (
                                <tr key={service.id} className="hover:bg-gray-50 transition">
                                    <td className="px-5 py-4">
                                        <p className="font-semibold text-gray-800">{service.name}</p>
                                    </td>
                                    <td className="px-5 py-4 text-gray-500 max-w-xs">
                                        <p className="truncate">{service.description || '—'}</p>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="font-semibold text-gray-800">${Number(service.price).toFixed(2)}</span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                            </svg>
                                            {service.durationMinutes} min
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                            service.active
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-500'
                                        }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${service.active ? 'bg-green-500' : 'bg-gray-400'}`} />
                                            {service.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-end gap-3">
                                            <button
                                                onClick={() => navigate(`/admin/services/${service.id}/edit`)}
                                                className="text-sm text-gray-700 hover:text-gray-950 font-medium"
                                            >
                                                Edit
                                            </button>
                                            {service.active && (
                                                <button
                                                    onClick={() => handleDeactivate(service.id)}
                                                    disabled={deactivatingId === service.id}
                                                    className="text-sm text-yellow-600 hover:text-yellow-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {deactivatingId === service.id ? 'Deactivating...' : 'Deactivate'}
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDeleteRequest(service.id)}
                                                disabled={deletingId === service.id}
                                                className="text-sm text-red-600 hover:text-red-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {deletingId === service.id ? 'Deleting...' : 'Delete'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <ConfirmationDialog
                open={pendingDeleteId !== null}
                title="Delete Wash Service"
                message="Are you sure you want to permanently delete this service? This action cannot be undone."
                confirmLabel="Delete"
                cancelLabel="Cancel"
                variant="danger"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setPendingDeleteId(null)}
            />
        </div>
    );
};

export default AdminServices;

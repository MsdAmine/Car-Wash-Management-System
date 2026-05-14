import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import washServiceService from '../services/washServiceService';
import type { WashServiceRequest } from '../types/washService';
import WashServiceForm from '../components/WashServiceForm';

const EditWashService: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [form, setForm] = useState<WashServiceRequest>({
        name: '',
        description: '',
        price: 0,
        durationMinutes: 0,
        active: true,
    });
    const [loadError, setLoadError] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const loadService = () => {
        if (!id) return;
        setLoading(true);
        setLoadError(null);
        washServiceService.getById(id)
            .then(s => {
                setForm({
                    name: s.name,
                    description: s.description ?? '',
                    price: s.price,
                    durationMinutes: s.durationMinutes,
                    active: s.active,
                });
            })
            .catch(err => {
                const status = err.response?.status;
                if (status === 404) setLoadError('Wash service not found.');
                else setLoadError('Failed to load service. Please try again.');
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadService();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setForm(prev => ({ ...prev, [name]: checked }));
        } else if (name === 'price') {
            setForm(prev => ({ ...prev, price: parseFloat(value) || 0 }));
        } else if (name === 'durationMinutes') {
            setForm(prev => ({ ...prev, durationMinutes: parseInt(value, 10) || 0 }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;
        setFormError(null);
        setSubmitting(true);
        try {
            await washServiceService.update(id, form);
            navigate('/admin/services');
        } catch (err: any) {
            const status = err.response?.status;
            if (status === 403) {
                setFormError('You do not have permission to edit this service.');
            } else if (status === 409) {
                setFormError('A wash service with this name already exists.');
            } else if (status === 400) {
                setFormError(err.response?.data?.message || 'Invalid service data. Please check your input.');
            } else if (status === 404) {
                setFormError('Wash service not found.');
            } else {
                setFormError(err.response?.data?.message || 'Failed to update service. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 sm:p-8">
            <button
                onClick={() => navigate('/admin/services')}
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                Back to Manage Services
            </button>

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Edit Wash Service</h1>
                <p className="text-sm text-gray-500 mt-0.5">Update the service details below</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
                        <p className="ml-3 text-gray-500">Loading service...</p>
                    </div>
                ) : loadError ? (
                    <div className="text-center py-8">
                        <p className="text-red-600 mb-4">{loadError}</p>
                        <div className="flex justify-center gap-4">
                            {loadError === 'Failed to load service. Please try again.' && (
                                <button
                                    onClick={loadService}
                                    className="text-blue-600 hover:underline text-sm font-medium"
                                >
                                    Retry
                                </button>
                            )}
                            <button
                                onClick={() => navigate('/admin/services')}
                                className="text-blue-600 hover:underline text-sm"
                            >
                                Back to Manage Services
                            </button>
                        </div>
                    </div>
                ) : (
                    <WashServiceForm
                        form={form}
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                        onCancel={() => navigate('/admin/services')}
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

export default EditWashService;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import washServiceService from '../services/washServiceService';
import type { WashServiceRequest } from '../types/washService';
import WashServiceForm from '../components/WashServiceForm';

const emptyForm = (): WashServiceRequest => ({
    name: '',
    description: '',
    price: 0,
    durationMinutes: 0,
    active: true,
});

const AddWashService: React.FC = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState<WashServiceRequest>(emptyForm());
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

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
        setError(null);
        setSubmitting(true);
        try {
            await washServiceService.create(form);
            navigate('/admin/services');
        } catch (err: any) {
            const status = err.response?.status;
            if (status === 409) {
                setError('A wash service with this name already exists.');
            } else if (status === 400) {
                setError(err.response?.data?.message || 'Invalid service data. Please check your input.');
            } else {
                setError(err.response?.data?.message || 'Failed to add service. Please try again.');
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
                <h1 className="text-2xl font-bold text-gray-800">Add Wash Service</h1>
                <p className="text-sm text-gray-500 mt-0.5">Create a new car wash package</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                <WashServiceForm
                    form={form}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate('/admin/services')}
                    error={error}
                    submitting={submitting}
                    submitLabel="Add Service"
                    submittingLabel="Adding..."
                />
            </div>
        </div>
    );
};

export default AddWashService;

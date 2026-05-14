import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import employeeService from '../services/employeeService';
import type { EmployeePosition, UpdateEmployeeRequest } from '../types/employee';
import EmployeeForm from '../components/EmployeeForm';

const EditEmployee: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [form, setForm] = useState<{ position: EmployeePosition | ''; hireDate: string }>({
        position: '',
        hireDate: '',
    });
    const [loadError, setLoadError] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const loadEmployee = () => {
        if (!id) return;
        setLoading(true);
        setLoadError(null);
        employeeService.getById(id)
            .then(emp => {
                setForm({
                    position: emp.position,
                    hireDate: emp.hireDate,
                });
            })
            .catch(err => {
                const status = err.response?.status;
                if (status === 404) setLoadError('Employee not found.');
                else setLoadError('Failed to load employee. Please try again.');
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadEmployee();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id || form.position === '') return;
        setFormError(null);
        setSubmitting(true);
        try {
            const request: UpdateEmployeeRequest = {
                position: form.position as EmployeePosition,
                hireDate: form.hireDate,
            };
            await employeeService.update(id, request);
            navigate('/admin/employees');
        } catch (err: any) {
            const status = err.response?.status;
            if (status === 404) {
                setFormError('Employee not found or is inactive.');
            } else if (status === 400) {
                setFormError(err.response?.data?.message || 'Invalid input. Please check the form fields.');
            } else {
                setFormError('Failed to update employee. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 sm:p-8">
            <button
                onClick={() => navigate('/admin/employees')}
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                Back to Manage Employees
            </button>

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Edit Employee</h1>
                <p className="text-sm text-gray-500 mt-0.5">Update the employee's position and hire date</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
                        <p className="ml-3 text-gray-500">Loading employee...</p>
                    </div>
                ) : loadError ? (
                    <div className="text-center py-8">
                        <p className="text-red-600 mb-4">{loadError}</p>
                        <div className="flex justify-center gap-4">
                            {loadError !== 'Employee not found.' && (
                                <button
                                    onClick={loadEmployee}
                                    className="text-blue-600 hover:underline text-sm font-medium"
                                >
                                    Retry
                                </button>
                            )}
                            <button
                                onClick={() => navigate('/admin/employees')}
                                className="text-blue-600 hover:underline text-sm"
                            >
                                Back to Manage Employees
                            </button>
                        </div>
                    </div>
                ) : (
                    <EmployeeForm
                        form={form}
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                        onCancel={() => navigate('/admin/employees')}
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

export default EditEmployee;

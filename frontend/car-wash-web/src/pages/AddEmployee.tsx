import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import employeeService from '../services/employeeService';
import type { CreateEmployeeRequest, EmployeePosition } from '../types/employee';
import EmployeeForm from '../components/EmployeeForm';

const AddEmployee: React.FC = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState<{ userId: number | ''; position: EmployeePosition | ''; hireDate: string }>({
        userId: '',
        position: '',
        hireDate: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'userId') {
            setForm(prev => ({ ...prev, userId: value === '' ? '' : parseInt(value, 10) }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.userId === '' || form.position === '') return;
        setError(null);
        setSubmitting(true);
        try {
            const request: CreateEmployeeRequest = {
                userId: form.userId as number,
                position: form.position as EmployeePosition,
                hireDate: form.hireDate,
            };
            await employeeService.create(request);
            navigate('/admin/employees');
        } catch (err: any) {
            const status = err.response?.status;
            if (status === 404) {
                setError('No user account found with this ID.');
            } else if (status === 409) {
                setError('This user already has an employee profile.');
            } else if (status === 400) {
                setError(err.response?.data?.message || 'Invalid input. Please check the form fields.');
            } else {
                setError('Failed to create employee. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-8">
            <div className="flex items-center mb-6 gap-3">
                <button
                    onClick={() => navigate('/admin/employees')}
                    className="text-gray-500 hover:text-gray-700 transition"
                    aria-label="Back to Manage Employees"
                >
                    &#8592;
                </button>
                <h1 className="text-2xl font-bold text-gray-800">Add Employee</h1>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <EmployeeForm
                    form={form}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate('/admin/employees')}
                    error={error}
                    submitting={submitting}
                    submitLabel="Add Employee"
                    submittingLabel="Adding..."
                    showUserId
                />
            </div>
        </div>
    );
};

export default AddEmployee;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import employeeService from '../services/employeeService';
import type { EmployeeResponse } from '../types/employee';
import EmployeeTable from '../components/EmployeeTable';

const AdminEmployees: React.FC = () => {
    const [employees, setEmployees] = useState<EmployeeResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deactivatingId, setDeactivatingId] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);
    const [showInactive, setShowInactive] = useState(false);

    const fetchEmployees = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await employeeService.list();
            setEmployees(data);
        } catch {
            setError('Failed to load employees. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleDeactivate = async (id: string, name: string) => {
        if (!window.confirm(`Deactivate ${name}? They will no longer be assigned to new bookings.`)) return;
        setDeactivatingId(id);
        setActionError(null);
        try {
            await employeeService.deactivate(id);
            setEmployees(prev => prev.map(e => e.id === id ? { ...e, active: false } : e));
        } catch (err: any) {
            const status = err.response?.status;
            if (status === 404) {
                setActionError('Employee not found.');
            } else {
                setActionError('Failed to deactivate employee. Please try again.');
            }
        } finally {
            setDeactivatingId(null);
        }
    };

    const displayed = showInactive ? employees : employees.filter(e => e.active);

    return (
        <div className="max-w-6xl mx-auto p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manage Employees</h1>
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={showInactive}
                            onChange={e => setShowInactive(e.target.checked)}
                            className="rounded border-gray-300"
                        />
                        Show inactive
                    </label>
                    <Link
                        to="/admin/employees/add"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
                    >
                        + Add Employee
                    </Link>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center justify-between">
                    <span>{error}</span>
                    <button onClick={fetchEmployees} className="ml-4 text-sm font-medium underline hover:no-underline">
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
                <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <EmployeeTable
                        employees={displayed}
                        onDeactivate={handleDeactivate}
                        deactivatingId={deactivatingId}
                    />
                </div>
            )}
        </div>
    );
};

export default AdminEmployees;

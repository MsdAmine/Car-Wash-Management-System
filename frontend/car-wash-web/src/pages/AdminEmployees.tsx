import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import employeeService from '../services/employeeService';
import type { EmployeeResponse } from '../types/employee';
import ConfirmationDialog from '../components/ConfirmationDialog';

const getInitials = (first: string, last: string) =>
    `${first[0] ?? ''}${last[0] ?? ''}`.toUpperCase();

const AdminEmployees: React.FC = () => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState<EmployeeResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deactivatingId, setDeactivatingId] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);
    const [showInactive, setShowInactive] = useState(false);
    const [pendingDeactivate, setPendingDeactivate] = useState<{ id: string; name: string } | null>(null);

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

    const handleDeactivateConfirm = async () => {
        if (!pendingDeactivate) return;
        const { id } = pendingDeactivate;
        setPendingDeactivate(null);
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
    const activeCount = employees.filter(e => e.active).length;
    const inactiveCount = employees.length - activeCount;

    return (
        <div className="max-w-6xl mx-auto p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Manage Employees</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {activeCount} active{inactiveCount > 0 ? `, ${inactiveCount} inactive` : ''}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={showInactive}
                            onChange={e => setShowInactive(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        Show inactive
                    </label>
                    <Link
                        to="/admin/employees/add"
                        className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition shadow-sm"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add Employee
                    </Link>
                </div>
            </div>

            {error && (
                <div className="flex items-center justify-between bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                        </svg>
                        <span className="text-sm">{error}</span>
                    </div>
                    <button onClick={fetchEmployees} className="text-sm font-medium text-red-700 hover:text-red-900 underline">
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
                <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : displayed.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                    </svg>
                    <p className="text-gray-500 font-medium">No employees found</p>
                    {!showInactive && inactiveCount > 0 && (
                        <p className="text-sm text-gray-400 mt-1">
                            <button
                                onClick={() => setShowInactive(true)}
                                className="text-blue-600 hover:underline"
                            >
                                Show {inactiveCount} inactive employee{inactiveCount !== 1 ? 's' : ''}
                            </button>
                        </p>
                    )}
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">Employee</th>
                                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">Position</th>
                                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">Hire Date</th>
                                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">Status</th>
                                <th className="text-right px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {displayed.map(emp => (
                                <tr key={emp.id} className="hover:bg-gray-50 transition">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                                                {getInitials(emp.firstName, emp.lastName)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">{emp.firstName} {emp.lastName}</p>
                                                <p className="text-xs text-gray-400">{emp.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-gray-600">{emp.position}</td>
                                    <td className="px-5 py-4 text-gray-600 text-xs">
                                        {new Date(emp.hireDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                            emp.active
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-500'
                                        }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${emp.active ? 'bg-green-500' : 'bg-gray-400'}`} />
                                            {emp.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-end gap-3">
                                            <button
                                                onClick={() => navigate(`/admin/employees/${emp.id}/edit`)}
                                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                            >
                                                Edit
                                            </button>
                                            {emp.active && (
                                                <button
                                                    onClick={() => setPendingDeactivate({ id: emp.id, name: `${emp.firstName} ${emp.lastName}` })}
                                                    disabled={deactivatingId === emp.id}
                                                    className="text-sm text-yellow-600 hover:text-yellow-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {deactivatingId === emp.id ? 'Deactivating...' : 'Deactivate'}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <ConfirmationDialog
                open={pendingDeactivate !== null}
                title="Deactivate Employee"
                message={`Deactivate ${pendingDeactivate?.name ?? 'this employee'}? They will no longer be assigned to new bookings.`}
                confirmLabel="Deactivate"
                cancelLabel="Cancel"
                variant="warning"
                onConfirm={handleDeactivateConfirm}
                onCancel={() => setPendingDeactivate(null)}
            />
        </div>
    );
};

export default AdminEmployees;

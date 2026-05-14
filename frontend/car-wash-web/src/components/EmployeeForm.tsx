import React from 'react';
import type { EmployeePosition } from '../types/employee';

const POSITIONS: EmployeePosition[] = ['WASHER', 'SUPERVISOR', 'CASHIER', 'MANAGER', 'RECEPTIONIST'];

interface EmployeeFormData {
    userId?: number | '';
    position: EmployeePosition | '';
    hireDate: string;
}

interface EmployeeFormProps {
    form: EmployeeFormData;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    error: string | null;
    submitting: boolean;
    submitLabel: string;
    submittingLabel: string;
    showUserId?: boolean;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
    form,
    onChange,
    onSubmit,
    onCancel,
    error,
    submitting,
    submitLabel,
    submittingLabel,
    showUserId = false,
}) => {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
                    {error}
                </div>
            )}

            {showUserId && (
                <div>
                    <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
                        User ID <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="userId"
                        name="userId"
                        type="number"
                        min="1"
                        value={form.userId ?? ''}
                        onChange={onChange}
                        required
                        placeholder="Enter user account ID"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">The numeric ID of the existing user account to link.</p>
                </div>
            )}

            <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                    Position <span className="text-red-500">*</span>
                </label>
                <select
                    id="position"
                    name="position"
                    value={form.position}
                    onChange={onChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Select a position</option>
                    {POSITIONS.map(p => (
                        <option key={p} value={p}>{p}</option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="hireDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Hire Date <span className="text-red-500">*</span>
                </label>
                <input
                    id="hireDate"
                    name="hireDate"
                    type="date"
                    value={form.hireDate}
                    onChange={onChange}
                    required
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="flex gap-3 pt-2">
                <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitting ? submittingLabel : submitLabel}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={submitting}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default EmployeeForm;

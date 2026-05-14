import React, { useState } from 'react';
import type { EmployeePosition } from '../types/employee';

const POSITIONS: EmployeePosition[] = ['WASHER', 'SUPERVISOR', 'CASHIER', 'MANAGER', 'RECEPTIONIST'];

interface EmployeeFormData {
    userId?: number | '';
    position: EmployeePosition | '';
    hireDate: string;
}

type FieldErrors = { userId?: string; position?: string; hireDate?: string };

function validate(form: EmployeeFormData, showUserId: boolean): FieldErrors {
    const errors: FieldErrors = {};
    if (showUserId && (!form.userId || Number(form.userId) < 1)) {
        errors.userId = 'A valid user ID is required.';
    }
    if (!form.position) errors.position = 'Please select a position.';
    if (!form.hireDate) errors.hireDate = 'Hire date is required.';
    else if (new Date(form.hireDate) > new Date()) errors.hireDate = 'Hire date cannot be in the future.';
    return errors;
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
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        const name = e.target.name;
        setTouched(prev => ({ ...prev, [name]: true }));
        setFieldErrors(validate(form, showUserId));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const errors = validate(form, showUserId);
        if (Object.values(errors).some(Boolean)) {
            setFieldErrors(errors);
            setTouched({ userId: true, position: true, hireDate: true });
            return;
        }
        setFieldErrors({});
        onSubmit(e);
    };

    const inputClass = (name: keyof FieldErrors) =>
        `w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 transition ${
            touched[name] && fieldErrors[name]
                ? 'border-red-400 focus:ring-red-300'
                : 'border-gray-300 focus:ring-blue-500'
        }`;

    return (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {error && (
                <div
                    role="alert"
                    className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
                >
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg>
                    {error}
                </div>
            )}

            {showUserId && (
                <div>
                    <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
                        User ID <span className="text-red-500" aria-hidden="true">*</span>
                    </label>
                    <input
                        id="userId"
                        name="userId"
                        type="number"
                        min="1"
                        value={form.userId ?? ''}
                        onChange={onChange}
                        onBlur={handleBlur}
                        aria-required="true"
                        aria-invalid={touched.userId && !!fieldErrors.userId}
                        aria-describedby={fieldErrors.userId ? 'userId-error' : 'userId-hint'}
                        className={inputClass('userId')}
                        placeholder="Enter user account ID"
                    />
                    {touched.userId && fieldErrors.userId ? (
                        <p id="userId-error" className="mt-1 text-xs text-red-600" role="alert">{fieldErrors.userId}</p>
                    ) : (
                        <p id="userId-hint" className="mt-1 text-xs text-gray-500">The numeric ID of the existing user account to link.</p>
                    )}
                </div>
            )}

            <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                    Position <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <select
                    id="position"
                    name="position"
                    value={form.position}
                    onChange={onChange}
                    onBlur={handleBlur}
                    aria-required="true"
                    aria-invalid={touched.position && !!fieldErrors.position}
                    aria-describedby={fieldErrors.position ? 'position-error' : undefined}
                    className={inputClass('position')}
                >
                    <option value="">Select a position</option>
                    {POSITIONS.map(p => (
                        <option key={p} value={p}>{p.charAt(0) + p.slice(1).toLowerCase()}</option>
                    ))}
                </select>
                {touched.position && fieldErrors.position && (
                    <p id="position-error" className="mt-1 text-xs text-red-600" role="alert">{fieldErrors.position}</p>
                )}
            </div>

            <div>
                <label htmlFor="hireDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Hire Date <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <input
                    id="hireDate"
                    name="hireDate"
                    type="date"
                    value={form.hireDate}
                    onChange={onChange}
                    onBlur={handleBlur}
                    max={new Date().toISOString().split('T')[0]}
                    aria-required="true"
                    aria-invalid={touched.hireDate && !!fieldErrors.hireDate}
                    aria-describedby={fieldErrors.hireDate ? 'hireDate-error' : 'hireDate-hint'}
                    className={inputClass('hireDate')}
                />
                {touched.hireDate && fieldErrors.hireDate ? (
                    <p id="hireDate-error" className="mt-1 text-xs text-red-600" role="alert">{fieldErrors.hireDate}</p>
                ) : (
                    <p id="hireDate-hint" className="mt-1 text-xs text-gray-500">Cannot be a future date.</p>
                )}
            </div>

            <div className="flex gap-3 pt-2">
                <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                >
                    {submitting ? submittingLabel : submitLabel}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={submitting}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default EmployeeForm;

import React, { useState } from 'react';
import type { WashServiceRequest } from '../types/washService';

type FieldErrors = { name?: string; price?: string; durationMinutes?: string };

function validate(form: WashServiceRequest): FieldErrors {
    const errors: FieldErrors = {};
    if (!form.name.trim()) errors.name = 'Service name is required.';
    else if (form.name.trim().length < 2) errors.name = 'Service name must be at least 2 characters.';
    else if (form.name.trim().length > 100) errors.name = 'Service name cannot exceed 100 characters.';
    if (!form.price || form.price <= 0) errors.price = 'Price must be greater than $0.00.';
    if (!form.durationMinutes || form.durationMinutes < 1) errors.durationMinutes = 'Duration must be at least 1 minute.';
    else if (form.durationMinutes > 480) errors.durationMinutes = 'Duration cannot exceed 480 minutes.';
    return errors;
}

interface WashServiceFormProps {
    form: WashServiceRequest;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    error: string | null;
    submitting: boolean;
    submitLabel: string;
    submittingLabel: string;
}

const WashServiceForm: React.FC<WashServiceFormProps> = ({
    form,
    onChange,
    onSubmit,
    onCancel,
    error,
    submitting,
    submitLabel,
    submittingLabel,
}) => {
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const name = e.target.name;
        setTouched(prev => ({ ...prev, [name]: true }));
        setFieldErrors(validate(form));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const errors = validate(form);
        if (Object.values(errors).some(Boolean)) {
            setFieldErrors(errors);
            setTouched({ name: true, price: true, durationMinutes: true });
            return;
        }
        setFieldErrors({});
        onSubmit(e);
    };

    const inputClass = (name: keyof FieldErrors) =>
        `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition ${
            touched[name] && fieldErrors[name]
                ? 'border-red-400 focus:ring-red-300'
                : 'border-gray-300 focus:ring-gray-900 focus:border-gray-900'
        }`;

    return (
        <>
            {error && (
                <div
                    role="alert"
                    className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm"
                >
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Service Name <span className="text-red-500" aria-hidden="true">*</span>
                    </label>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={onChange}
                        onBlur={handleBlur}
                        aria-required="true"
                        aria-invalid={touched.name && !!fieldErrors.name}
                        aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                        className={inputClass('name')}
                        placeholder="e.g. Basic Wash"
                    />
                    {touched.name && fieldErrors.name && (
                        <p id="name-error" className="mt-1 text-xs text-red-600" role="alert">{fieldErrors.name}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        maxLength={500}
                        value={form.description ?? ''}
                        onChange={onChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 resize-none"
                        placeholder="Optional description of the service"
                    />
                </div>

                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                        Price (USD) <span className="text-red-500" aria-hidden="true">*</span>
                    </label>
                    <input
                        id="price"
                        type="number"
                        name="price"
                        min="0.01"
                        step="0.01"
                        value={form.price === 0 ? '' : form.price}
                        onChange={onChange}
                        onBlur={handleBlur}
                        aria-required="true"
                        aria-invalid={touched.price && !!fieldErrors.price}
                        aria-describedby={fieldErrors.price ? 'price-error' : 'price-hint'}
                        className={inputClass('price')}
                        placeholder="e.g. 9.99"
                    />
                    {touched.price && fieldErrors.price ? (
                        <p id="price-error" className="mt-1 text-xs text-red-600" role="alert">{fieldErrors.price}</p>
                    ) : (
                        <p id="price-hint" className="mt-1 text-xs text-gray-500">Enter amount in US dollars</p>
                    )}
                </div>

                <div>
                    <label htmlFor="durationMinutes" className="block text-sm font-medium text-gray-700 mb-1">
                        Duration (minutes) <span className="text-red-500" aria-hidden="true">*</span>
                    </label>
                    <input
                        id="durationMinutes"
                        type="number"
                        name="durationMinutes"
                        min="1"
                        max="480"
                        value={form.durationMinutes === 0 ? '' : form.durationMinutes}
                        onChange={onChange}
                        onBlur={handleBlur}
                        aria-required="true"
                        aria-invalid={touched.durationMinutes && !!fieldErrors.durationMinutes}
                        aria-describedby={fieldErrors.durationMinutes ? 'duration-error' : 'duration-hint'}
                        className={inputClass('durationMinutes')}
                        placeholder="e.g. 30"
                    />
                    {touched.durationMinutes && fieldErrors.durationMinutes ? (
                        <p id="duration-error" className="mt-1 text-xs text-red-600" role="alert">{fieldErrors.durationMinutes}</p>
                    ) : (
                        <p id="duration-hint" className="mt-1 text-xs text-gray-500">Between 1 and 480 minutes</p>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="active"
                        name="active"
                        checked={form.active ?? true}
                        onChange={onChange}
                        className="h-4 w-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                    />
                    <label htmlFor="active" className="text-sm font-medium text-gray-700">
                        Active (available for booking)
                    </label>
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 bg-gray-950 text-white py-2 rounded-md hover:bg-gray-800 transition disabled:opacity-50 font-medium focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-1"
                    >
                        {submitting ? submittingLabel : submitLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 border border-gray-300 py-2 rounded-md hover:bg-gray-50 transition font-medium focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </>
    );
};

export default WashServiceForm;

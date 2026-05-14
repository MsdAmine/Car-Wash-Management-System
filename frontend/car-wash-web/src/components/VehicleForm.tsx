import React, { useState } from 'react';
import type { VehicleRequest, VehicleType } from '../types/vehicle';

const VEHICLE_TYPES: VehicleType[] = ['SEDAN', 'SUV', 'TRUCK', 'VAN', 'MOTORCYCLE', 'COUPE'];

type FieldErrors = { brand?: string; model?: string; licensePlate?: string };

function validate(form: VehicleRequest): FieldErrors {
    const errors: FieldErrors = {};
    if (!form.brand.trim()) errors.brand = 'Brand is required.';
    else if (form.brand.trim().length < 2) errors.brand = 'Brand must be at least 2 characters.';
    if (!form.model.trim()) errors.model = 'Model is required.';
    if (!form.licensePlate.trim()) errors.licensePlate = 'License plate is required.';
    else if (form.licensePlate.trim().length < 2) errors.licensePlate = 'License plate must be at least 2 characters.';
    return errors;
}

interface VehicleFormProps {
    form: VehicleRequest;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    error: string | null;
    submitting: boolean;
    submitLabel: string;
    submittingLabel: string;
}

const VehicleForm: React.FC<VehicleFormProps> = ({
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

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const name = e.target.name;
        setTouched(prev => ({ ...prev, [name]: true }));
        setFieldErrors(validate(form));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const errors = validate(form);
        if (Object.values(errors).some(Boolean)) {
            setFieldErrors(errors);
            setTouched({ brand: true, model: true, licensePlate: true });
            return;
        }
        setFieldErrors({});
        onSubmit(e);
    };

    const inputClass = (name: keyof FieldErrors) =>
        `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition ${
            touched[name] && fieldErrors[name]
                ? 'border-red-400 focus:ring-red-300'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
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
                    <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                        Brand <span className="text-red-500" aria-hidden="true">*</span>
                    </label>
                    <input
                        id="brand"
                        type="text"
                        name="brand"
                        value={form.brand}
                        onChange={onChange}
                        onBlur={handleBlur}
                        aria-required="true"
                        aria-invalid={touched.brand && !!fieldErrors.brand}
                        aria-describedby={fieldErrors.brand ? 'brand-error' : undefined}
                        className={inputClass('brand')}
                        placeholder="e.g. Toyota"
                    />
                    {touched.brand && fieldErrors.brand && (
                        <p id="brand-error" className="mt-1 text-xs text-red-600" role="alert">{fieldErrors.brand}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
                        Model <span className="text-red-500" aria-hidden="true">*</span>
                    </label>
                    <input
                        id="model"
                        type="text"
                        name="model"
                        value={form.model}
                        onChange={onChange}
                        onBlur={handleBlur}
                        aria-required="true"
                        aria-invalid={touched.model && !!fieldErrors.model}
                        aria-describedby={fieldErrors.model ? 'model-error' : undefined}
                        className={inputClass('model')}
                        placeholder="e.g. Corolla"
                    />
                    {touched.model && fieldErrors.model && (
                        <p id="model-error" className="mt-1 text-xs text-red-600" role="alert">{fieldErrors.model}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700 mb-1">
                        License Plate <span className="text-red-500" aria-hidden="true">*</span>
                    </label>
                    <input
                        id="licensePlate"
                        type="text"
                        name="licensePlate"
                        value={form.licensePlate}
                        onChange={onChange}
                        onBlur={handleBlur}
                        aria-required="true"
                        aria-invalid={touched.licensePlate && !!fieldErrors.licensePlate}
                        aria-describedby={fieldErrors.licensePlate ? 'licensePlate-error' : undefined}
                        className={inputClass('licensePlate')}
                        placeholder="e.g. ABC-1234"
                    />
                    {touched.licensePlate && fieldErrors.licensePlate && (
                        <p id="licensePlate-error" className="mt-1 text-xs text-red-600" role="alert">{fieldErrors.licensePlate}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                        Vehicle Type <span className="text-red-500" aria-hidden="true">*</span>
                    </label>
                    <select
                        id="type"
                        name="type"
                        value={form.type}
                        onChange={onChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        {VEHICLE_TYPES.map(t => (
                            <option key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase()}</option>
                        ))}
                    </select>
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
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

export default VehicleForm;

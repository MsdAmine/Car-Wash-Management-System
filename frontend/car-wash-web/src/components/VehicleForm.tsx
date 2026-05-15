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
        `w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
            touched[name] && fieldErrors[name]
                ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                : 'border-gray-200 focus:border-gray-900 focus:ring-gray-900/10'
        }`;

    return (
        <>
            {error && (
                <div
                    role="alert"
                    className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div>
                    <label htmlFor="brand" className="mb-1.5 block text-sm font-medium text-gray-700">
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
                    <label htmlFor="model" className="mb-1.5 block text-sm font-medium text-gray-700">
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
                    <label htmlFor="licensePlate" className="mb-1.5 block text-sm font-medium text-gray-700">
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
                    <label htmlFor="type" className="mb-1.5 block text-sm font-medium text-gray-700">
                        Vehicle Type <span className="text-red-500" aria-hidden="true">*</span>
                    </label>
                    <select
                        id="type"
                        name="type"
                        value={form.type}
                        onChange={onChange}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                    >
                        {VEHICLE_TYPES.map(t => (
                            <option key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase()}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 rounded-lg bg-gray-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {submitting ? submittingLabel : submitLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </>
    );
};

export default VehicleForm;

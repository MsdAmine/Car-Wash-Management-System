import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    id: string;
    error?: string;
    hint?: string;
    required?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({ label, id, error, hint, required, className, ...rest }) => {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
                {required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            <input
                id={id}
                required={required}
                {...rest}
                className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 transition ${
                    error
                        ? 'border-red-400 focus:ring-red-300'
                        : 'border-gray-300 focus:ring-blue-500'
                } ${className ?? ''}`}
            />
            {hint && !error && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
};

export default FormInput;

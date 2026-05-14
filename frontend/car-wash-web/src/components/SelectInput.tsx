import React from 'react';

export interface SelectOption {
    value: string;
    label: string;
}

interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    id: string;
    options: SelectOption[];
    placeholder?: string;
    error?: string;
    hint?: string;
    required?: boolean;
}

const SelectInput: React.FC<SelectInputProps> = ({
    label,
    id,
    options,
    placeholder,
    error,
    hint,
    required,
    className,
    ...rest
}) => {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
                {required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            <select
                id={id}
                required={required}
                {...rest}
                className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 transition bg-white ${
                    error
                        ? 'border-red-400 focus:ring-red-300'
                        : 'border-gray-300 focus:ring-blue-500'
                } ${className ?? ''}`}
            >
                {placeholder && <option value="">{placeholder}</option>}
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {hint && !error && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
};

export default SelectInput;

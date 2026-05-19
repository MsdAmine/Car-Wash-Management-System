import { type InputHTMLAttributes, useId } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export function Input({
  label,
  error,
  required,
  hint,
  className,
  ...props
}: InputProps) {
  const id = useId();

  const inputClasses = [
    'w-full border rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400',
    'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    error ? 'border-red-500' : 'border-gray-200',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input id={id} required={required} className={inputClasses} {...props} />
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!error && hint && <p className="text-sm text-gray-500">{hint}</p>}
    </div>
  );
}
